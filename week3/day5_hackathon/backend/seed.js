const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });

const mongoose = require("mongoose");
const connectDB = require("./db");
const User = require("./models/User");
const Product = require("./models/Product");
const Variant = require("./models/Variant");

const teaProducts = [
  {
    name: "Ceylon Ginger Cinnamon Chai Tea",
    description: "A lovely warming Chai tea with ginger cinnamon flavours.",
    price: 3.9,
    category: "Chai",
    origin: "Iran",
    flavor: ["Spicy"],
    qualities: ["Smoothing"],
    caffeine: "Medium Caffeine",
    allergens: ["Nuts-free"],
    organic: true,
    vegan: true,
    images: ["https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500"],
    stepiingInstructions: {
      servingSize: "2 tsp per cup, 6 tsp per pot",
      waterTemperature: "100°C",
      steepingTime: "3 - 5 minutes",
      colorAfterBrew: "Deep amber",
    },
    ingredients: ["Black Ceylon tea", "Green tea", "Ginger root", "Cloves", "Black pepper", "Cinnamon sticks", "Cardamom", "Cinnamon pieces"],
    stock: 100,
    rating: 4.5,
    featured: true,
  },
  {
    name: "Japanese Sencha Green Tea",
    description: "A classic Japanese green tea with a fresh, grassy flavor and bright green liquor.",
    price: 4.85,
    category: "Green Tea",
    origin: "Japan",
    flavor: ["Grassy", "Sweet"],
    qualities: ["Energy", "Detox"],
    caffeine: "Medium Caffeine",
    allergens: ["Gluten-free"],
    organic: true,
    vegan: true,
    images: ["https://images.unsplash.com/photo-1556881286-fc6915169721?w=500"],
    stepiingInstructions: {
      servingSize: "1 tsp per cup",
      waterTemperature: "75°C",
      steepingTime: "1 - 2 minutes",
      colorAfterBrew: "Light green",
    },
    ingredients: ["Japanese Sencha green tea leaves"],
    stock: 80,
    rating: 4.7,
    featured: true,
  },
  {
    name: "English Breakfast Black Tea",
    description: "A robust and full-bodied black tea blend, perfect for a strong morning cup.",
    price: 3.5,
    category: "Black Tea",
    origin: "India",
    flavor: ["Bitter", "Smooth"],
    qualities: ["Energy"],
    caffeine: "High Caffeine",
    allergens: ["Lactose-free"],
    organic: false,
    vegan: true,
    images: ["https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=500"],
    stepiingInstructions: {
      servingSize: "1 tsp per cup",
      waterTemperature: "100°C",
      steepingTime: "3 - 5 minutes",
      colorAfterBrew: "Dark brown",
    },
    ingredients: ["Assam black tea", "Ceylon black tea", "Kenyan black tea"],
    stock: 120,
    rating: 4.3,
    featured: true,
  },
  {
    name: "White Peony Tea",
    description: "A delicate white tea with sweet floral notes and a light, refreshing taste.",
    price: 6.5,
    category: "White Tea",
    origin: "India",
    flavor: ["Floral", "Sweet"],
    qualities: ["Relax", "Detox"],
    caffeine: "Low Caffeine",
    allergens: ["Soy-free"],
    organic: true,
    vegan: true,
    images: ["https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500"],
    stepiingInstructions: {
      servingSize: "2 tsp per cup",
      waterTemperature: "80°C",
      steepingTime: "4 - 6 minutes",
      colorAfterBrew: "Pale yellow",
    },
    ingredients: ["White Peony tea buds and leaves"],
    stock: 60,
    rating: 4.8,
    featured: false,
  },
  {
    name: "Ceremonial Grade Matcha",
    description: "Premium Japanese ceremonial grade matcha for traditional preparation.",
    price: 12.9,
    category: "Matcha",
    origin: "Japan",
    flavor: ["Creamy", "Sweet"],
    qualities: ["Energy", "Detox"],
    caffeine: "High Caffeine",
    allergens: ["Gluten-free"],
    organic: true,
    vegan: true,
    images: ["https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500"],
    stepiingInstructions: {
      servingSize: "1 tsp per cup",
      waterTemperature: "80°C",
      steepingTime: "Whisk until frothy",
      colorAfterBrew: "Vibrant green",
    },
    ingredients: ["Stone-ground green tea leaves"],
    stock: 40,
    rating: 4.9,
    featured: true,
  },
  {
    name: "Chamomile Herbal Tea",
    description: "A soothing and calming herbal tea made with dried chamomile flowers.",
    price: 4.2,
    category: "Herbal Tea",
    origin: "South Africa",
    flavor: ["Floral", "Sweet"],
    qualities: ["Relax", "Digestion"],
    caffeine: "No Caffeine",
    allergens: ["Nuts-free"],
    organic: true,
    vegan: true,
    images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500"],
    stepiingInstructions: {
      servingSize: "1 tsp per cup",
      waterTemperature: "100°C",
      steepingTime: "5 - 7 minutes",
      colorAfterBrew: "Golden yellow",
    },
    ingredients: ["Dried chamomile flowers"],
    stock: 90,
    rating: 4.4,
    featured: false,
  },
  {
    name: "Dong Ding Oolong",
    description: "A medium-roasted Taiwanese oolong with a rich, toasty flavor and floral aroma.",
    price: 7.5,
    category: "Oolong",
    origin: "India",
    flavor: ["Floral", "Smooth"],
    qualities: ["Relax", "Energy"],
    caffeine: "Medium Caffeine",
    allergens: ["Lactose-free"],
    organic: false,
    vegan: true,
    images: ["https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=500"],
    stepiingInstructions: {
      servingSize: "1 tsp per cup",
      waterTemperature: "90°C",
      steepingTime: "3 - 5 minutes",
      colorAfterBrew: "Golden amber",
    },
    ingredients: ["Dong Ding oolong tea leaves"],
    stock: 50,
    rating: 4.6,
    featured: false,
  },
  {
    name: "South African Rooibos",
    description: "A naturally caffeine-free herbal tea with a sweet, nutty flavor from South Africa.",
    price: 3.8,
    category: "Rooibos",
    origin: "South Africa",
    flavor: ["Sweet", "Smooth"],
    qualities: ["Relax", "Digestion"],
    caffeine: "No Caffeine",
    allergens: ["Gluten-free", "Nuts-free"],
    organic: true,
    vegan: true,
    images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500"],
    stepiingInstructions: {
      servingSize: "1 tsp per cup",
      waterTemperature: "100°C",
      steepingTime: "5 - 7 minutes",
      colorAfterBrew: "Reddish brown",
    },
    ingredients: ["South African Rooibos leaves"],
    stock: 110,
    rating: 4.2,
    featured: true,
  },
  {
    name: "Masala Chai Blend",
    description: "An aromatic blend of black tea and traditional Indian spices.",
    price: 4.5,
    category: "Chai",
    origin: "India",
    flavor: ["Spicy", "Sweet"],
    qualities: ["Energy", "Digestion"],
    caffeine: "High Caffeine",
    allergens: ["Nuts-free"],
    organic: false,
    vegan: true,
    images: ["https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=500"],
    stepiingInstructions: {
      servingSize: "2 tsp per cup",
      waterTemperature: "100°C",
      steepingTime: "5 - 7 minutes",
      colorAfterBrew: "Rich brown",
    },
    ingredients: ["Black tea", "Cinnamon", "Cardamom", "Ginger", "Cloves", "Black pepper"],
    stock: 95,
    rating: 4.6,
    featured: true,
  },
  {
    name: "Jasmine Dragon Pearl",
    description: "Hand-rolled green tea pearls scented with fresh jasmine flowers.",
    price: 8.9,
    category: "Green Tea",
    origin: "India",
    flavor: ["Floral", "Sweet"],
    qualities: ["Relax"],
    caffeine: "Low Caffeine",
    allergens: ["Soy-free"],
    organic: true,
    vegan: true,
    images: ["https://images.unsplash.com/photo-1455621481073-d5bc1c40e3cb?w=500"],
    stepiingInstructions: {
      servingSize: "5-6 pearls per cup",
      waterTemperature: "85°C",
      steepingTime: "2 - 3 minutes",
      colorAfterBrew: "Light golden",
    },
    ingredients: ["Green tea pearls", "Jasmine flowers"],
    stock: 35,
    rating: 4.8,
    featured: false,
  },
  {
    name: "Earl Grey Supreme",
    description: "A refined black tea infused with natural bergamot oil and blue cornflowers.",
    price: 5.2,
    category: "Black Tea",
    origin: "India",
    flavor: ["Citrus", "Floral"],
    qualities: ["Energy"],
    caffeine: "Medium Caffeine",
    allergens: ["Lactose-free"],
    organic: false,
    vegan: true,
    images: ["https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500"],
    stepiingInstructions: {
      servingSize: "1 tsp per cup",
      waterTemperature: "95°C",
      steepingTime: "3 - 4 minutes",
      colorAfterBrew: "Amber",
    },
    ingredients: ["Black tea", "Bergamot oil", "Blue cornflowers"],
    stock: 75,
    rating: 4.5,
    featured: true,
  },
  {
    name: "Peppermint Herbal Infusion",
    description: "A refreshing and cooling caffeine-free herbal tea made from pure peppermint leaves.",
    price: 3.6,
    category: "Herbal Tea",
    origin: "South Africa",
    flavor: ["Minty", "Smooth"],
    qualities: ["Digestion", "Relax"],
    caffeine: "No Caffeine",
    allergens: ["Gluten-free"],
    organic: true,
    vegan: true,
    images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500"],
    stepiingInstructions: {
      servingSize: "1 tsp per cup",
      waterTemperature: "100°C",
      steepingTime: "5 - 7 minutes",
      colorAfterBrew: "Light green",
    },
    ingredients: ["Peppermint leaves"],
    stock: 85,
    rating: 4.3,
    featured: false,
  },
];

const variantTemplates = [
  { label: "50g bag", weight: "50 g", priceDifference: 0 },
  { label: "100g bag", weight: "100 g", priceDifference: 2.5 },
  { label: "170g bag", weight: "170 g", priceDifference: 5.0 },
  { label: "250g bag", weight: "250 g", priceDifference: 8.0 },
  { label: "1kg bag", weight: "1 kg", priceDifference: 25.0 },
  { label: "Sampler", weight: "10 g", priceDifference: -1.5 },
];

async function seed() {
  try {
    await connectDB(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Variant.deleteMany({});
    console.log("Cleared existing data");

    // Create superadmin
    const superadmin = await User.create({
      name: "Super Admin",
      email: "admin@teatime.com",
      password: "admin123",
      role: "superadmin",
    });
    console.log("Created superadmin:", superadmin.email);

    // Create test user
    const testUser = await User.create({
      name: "Test User",
      email: "user@teatime.com",
      password: "user123",
      role: "user",
    });
    console.log("Created test user:", testUser.email);

    // Create products and variants
    for (const teaData of teaProducts) {
      const product = await Product.create(teaData);
      const variants = variantTemplates.map((v) => ({
        ...v,
        product: product._id,
        stock: Math.floor(Math.random() * 50) + 10,
      }));
      await Variant.insertMany(variants);
      console.log(`Created product: ${product.name} with ${variants.length} variants`);
    }

    console.log("\nSeed completed successfully!");
    console.log("Superadmin login: admin@teatime.com / admin123");
    console.log("Test user login: user@teatime.com / user123");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
