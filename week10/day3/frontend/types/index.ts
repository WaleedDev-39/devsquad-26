export interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
  currency: string;
  benefits: string[];
  tags: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export interface SymptomResponse {
  message: string;
  products: Product[];
  reasoning: string;
  detectedSymptoms: string[];
  confidenceScore: number;
  needsFollowUp: boolean;
  followUpQuestion?: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  products?: Product[];
  detectedSymptoms?: string[];
  confidenceScore?: number;
  isLoading?: boolean;
  needsFollowUp?: boolean;
  followUpQuestion?: string;
}
