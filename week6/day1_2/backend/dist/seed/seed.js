"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopco';
const productImages = [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
    'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400',
    'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400',
];
const products = [
    {
        name: 'T-Shirt with Tape Details',
        description: 'A stylish t-shirt crafted from soft breathable fabric, perfect for any casual occasion. The tape detail accents give it a unique urban aesthetic.',
        images: [productImages[0], productImages[1]],
        price: 120, originalPrice: null, stock: 50,
        category: 'T-shirts', subCategory: 'Casual', colors: ['#000000', '#FFFFFF', '#4A90D9'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large'],
        rating: 4.5, reviewCount: 130, isOnSale: false, salePercent: 0,
        purchaseType: 'money', brand: 'SHOP.CO', dressStyle: 'Casual',
        tags: ['t-shirt', 'casual', 'tape'], isNewArrival: true, isTopSelling: false,
    },
    {
        name: 'Skinny Fit Jeans',
        description: 'Classic skinny fit jeans that hug your silhouette perfectly. Made from premium denim with slight stretch for all-day comfort.',
        images: [productImages[2], productImages[3]],
        price: 240, originalPrice: 260, stock: 35,
        category: 'Jeans', subCategory: 'Casual', colors: ['#1A237E', '#37474F'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'],
        rating: 3.5, reviewCount: 98, isOnSale: true, salePercent: 20,
        purchaseType: 'money', brand: 'SHOP.CO', dressStyle: 'Casual',
        tags: ['jeans', 'skinny', 'denim'], isNewArrival: true, isTopSelling: false,
    },
    {
        name: 'Checkered Shirt',
        description: 'A classic checkered shirt with a relaxed silhouette. Versatile enough for both casual and smart-casual settings.',
        images: [productImages[4], productImages[5]],
        price: 180, originalPrice: null, stock: 40,
        category: 'Shirts', subCategory: 'Casual', colors: ['#B71C1C', '#1A237E', '#000000'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large'],
        rating: 4.5, reviewCount: 110, isOnSale: false, salePercent: 0,
        purchaseType: 'money', brand: 'SHOP.CO', dressStyle: 'Casual',
        tags: ['shirt', 'checkered', 'casual'], isNewArrival: true, isTopSelling: false,
    },
    {
        name: 'Sleeve Striped T-Shirt',
        description: 'Eye-catching sleeve-striped t-shirt with a modern cut. The contrasting colors make it a statement piece for any wardrobe.',
        images: [productImages[6], productImages[7]],
        price: 130, originalPrice: 160, stock: 25,
        category: 'T-shirts', subCategory: 'Casual', colors: ['#FF6F00', '#000000'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'],
        rating: 4.5, reviewCount: 145, isOnSale: true, salePercent: 30,
        purchaseType: 'money', brand: 'SHOP.CO', dressStyle: 'Casual',
        tags: ['t-shirt', 'striped', 'colorblock'], isNewArrival: true, isTopSelling: false,
    },
    {
        name: 'Vertical Striped Shirt',
        description: 'Elegant vertical striped dress shirt perfect for formal and business-casual settings. Tailored fit for a polished look.',
        images: [productImages[8], productImages[9]],
        price: 212, originalPrice: 232, stock: 20,
        category: 'Shirts', subCategory: 'Formal', colors: ['#4CAF50', '#FFFFFF'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large'],
        rating: 5.0, reviewCount: 200, isOnSale: true, salePercent: 20,
        purchaseType: 'money', brand: 'SHOP.CO', dressStyle: 'Formal',
        tags: ['shirt', 'formal', 'striped'], isNewArrival: false, isTopSelling: true,
    },
    {
        name: 'Courage Graphic T-Shirt',
        description: 'Bold graphic tee with modern artwork. Made from 100% organic cotton for supreme comfort and breathability.',
        images: [productImages[10], productImages[11]],
        price: 145, originalPrice: null, stock: 60,
        category: 'T-shirts', subCategory: 'Casual', colors: ['#BF360C', '#000000'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'],
        rating: 4.0, reviewCount: 88, isOnSale: false, salePercent: 0,
        purchaseType: 'money', brand: 'SHOP.CO', dressStyle: 'Casual',
        tags: ['t-shirt', 'graphic', 'organic'], isNewArrival: false, isTopSelling: true,
    },
    {
        name: 'Loose Fit Bermuda Shorts',
        description: 'Relaxed bermuda shorts ideal for summer. Lightweight fabric and adjustable waist for maximum comfort.',
        images: [productImages[0], productImages[2]],
        price: 80, originalPrice: null, stock: 45,
        category: 'Shorts', subCategory: 'Casual', colors: ['#1E88E5', '#37474F'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large'],
        rating: 3.0, reviewCount: 56, isOnSale: false, salePercent: 0,
        purchaseType: 'money', brand: 'SHOP.CO', dressStyle: 'Casual',
        tags: ['shorts', 'bermuda', 'summer'], isNewArrival: false, isTopSelling: true,
    },
    {
        name: 'Faded Skinny Jeans',
        description: 'Trendy faded skinny jeans with a vintage wash for a worn-in look. Great for everyday casual wear.',
        images: [productImages[4], productImages[6]],
        price: 210, originalPrice: null, stock: 30,
        category: 'Jeans', subCategory: 'Casual', colors: ['#263238'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large'],
        rating: 4.5, reviewCount: 175, isOnSale: false, salePercent: 0,
        purchaseType: 'money', brand: 'SHOP.CO', dressStyle: 'Casual',
        tags: ['jeans', 'faded', 'skinny'], isNewArrival: false, isTopSelling: true,
    },
    {
        name: 'Gradient Graphic T-Shirt',
        description: 'Vibrant gradient graphic tee that turns heads. Crafted from soft jersey fabric for all-day wear comfort.',
        images: [productImages[8], productImages[10]],
        price: 145, originalPrice: 242, stock: 55,
        category: 'T-shirts', subCategory: 'Party', colors: ['#FFFFFF', '#FF4081'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large'],
        rating: 3.5, reviewCount: 73, isOnSale: true, salePercent: 40,
        purchaseType: 'hybrid', pointsPrice: 500, brand: 'SHOP.CO', dressStyle: 'Party',
        tags: ['t-shirt', 'gradient', 'graphic'], isNewArrival: false, isTopSelling: false,
    },
    {
        name: 'Polo with Tipping Details',
        description: 'Classic polo shirt with elegant tipping detail on collar and cuffs. Perfect for smart casual occasions.',
        images: [productImages[1], productImages[3]],
        price: 180, originalPrice: 242, stock: 28,
        category: 'Shirts', subCategory: 'Formal', colors: ['#795548', '#FFFFFF'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large'],
        rating: 4.5, reviewCount: 120, isOnSale: true, salePercent: 25,
        purchaseType: 'money', brand: 'SHOP.CO', dressStyle: 'Formal',
        tags: ['polo', 'formal', 'tipping'], isNewArrival: false, isTopSelling: false,
    },
    {
        name: 'Black Striped T-Shirt',
        description: 'Minimalist black and white striped t-shirt. The classic pattern never goes out of style and pairs with almost anything.',
        images: [productImages[5], productImages[7]],
        price: 120, originalPrice: 150, stock: 42,
        category: 'T-shirts', subCategory: 'Casual', colors: ['#000000', '#FFFFFF'],
        sizes: ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large'],
        rating: 5.0, reviewCount: 250, isOnSale: true, salePercent: 30,
        purchaseType: 'money', brand: 'SHOP.CO', dressStyle: 'Casual',
        tags: ['t-shirt', 'striped', 'minimal'], isNewArrival: false, isTopSelling: false,
    },
    {
        name: 'One Life Graphic T-Shirt',
        description: 'This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.',
        images: [productImages[9], productImages[11]],
        price: 260, originalPrice: 300, stock: 15,
        category: 'T-shirts', subCategory: 'Casual', colors: ['#33691E', '#37474F', '#1A237E'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large'],
        rating: 4.5, reviewCount: 451, isOnSale: true, salePercent: 40,
        purchaseType: 'money', brand: 'SHOP.CO', dressStyle: 'Casual',
        tags: ['t-shirt', 'graphic', 'one-life'], isNewArrival: false, isTopSelling: false,
    },
    {
        name: 'Polo with Contrast Trims',
        description: 'Smart polo shirt featuring contrast trim detailing. The slim fit cut makes it ideal for both gym and casual wear.',
        images: [productImages[0], productImages[4]],
        price: 212, originalPrice: 242, stock: 33,
        category: 'Shirts', subCategory: 'Gym', colors: ['#1565C0', '#FFFFFF'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large'],
        rating: 4.0, reviewCount: 95, isOnSale: true, salePercent: 20,
        purchaseType: 'points', pointsPrice: 800, brand: 'SHOP.CO', dressStyle: 'Gym',
        tags: ['polo', 'gym', 'contrast'], isNewArrival: false, isTopSelling: false,
    },
    {
        name: 'Party Sequin Blouse',
        description: 'Dazzling sequin blouse perfect for parties and special occasions. The shimmering fabric catches the light beautifully.',
        images: [productImages[2], productImages[6]],
        price: 195, originalPrice: null, stock: 18,
        category: 'Shirts', subCategory: 'Party', colors: ['#FFD700', '#C0392B'],
        sizes: ['X-Small', 'Small', 'Medium', 'Large'],
        rating: 4.8, reviewCount: 67, isOnSale: false, salePercent: 0,
        purchaseType: 'money', brand: 'SHOP.CO', dressStyle: 'Party',
        tags: ['blouse', 'party', 'sequin'], isNewArrival: false, isTopSelling: false,
    },
    {
        name: 'Gym Performance Hoodie',
        description: 'Technical performance hoodie with moisture-wicking fabric. Designed for intense workouts with full range of motion.',
        images: [productImages[9], productImages[10]],
        price: 165, originalPrice: null, stock: 40,
        category: 'Hoodies', subCategory: 'Gym', colors: ['#212121', '#37474F', '#1565C0'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'],
        rating: 4.7, reviewCount: 189, isOnSale: false, salePercent: 0,
        purchaseType: 'hybrid', pointsPrice: 600, brand: 'SHOP.CO', dressStyle: 'Gym',
        tags: ['hoodie', 'gym', 'performance'], isNewArrival: true, isTopSelling: false,
    },
    {
        name: 'Formal Blazer Slim Fit',
        description: 'Impeccably tailored slim fit blazer. Made from premium wool blend fabric, perfect for business and formal events.',
        images: [productImages[7], productImages[8]],
        price: 350, originalPrice: 420, stock: 12,
        category: 'Jackets', subCategory: 'Formal', colors: ['#212121', '#1A237E', '#795548'],
        sizes: ['Small', 'Medium', 'Large', 'X-Large'],
        rating: 4.9, reviewCount: 82, isOnSale: true, salePercent: 16,
        purchaseType: 'money', brand: 'SHOP.CO', dressStyle: 'Formal',
        tags: ['blazer', 'formal', 'slim-fit'], isNewArrival: true, isTopSelling: true,
    },
];
const categories = [
    { name: 'T-shirts', slug: 't-shirts', parent: null, order: 1 },
    { name: 'Shorts', slug: 'shorts', parent: null, order: 2 },
    { name: 'Shirts', slug: 'shirts', parent: null, order: 3 },
    { name: 'Hoodies', slug: 'hoodies', parent: null, order: 4 },
    { name: 'Jeans', slug: 'jeans', parent: null, order: 5 },
    { name: 'Jackets', slug: 'jackets', parent: null, order: 6 },
    { name: 'Casual', slug: 'casual', parent: 'style', order: 1 },
    { name: 'Formal', slug: 'formal', parent: 'style', order: 2 },
    { name: 'Party', slug: 'party', parent: 'style', order: 3 },
    { name: 'Gym', slug: 'gym', parent: 'style', order: 4 },
];
async function seed() {
    console.log('🌱 Seeding database...');
    await mongoose_1.default.connect(MONGO_URI);
    await mongoose_1.default.connection.collection('products').deleteMany({});
    await mongoose_1.default.connection.collection('categories').deleteMany({});
    await mongoose_1.default.connection.collection('categories').insertMany(categories.map(c => ({ ...c, createdAt: new Date(), updatedAt: new Date() })));
    console.log(`✅ ${categories.length} categories seeded`);
    await mongoose_1.default.connection.collection('products').insertMany(products.map(p => ({ ...p, isActive: true, createdAt: new Date(), updatedAt: new Date() })));
    console.log(`✅ ${products.length} products seeded`);
    await mongoose_1.default.disconnect();
    console.log('✅ Seeding complete!');
}
seed().catch(err => { console.error(err); process.exit(1); });
//# sourceMappingURL=seed.js.map