import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ProductsService } from '../products/products.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { CheckSymptomDto } from './dto/check-symptom.dto';
import {
  SYMPTOM_CATEGORY_MAP,
  FOLLOW_UP_TRIGGERS,
} from './symptom-map';

interface SymptomAnalysis {
  detectedSymptoms: string[];
  suggestedCategories: string[];
  reasoning: string;
  confidenceScore: number;
  needsFollowUp: boolean;
  followUpQuestion?: string;
}

export interface SymptomCheckerResponse {
  message: string;
  products: any[];
  reasoning: string;
  detectedSymptoms: string[];
  confidenceScore: number;
  needsFollowUp: boolean;
  followUpQuestion?: string;
}

@Injectable()
export class SymptomCheckerService {
  private readonly logger = new Logger(SymptomCheckerService.name);
  private llm: ChatOpenAI;

  constructor(
    private readonly productsService: ProductsService,
    private readonly analyticsService: AnalyticsService,
  ) {
    const apiKey = process.env.OPENAI_API_KEY;
    const isGroq = apiKey?.startsWith('gsk_');

    this.llm = new ChatOpenAI({
      modelName: isGroq ? 'llama-3.1-8b-instant' : 'gpt-3.5-turbo',
      temperature: 0.3, 
      openAIApiKey: apiKey,
      configuration: isGroq
        ? {
            baseURL: 'https://api.groq.com/openai/v1',
          }
        : undefined,
    });
  }

  async analyzeSymptoms(dto: CheckSymptomDto): Promise<SymptomCheckerResponse> {
    const { symptomText, sessionId } = dto;

    // Step 1: Use AI + LangGraph-style chaining to analyze symptoms
    const analysis = await this.runAIAnalysis(symptomText);

    // Step 2: Fallback — also check our curated map for extra categories
    const fallbackCategories = this.getCuratedCategories(symptomText);
    const allCategories = [
      ...new Set([...analysis.suggestedCategories, ...fallbackCategories]),
    ];

    // Step 3: Fetch matching products from MongoDB
    const products = await this.productsService.findByCategories(allCategories);

    // Step 4: Save query to analytics collection
    if (sessionId || symptomText) {
      await this.analyticsService.saveQuery({
        symptomText,
        detectedSymptoms: analysis.detectedSymptoms,
        suggestedCategories: allCategories,
        productIds: products.map((p: any) => p._id?.toString()),
        aiReasoning: analysis.reasoning,
        confidenceScore: analysis.confidenceScore,
        hadFollowUp: analysis.needsFollowUp,
        sessionId: sessionId || 'anonymous',
      });
    }

    // Step 5: Build the chat response message
    const message = this.buildResponseMessage(
      analysis,
      products,
      symptomText,
    );

    return {
      message,
      products,
      reasoning: analysis.reasoning,
      detectedSymptoms: analysis.detectedSymptoms,
      confidenceScore: analysis.confidenceScore,
      needsFollowUp: analysis.needsFollowUp,
      followUpQuestion: analysis.followUpQuestion,
    };
  }

  private async runAIAnalysis(symptomText: string): Promise<SymptomAnalysis> {
    const systemPrompt = `You are a healthcare supplement advisor AI. Your job is to:
1. Identify specific symptoms from user input
2. Map those symptoms to supplement categories
3. Provide reasoning for your recommendations
4. Rate your confidence (0-1)
5. Ask a follow-up question only if the symptom is ambiguous

Available supplement categories:
- Vitamin B Complex (for: fatigue, tiredness, low energy, weakness, anemia)
- Iron Supplements (for: fatigue, weakness, anemia, pale skin, dizziness)
- Biotin (for: hair loss, brittle hair, nail problems, skin issues)
- Zinc (for: hair loss, immune weakness, skin problems, acne)
- Multivitamin (for: general deficiency, hair loss, fatigue)
- Calcium (for: weak bones, fragile bones, muscle cramps, dental issues)
- Vitamin D (for: weak bones, depression, immunity, winter fatigue)
- Magnesium (for: stress, anxiety, insomnia, muscle cramps, headaches)
- Ashwagandha (for: stress, anxiety, adrenal fatigue, cortisol)
- Omega-3 (for: joint pain, inflammation, heart health, brain fog)
- Vitamin C (for: immunity, colds, flu, skin, antioxidant)
- Melatonin (for: insomnia, sleep disorders, jet lag)

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "detectedSymptoms": ["symptom1", "symptom2"],
  "suggestedCategories": ["Category1", "Category2", "Category3"],
  "reasoning": "Brief explanation of why these supplements help with the detected symptoms.",
  "confidenceScore": 0.85,
  "needsFollowUp": false,
  "followUpQuestion": null
}

If symptoms are ambiguous, set needsFollowUp to true and provide a followUpQuestion.
If confidence is below 0.5, always ask a follow-up question.
Suggest 2-3 categories maximum.`;

    try {
      const response = await this.llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(`User symptoms: "${symptomText}"`),
      ]);

      const content = response.content as string;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in AI response');

      const parsed = JSON.parse(jsonMatch[0]) as SymptomAnalysis;
      this.logger.log(`AI Analysis: confidence=${parsed.confidenceScore}, categories=${parsed.suggestedCategories.join(', ')}`);
      return parsed;
    } catch (error) {
      this.logger.error('AI analysis failed, using fallback', error);
      return this.getFallbackAnalysis(symptomText);
    }
  }

  private getCuratedCategories(symptomText: string): string[] {
    const lowerText = symptomText.toLowerCase();
    const categories: string[] = [];

    for (const [keyword, cats] of Object.entries(SYMPTOM_CATEGORY_MAP)) {
      if (lowerText.includes(keyword)) {
        categories.push(...cats);
      }
    }

    return [...new Set(categories)];
  }

  private getFallbackAnalysis(symptomText: string): SymptomAnalysis {
    const categories = this.getCuratedCategories(symptomText);
    const hasFollowUp = FOLLOW_UP_TRIGGERS.some((trigger) =>
      symptomText.toLowerCase().includes(trigger),
    );

    return {
      detectedSymptoms: [symptomText],
      suggestedCategories: categories.slice(0, 3),
      reasoning:
        'Based on common symptom patterns, these supplements may help address your concerns.',
      confidenceScore: categories.length > 0 ? 0.65 : 0.3,
      needsFollowUp: hasFollowUp || categories.length === 0,
      followUpQuestion:
        hasFollowUp || categories.length === 0
          ? 'Could you describe your symptoms in more detail? For example, how long have you been experiencing this?'
          : undefined,
    };
  }

  private buildResponseMessage(
    analysis: SymptomAnalysis,
    products: any[],
    originalText: string,
  ): string {
    if (analysis.needsFollowUp && analysis.confidenceScore < 0.5) {
      return `I noticed you mentioned: "${originalText}". ${analysis.followUpQuestion}`;
    }

    const symptomsStr = analysis.detectedSymptoms.join(', ');
    const categoriesStr = analysis.suggestedCategories.join(', ');

    if (products.length === 0) {
      return `I analyzed your symptoms (${symptomsStr}) but couldn't find matching products in our catalog. Please consult a healthcare professional.`;
    }

    return `${analysis.reasoning}\n\nBased on your symptoms, I recommend these supplements: **${categoriesStr}** 👇`;
  }
}
