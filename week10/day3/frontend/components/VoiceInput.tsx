'use client';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [interim, setInterim] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionClass);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      setInterim(interimText);
      if (finalText) {
        onTranscript(finalText.trim());
        setInterim('');
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setInterim('');
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterim('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onTranscript]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterim('');
  }, []);

  if (!isSupported) return null;

  return (
    <div className="voice-wrapper">
      {interim && (
        <div className="interim-text">
          <span className="interim-dot"></span>
          {interim}
        </div>
      )}
      <button
        type="button"
        className={`voice-btn ${isListening ? 'voice-btn-active' : ''}`}
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        title={isListening ? 'Stop listening' : 'Speak your symptoms'}
        aria-label={isListening ? 'Stop recording' : 'Start voice input'}
      >
        {isListening ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="icon-mic">
            <rect x="9" y="9" width="6" height="6" rx="1" />
            <path d="M12 1a4 4 0 014 4v5a4 4 0 01-8 0V5a4 4 0 014-4z" opacity="0.3" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="icon-mic">
            <path d="M12 1a4 4 0 014 4v5a4 4 0 01-8 0V5a4 4 0 014-4z" />
            <path d="M19 10v1a7 7 0 01-14 0v-1M12 18v5M8 23h8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        )}
        {isListening && <span className="pulse-ring"></span>}
      </button>
    </div>
  );
}
