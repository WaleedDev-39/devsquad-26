import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find({ inStock: true }).exec();
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.productModel
      .find({
        category: { $regex: new RegExp(category, 'i') },
        inStock: true,
      })
      .exec();
  }

  async findByCategories(categories: string[]): Promise<Product[]> {
    if (!categories.length) return [];
    const regexArray = categories.map((cat) => new RegExp(cat, 'i'));
    return this.productModel
      .find({
        $or: [
          { category: { $in: regexArray } },
          { name: { $in: regexArray } },
          { tags: { $in: regexArray } },
        ],
        inStock: true,
      })
      .limit(6)
      .exec();
  }

  async findById(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
  }

  async seedProducts(): Promise<void> {
    const count = await this.productModel.countDocuments();
    if (count > 0) return;

    const sampleProducts = [
      {
        name: 'Vitamin B Complex',
        category: 'Vitamin B Complex',
        description: 'Complete B-vitamin formula for energy metabolism and nervous system support.',
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        price: 24.99,
        currency: 'USD',
        benefits: ['Boosts energy', 'Supports nervous system', 'Reduces fatigue'],
        tags: ['tired', 'fatigue', 'energy', 'weakness'],
        inStock: true,
        rating: 4.7,
        reviewCount: 1243,
      },
      {
        name: 'Iron Supplements',
        category: 'Iron Supplements',
        description: 'Gentle iron formula with Vitamin C for optimal absorption and energy levels.',
        imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
        price: 18.99,
        currency: 'USD',
        benefits: ['Prevents anemia', 'Increases energy', 'Supports red blood cell production'],
        tags: ['tired', 'fatigue', 'weakness', 'anemia', 'pale'],
        inStock: true,
        rating: 4.5,
        reviewCount: 892,
      },
      {
        name: 'Biotin 10000mcg',
        category: 'Biotin',
        description: 'High-potency biotin for hair, skin, and nail strength and growth.',
        imageUrl: 'https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?w=400',
        price: 19.99,
        currency: 'USD',
        benefits: ['Strengthens hair', 'Reduces hair fall', 'Improves nail strength'],
        tags: ['hair fall', 'hair loss', 'brittle nails', 'skin'],
        inStock: true,
        rating: 4.8,
        reviewCount: 3412,
      },
      {
        name: 'Zinc Complex',
        category: 'Zinc',
        description: 'Zinc picolinate for immune support, hair growth, and skin health.',
        imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400',
        price: 15.99,
        currency: 'USD',
        benefits: ['Reduces hair loss', 'Boosts immunity', 'Supports skin health'],
        tags: ['hair fall', 'hair loss', 'immunity', 'skin', 'acne'],
        inStock: true,
        rating: 4.6,
        reviewCount: 2108,
      },
      {
        name: 'Multivitamin Complete',
        category: 'Multivitamin',
        description: 'All-in-one daily multivitamin with 23 essential vitamins and minerals.',
        imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400',
        price: 29.99,
        currency: 'USD',
        benefits: ['Overall wellness', 'Fills nutritional gaps', 'Supports immunity'],
        tags: ['general wellness', 'deficiency', 'immunity', 'energy', 'hair fall'],
        inStock: true,
        rating: 4.5,
        reviewCount: 5678,
      },
      {
        name: 'Calcium + D3',
        category: 'Calcium',
        description: 'Calcium carbonate with Vitamin D3 for strong bones and teeth.',
        imageUrl: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400',
        price: 22.99,
        currency: 'USD',
        benefits: ['Strengthens bones', 'Prevents fractures', 'Supports muscle function'],
        tags: ['weak bones', 'fragile bones', 'joint pain', 'fractures', 'dental'],
        inStock: true,
        rating: 4.7,
        reviewCount: 1876,
      },
      {
        name: 'Vitamin D3 5000 IU',
        category: 'Vitamin D',
        description: 'High-strength Vitamin D3 for bone health, immunity, and mood support.',
        imageUrl: 'https://images.unsplash.com/photo-1618015359417-177fed06855e?w=400',
        price: 17.99,
        currency: 'USD',
        benefits: ['Bone health', 'Immune support', 'Mood improvement'],
        tags: ['weak bones', 'fragile bones', 'depression', 'immunity', 'winter'],
        inStock: true,
        rating: 4.9,
        reviewCount: 4521,
      },
      {
        name: 'Magnesium Glycinate',
        category: 'Magnesium',
        description: 'Highly absorbable magnesium for stress relief, sleep, and muscle relaxation.',
        imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400',
        price: 26.99,
        currency: 'USD',
        benefits: ['Reduces stress', 'Improves sleep', 'Relaxes muscles'],
        tags: ['stress', 'anxiety', 'insomnia', 'muscle cramps', 'headache'],
        inStock: true,
        rating: 4.8,
        reviewCount: 2934,
      },
      {
        name: 'Ashwagandha KSM-66',
        category: 'Ashwagandha',
        description: 'Premium KSM-66 Ashwagandha extract for stress, anxiety, and adrenal support.',
        imageUrl: 'https://images.unsplash.com/photo-1608247547498-b64d5441042d?w=400',
        price: 34.99,
        currency: 'USD',
        benefits: ['Reduces cortisol', 'Improves stress response', 'Enhances energy'],
        tags: ['stress', 'anxiety', 'fatigue', 'cortisol', 'adaptogen'],
        inStock: true,
        rating: 4.7,
        reviewCount: 1567,
      },
      {
        name: 'Omega-3 Fish Oil',
        category: 'Omega-3',
        description: 'Pharmaceutical-grade fish oil for heart, brain, and joint health.',
        imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400',
        price: 28.99,
        currency: 'USD',
        benefits: ['Heart health', 'Brain function', 'Reduces inflammation'],
        tags: ['joint pain', 'inflammation', 'heart', 'brain', 'cholesterol'],
        inStock: true,
        rating: 4.6,
        reviewCount: 3201,
      },
      {
        name: 'Vitamin C 1000mg',
        category: 'Vitamin C',
        description: 'High-dose Vitamin C with bioflavonoids for immune defense and collagen synthesis.',
        imageUrl: 'https://images.unsplash.com/photo-1607004468138-e7e23ea26947?w=400',
        price: 14.99,
        currency: 'USD',
        benefits: ['Boosts immunity', 'Antioxidant', 'Collagen production'],
        tags: ['immunity', 'cold', 'flu', 'skin', 'antioxidant'],
        inStock: true,
        rating: 4.8,
        reviewCount: 6789,
      },
      {
        name: 'Melatonin 5mg',
        category: 'Melatonin',
        description: 'Natural sleep hormone supplement for restful nights and circadian rhythm support.',
        imageUrl: 'https://images.unsplash.com/photo-1611516491426-03025e6043c8?w=400',
        price: 12.99,
        currency: 'USD',
        benefits: ['Improves sleep quality', 'Reduces insomnia', 'Jet lag support'],
        tags: ['insomnia', 'sleep problems', 'fatigue', 'circadian'],
        inStock: true,
        rating: 4.5,
        reviewCount: 4123,
      },
    ];

    await this.productModel.insertMany(sampleProducts);
    console.log('✅ Sample products seeded to MongoDB');
  }
}
