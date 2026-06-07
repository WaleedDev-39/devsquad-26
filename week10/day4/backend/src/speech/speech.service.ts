import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { toFile } from 'groq-sdk';
import { Readable } from 'stream';

@Injectable()
export class SpeechService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async transcribe(file: Express.Multer.File): Promise<string> {
    const readable = Readable.from(file.buffer);
    const groqFile = await toFile(readable, file.originalname || 'audio.webm', {
      type: file.mimetype || 'audio/webm',
    });

    const transcription = await this.groq.audio.transcriptions.create({
      file: groqFile,
      model: 'whisper-large-v3',
      response_format: 'text',
      language: 'en',
    });

    return (transcription as any).trim?.() ?? String(transcription).trim();
  }
}
