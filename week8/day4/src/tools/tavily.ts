import { tool } from '@openai/agents';
import { z } from 'zod';

let searchCount = 0;
let _emitter: ((query: string, count: number) => void) | null = null;

export function resetSearchCount() {
  searchCount = 0;
}

export function getSearchCount() {
  return searchCount;
}

export function setEventEmitter(fn: (query: string, count: number) => void) {
  _emitter = fn;
}

function getSimulatedData(query: string): string {
  const q = query.toLowerCase();
  const results: Array<{ title: string; url: string; content: string }> = [];

  if (q.includes('stripe') && (q.includes('pakistan') || q.includes('saas') || q.includes('pricing'))) {
    results.push({
      title: "How to use Stripe in Pakistan: A Complete Guide",
      url: "https://example.com/stripe-pakistan-guide",
      content: "Stripe does not officially support Pakistan for local merchant accounts. To use Stripe in Pakistan, SaaS founders typically use Stripe Atlas to incorporate a C-Corp or LLC in the US, or register a company in the UK. This allows them to open a US/UK bank account and connect it to Stripe."
    });
    results.push({
      title: "Stripe Pricing and Fees - Official Support",
      url: "https://stripe.com/pricing",
      content: "Standard Stripe pricing is 2.9% + $0.30 per successful card charge. For international cards, an additional 1% fee applies, plus a 1% currency conversion fee if applicable. UK entities get cheaper rates (1.5% + 20p for EEA cards)."
    });
  }
  
  if (q.includes('razorpay') && (q.includes('pakistan') || q.includes('saas') || q.includes('pricing'))) {
    results.push({
      title: "Does Razorpay support merchant accounts in Pakistan?",
      url: "https://example.com/razorpay-pakistan-support",
      content: "Razorpay is an Indian payment gateway and does not support Pakistan-registered companies or bank accounts. To use Razorpay, a business must be registered in India with an Indian bank account and local tax registration (GSTIN)."
    });
    results.push({
      title: "Razorpay Pricing & Transaction Fees",
      url: "https://razorpay.com/pricing",
      content: "Razorpay charges a standard 2% fee per transaction for Indian debit/credit cards, UPI, and net banking. For international cards and AMEX, the transaction fee is 3%."
    });
  }

  if (results.length === 0 || q.includes('comparison') || q.includes('versus') || q.includes('vs')) {
    results.push({
      title: "SaaS Payment Gateways in Pakistan: Stripe vs Razorpay vs Local Options",
      url: "https://example.com/pakistan-saas-payment-gateways",
      content: "For a SaaS in Pakistan, Stripe (via Stripe Atlas) is the industry standard for global customers. Razorpay is not viable due to cross-border restrictions between India and Pakistan. Local alternatives include Safepay, PayFast, and bsecure, which support local credit cards and bank transfers but have limited global reach."
    });
    results.push({
      title: "Safepay - Pakistan's Payment Gateway for Modern Businesses",
      url: "https://www.getsafepay.com",
      content: "Safepay is a popular Y-Combinator backed payment gateway in Pakistan. It supports Visa, Mastercard, and local digital wallets. Excellent for local SaaS billing, but lacks built-in subscription management comparable to Stripe Billing."
    });
  }

  return JSON.stringify(results, null, 2);
}

export const tavilySearch = tool({
  description: 'Search the web for real-time facts, pricing, regional support, and comparisons. Use this to search when information is not known to your training data. Returns a list of results with title, URL, and a snippet of content.',
  parameters: z.object({
    query: z.string().describe('The search query to run, e.g. "Stripe pricing in Pakistan 2026"'),
  }),
  execute: async ({ query }) => {
    searchCount++;
    if (searchCount > 5) {
      console.log(`⚠️ Search limit of 5 exceeded! Blocking query: "${query}"`);
      return JSON.stringify({
        error: "Search limit of 5 searches per run has been reached. Please synthesize the findings using the information already retrieved. Do not call this tool again.",
      });
    }

    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey || apiKey.includes('placeholder') || apiKey.trim() === '') {
      console.log(`⚠️ TAVILY_API_KEY is not set. Using simulated data for: "${query}"`);
      if (_emitter) _emitter(query, searchCount);
      return getSimulatedData(query);
    }

    try {
      console.log(`🔍 [Tavily Search ${searchCount}/5] Query: "${query}"`);
      if (_emitter) _emitter(query, searchCount);
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey,
          query: query,
          search_depth: 'basic',
          max_results: 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavily API responded with status: ${response.status}`);
      }

      const data: any = await response.json();

      const results = (data.results || []).map((r: any) => ({
        title: r.title || 'No Title',
        url: r.url || '',
        content: r.content || '',
      }));

      return JSON.stringify(results, null, 2);
    } catch (error: any) {
      console.error('❌ Tavily search error:', error.message);
      return JSON.stringify({
        error: `Failed to execute search: ${error.message}. Please try again or use your existing knowledge if necessary.`,
      });
    }
  },
});
