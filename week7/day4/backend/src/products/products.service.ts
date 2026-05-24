import { Injectable, Logger } from '@nestjs/common';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  description: string;
  badge?: string;
}

// Mock products using local assets (served via frontend /public/assets/)
// Replace HYGRAPH_ENDPOINT and HYGRAPH_TOKEN in .env to pull live data.
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Air Jordan 1 Mid Light Smoke Grey',
    slug: 'air-jordan-1-mid-light-smoke-grey',
    price: 20.99,
    image: '/assets/shoe_1.png',
    category: 'ALL',
    description: 'Classic Air Jordan silhouette with premium materials.',
    badge: 'NEW',
  },
  {
    id: '2',
    name: 'Air Max 200 SE',
    slug: 'air-max-200-se',
    price: 20.99,
    image: '/assets/shoe_2.png',
    category: 'ALL',
    description: 'Lightweight running shoe with Max Air cushioning.',
    badge: 'NEW',
  },
  {
    id: '3',
    name: 'Air Max 97',
    slug: 'air-max-97',
    price: 20.99,
    image: '/assets/shoe_3.png',
    category: 'WORKOUT',
    description: 'Iconic full-length Air cushioning for all-day comfort.',
  },
  {
    id: '4',
    name: 'React Presto',
    slug: 'react-presto',
    price: 20.99,
    image: '/assets/shoe_4.png',
    category: 'RUN',
    description: 'React foam midsole for ultra-responsive cushioning.',
  },
  {
    id: '5',
    name: 'KD13 EP',
    slug: 'kd13-ep',
    price: 20.99,
    image: '/assets/shoe_5.png',
    category: 'FOOTBALL',
    description: "Kevin Durant's signature basketball shoe.",
  },
  {
    id: '6',
    name: 'Nike Air Max Classic',
    slug: 'nike-air-max-classic',
    price: 16.79,
    image: '/assets/shoe_6.png',
    category: 'WORKOUT',
    description: 'First purchase discount – 20% off your order.',
    badge: '-20%',
  },
  {
    id: '7',
    name: 'Nike Presto Premium',
    slug: 'nike-presto-premium',
    price: 16.79,
    image: '/assets/shoe_7.png',
    category: 'RUN',
    description: 'First purchase discount – 20% off your order.',
    badge: '-20%',
  },
];

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  async getProducts(): Promise<Product[]> {
    const endpoint = process.env.HYGRAPH_ENDPOINT;
    const token = process.env.HYGRAPH_TOKEN;

    if (endpoint && endpoint.includes('YOUR_PROJECT_ID') === false && endpoint.trim() !== '') {
      try {
        const { GraphQLClient, gql } = await import('graphql-request');
        const client = new GraphQLClient(endpoint, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const query = gql`
          query GetProducts {
            products {
              id
              name
              slug
              price
              category
              description
              badge
              image {
                url
              }
            }
          }
        `;
        const data: any = await client.request(query);
        const products = data.products.map((p: any) => ({
          ...p,
          image: p.image?.url || '/assets/shoe_1.png',
        }));
        this.logger.log(`Fetched ${products.length} products from Hygraph`);
        return products;
      } catch (err) {
        this.logger.warn('Hygraph fetch failed, using mock data: ' + err.message);
      }
    } else {
      this.logger.log('No Hygraph endpoint configured — using mock products');
    }

    return MOCK_PRODUCTS;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id);
  }
}
