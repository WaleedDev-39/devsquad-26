import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Groq from 'groq-sdk';
import { randomUUID } from 'node:crypto';
import { ChatSession, ChatSessionDocument } from './schemas/chat-session.schema';
import { VoiceQuery, VoiceQueryDocument } from './schemas/voice-query.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ChatService {
  private groq: Groq;

  constructor(
    @InjectModel(ChatSession.name)
    private chatSessionModel: Model<ChatSessionDocument>,
    @InjectModel(VoiceQuery.name)
    private voiceQueryModel: Model<VoiceQueryDocument>,
    private readonly productsService: ProductsService,
  ) {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async createSession(): Promise<string> {
    const sessionId = randomUUID();
    await this.chatSessionModel.create({ sessionId, messages: [] });
    return sessionId;
  }

  async sendMessage(
    sessionId: string,
    userMessage: string,
    source: 'voice' | 'text' = 'text',
  ) {
    // 1. Get or create session
    let session = await this.chatSessionModel.findOne({ sessionId });
    if (!session) {
      session = await this.chatSessionModel.create({ sessionId, messages: [] });
    }

    // 2. Search products by user query
    const products = await this.productsService.search(userMessage);

    // 3. Build system prompt
    const systemPrompt = `You are MediBot, a friendly and knowledgeable healthcare products assistant. 
Your role is to help users find the right healthcare products, provide dosage information, and answer health-related questions.

Available products matching the query:
${products.map((p) => `- ${p.name} (${p.category}): ${p.description}. Price: £${(p as any).price}. Dosage: ${(p as any).dosage || 'N/A'}`).join('\n')}

Guidelines:
- Be warm, empathetic, and professional
- Always recommend consulting a doctor for serious conditions
- If products are available, mention them naturally in your response
- Keep responses concise (2-4 sentences) but helpful
- For voice queries, use clear and conversational language
- Never give specific medical diagnoses`;

    // 4. Build messages history
    const historyMessages = session.messages.slice(-6).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // 5. Call Groq
    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...historyMessages,
        { role: 'user', content: userMessage },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const assistantReply =
      completion.choices[0]?.message?.content ||
      'I apologize, I could not process your request. Please try again.';

    // 6. Save to session
    session.messages.push({ role: 'user', content: userMessage, timestamp: new Date() });
    session.messages.push({
      role: 'assistant',
      content: assistantReply,
      timestamp: new Date(),
    });
    await session.save();

    // 7. Log voice/text query analytics
    await this.voiceQueryModel.create({
      sessionId,
      transcript: userMessage,
      source,
      productsReturned: products.map((p) => (p as any)._id?.toString() || p.name),
      intentDetected: this.detectIntent(userMessage),
    });

    return {
      reply: assistantReply,
      products: products.slice(0, 4),
      sessionId,
    };
  }

  private detectIntent(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes('pain') || lower.includes('ache') || lower.includes('hurt')) return 'pain_relief';
    if (lower.includes('cold') || lower.includes('flu') || lower.includes('cough')) return 'cold_flu';
    if (lower.includes('allerg') || lower.includes('sneez')) return 'allergy';
    if (lower.includes('vitamin') || lower.includes('supplement')) return 'supplements';
    if (lower.includes('stomach') || lower.includes('digest') || lower.includes('heartburn')) return 'digestive';
    if (lower.includes('heart') || lower.includes('blood')) return 'heart_health';
    if (lower.includes('sleep') || lower.includes('insomni')) return 'sleep';
    return 'general';
  }

  async getSession(sessionId: string) {
    return this.chatSessionModel.findOne({ sessionId });
  }

  async getAnalytics() {
    const total = await this.voiceQueryModel.countDocuments();
    const voice = await this.voiceQueryModel.countDocuments({ source: 'voice' });
    const text = await this.voiceQueryModel.countDocuments({ source: 'text' });
    const intents = await this.voiceQueryModel.aggregate([
      { $group: { _id: '$intentDetected', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return { total, voice, text, intents };
  }
}
