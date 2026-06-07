export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  tags: string[];
  inStock: boolean;
  dosage?: string;
  manufacturer?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  source?: 'voice' | 'text';
  products?: Product[];
}
