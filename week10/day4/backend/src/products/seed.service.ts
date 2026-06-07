import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

const SEED_PRODUCTS = [
  {
    name: 'Paracetamol 500mg',
    description: 'Fast-acting pain reliever and fever reducer. Safe for most adults and children over 12.',
    category: 'Pain Relief',
    price: 4.99,
    tags: ['pain', 'fever', 'headache', 'paracetamol', 'acetaminophen'],
    inStock: true,
    dosage: '500mg - 1-2 tablets every 4-6 hours',
    manufacturer: 'PharmaCare Ltd',
    imageUrl: '',
  },
  {
    name: 'Ibuprofen 400mg',
    description: 'Anti-inflammatory pain reliever. Effective for muscle pain, arthritis, and dental pain.',
    category: 'Pain Relief',
    price: 5.49,
    tags: ['pain', 'inflammation', 'arthritis', 'ibuprofen', 'muscle'],
    inStock: true,
    dosage: '400mg - 1 tablet every 6-8 hours with food',
    manufacturer: 'MediPharma Co',
    imageUrl: '',
  },
  {
    name: 'Vitamin C 1000mg',
    description: 'High-strength vitamin C supplement. Supports immune system and collagen production.',
    category: 'Vitamins & Supplements',
    price: 12.99,
    tags: ['vitamin', 'immunity', 'supplement', 'vitamin c', 'ascorbic acid'],
    inStock: true,
    dosage: '1000mg - 1 tablet daily',
    manufacturer: 'NutriVit Health',
    imageUrl: '',
  },
  {
    name: 'Omega-3 Fish Oil',
    description: 'Premium omega-3 fatty acids for heart health and brain function.',
    category: 'Vitamins & Supplements',
    price: 19.99,
    tags: ['omega-3', 'heart', 'brain', 'fish oil', 'supplement', 'cholesterol'],
    inStock: true,
    dosage: '1000mg - 2 capsules daily with meals',
    manufacturer: 'OceanHealth',
    imageUrl: '',
  },
  {
    name: 'Cetirizine 10mg',
    description: 'Non-drowsy antihistamine for allergy relief. Controls hay fever and skin reactions.',
    category: 'Allergy & Hay Fever',
    price: 7.99,
    tags: ['allergy', 'antihistamine', 'hay fever', 'sneezing', 'cetirizine'],
    inStock: true,
    dosage: '10mg - 1 tablet once daily',
    manufacturer: 'AllergyFree Labs',
    imageUrl: '',
  },
  {
    name: 'Omeprazole 20mg',
    description: 'Proton pump inhibitor for heartburn and acid reflux treatment.',
    category: 'Digestive Health',
    price: 9.99,
    tags: ['heartburn', 'acid reflux', 'stomach', 'omeprazole', 'indigestion', 'gerd'],
    inStock: true,
    dosage: '20mg - 1 capsule daily before meals',
    manufacturer: 'GastroMed',
    imageUrl: '',
  },
  {
    name: 'Multivitamin Complete',
    description: 'All-in-one daily multivitamin with 23 essential nutrients for complete health.',
    category: 'Vitamins & Supplements',
    price: 15.99,
    tags: ['multivitamin', 'daily', 'nutrients', 'complete', 'health', 'supplement'],
    inStock: true,
    dosage: '1 tablet daily with breakfast',
    manufacturer: 'NutriVit Health',
    imageUrl: '',
  },
  {
    name: 'Antacid Tablets',
    description: 'Fast relief from heartburn, indigestion and upset stomach.',
    category: 'Digestive Health',
    price: 6.49,
    tags: ['antacid', 'heartburn', 'indigestion', 'stomach', 'nausea', 'bloating'],
    inStock: true,
    dosage: '2 tablets after meals or as needed',
    manufacturer: 'ReliefCare',
    imageUrl: '',
  },
  {
    name: 'Cough Syrup 200ml',
    description: 'Soothing cough suppressant for dry and chesty coughs. Honey-lemon flavour.',
    category: 'Cold & Flu',
    price: 8.99,
    tags: ['cough', 'cold', 'flu', 'sore throat', 'syrup', 'chest'],
    inStock: true,
    dosage: '10ml every 4 hours, max 6 doses daily',
    manufacturer: 'RespiCare',
    imageUrl: '',
  },
  {
    name: 'Magnesium 375mg',
    description: 'Essential mineral supplement supporting muscle function, sleep quality, and nervous system.',
    category: 'Vitamins & Supplements',
    price: 11.99,
    tags: ['magnesium', 'sleep', 'muscle', 'cramps', 'supplement', 'relaxation'],
    inStock: true,
    dosage: '375mg - 1 tablet daily',
    manufacturer: 'NutriVit Health',
    imageUrl: '',
  },
  {
    name: 'Aspirin 75mg (Low-Dose)',
    description: 'Low-dose aspirin for heart health maintenance. Helps maintain healthy blood circulation.',
    category: 'Heart Health',
    price: 5.99,
    tags: ['aspirin', 'heart', 'blood', 'circulation', 'cardiovascular'],
    inStock: true,
    dosage: '75mg - 1 tablet daily',
    manufacturer: 'CardioMed',
    imageUrl: '',
  },
  {
    name: 'Probiotic 10 Billion CFU',
    description: 'Advanced probiotic with 10 strains to restore gut flora and improve digestion.',
    category: 'Digestive Health',
    price: 24.99,
    tags: ['probiotic', 'gut', 'digestion', 'bacteria', 'bloating', 'ibs'],
    inStock: true,
    dosage: '1 capsule daily before breakfast',
    manufacturer: 'GutHealth Labs',
    imageUrl: '',
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.productModel.countDocuments();
    if (count === 0) {
      await this.productModel.insertMany(SEED_PRODUCTS);
      console.log('✅ Healthcare products seeded to MongoDB');
    }
  }
}
