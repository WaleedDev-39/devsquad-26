import axios from 'axios';
import { SymptomResponse } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

export async function checkSymptoms(
  symptomText: string,
  sessionId?: string,
): Promise<SymptomResponse> {
  const { data } = await api.post<SymptomResponse>('/symptom-checker', {
    symptomText,
    sessionId,
  });
  return data;
}

export async function getProducts(category?: string) {
  const { data } = await api.get('/products', {
    params: category ? { category } : undefined,
  });
  return data;
}

export async function getAnalytics() {
  const [topSymptoms, topCategories, total] = await Promise.all([
    api.get('/analytics/top-symptoms'),
    api.get('/analytics/top-categories'),
    api.get('/analytics/total'),
  ]);
  return {
    topSymptoms: topSymptoms.data,
    topCategories: topCategories.data,
    total: total.data,
  };
}
