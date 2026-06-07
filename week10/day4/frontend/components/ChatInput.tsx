'use client';

import { useState, useRef } from 'react';
import { Message } from './types';

interface ChatInputProps {
  onSend: (text: string, source: 'voice' | 'text') => void;
  isLoading: boolean;
  voiceMode: boolean;
}

export default function ChatInput({ onSend, isLoading, voiceMode }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = (overrideText?: string, source: 'voice' | 'text' = 'text') => {
    const msg = (overrideText ?? text).trim();
    if (!msg || isLoading) return;
    onSend(msg, source);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // ─── Web Speech API (browser native) ───
  const startWebSpeech = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback to MediaRecorder + Groq Whisper
      startMediaRecorder();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    setIsRecording(true);

    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setText(final || interim);
    };

    recognition.onend = () => {
      setIsRecording(false);
      // If voice mode, auto-send
      if (voiceMode) {
        setTimeout(() => {
          const currentText = textareaRef.current?.value?.trim();
          if (currentText) {
            onSend(currentText, 'voice');
            setText('');
          }
        }, 300);
      }
    };

    recognition.onerror = (e: any) => {
      console.warn('Web Speech error:', e.error);
      setIsRecording(false);
      // Fallback to Whisper if speech API fails
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        startMediaRecorder();
      }
    };

    recognition.start();
  };

  const stopWebSpeech = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  // ─── MediaRecorder + Groq Whisper (fallback) ───
  const startMediaRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      setIsRecording(true);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        await transcribeWithWhisper(blob, mimeType);
      };

      recorder.start(250);
    } catch (err) {
      console.error('Mic access denied:', err);
      setIsRecording(false);
    }
  };

  const stopMediaRecorder = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const transcribeWithWhisper = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    try {
      const ext = mimeType.includes('ogg') ? 'ogg' : 'webm';
      const formData = new FormData();
      formData.append('file', blob, `recording.${ext}`);

      const res = await fetch(`${API}/speech/to-text`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.text) {
        setText(data.text);
        if (voiceMode) {
          onSend(data.text, 'voice');
          setText('');
        }
      }
    } catch (err) {
      console.error('Whisper transcription error:', err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition && recognitionRef.current) {
        stopWebSpeech();
      } else {
        stopMediaRecorder();
      }
    } else {
      startWebSpeech();
    }
  };

  return (
    <div className="chat-input-area">
      <div className={`chat-input-wrapper ${isRecording ? 'recording' : ''}`}>
        {isRecording ? (
          <div className="recording-label">
            <span className="dot" />
            <div className="waveform">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="waveform-bar" style={{ animationDelay: `${(i-1) * 0.1}s` }} />
              ))}
            </div>
            <span>Listening…</span>
          </div>
        ) : isTranscribing ? (
          <div className="recording-label">
            <span style={{ color: 'var(--accent-amber)' }}>⏳</span>
            <span style={{ color: 'var(--accent-amber)' }}>Transcribing…</span>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Ask about medications, vitamins, or health products…"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={1}
            id="chat-input"
          />
        )}

        <div className="input-actions">
          <button
            className={`icon-btn mic-btn ${isRecording ? 'recording' : ''}`}
            onClick={handleMicClick}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
            id="mic-btn"
          >
            {isRecording ? '⏹' : '🎤'}
          </button>

          <button
            className="icon-btn send-btn"
            onClick={() => handleSend(undefined, 'text')}
            disabled={(!text.trim() && !isRecording) || isLoading}
            title="Send message"
            id="send-btn"
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>

      <p className="input-hint">
        {isRecording
          ? 'Speak clearly — click ⏹ when done'
          : 'Press Enter to send · 🎤 for voice · Shift+Enter for new line'}
      </p>
    </div>
  );
}
