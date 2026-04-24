
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopco';

async function test() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  
  const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    image: String,
  });

  const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [CartItemSchema],
  }, { timestamps: true });

  const Cart = mongoose.model('CartTest', CartSchema);
  const User = mongoose.model('UserTest', new mongoose.Schema({ name: String, email: String }));
  const Product = mongoose.model('ProductTest', new mongoose.Schema({ name: String, price: Number, stock: Number }));

  try {
    // Create dummy user and product
    const user = await User.create({ name: 'Test User', email: 'test@example.com' });
    const product = await Product.create({ name: 'Test Product', price: 100, stock: 10 });
    
    console.log('User ID:', user._id);
    console.log('Product ID:', product._id);

    const userId = user._id.toString();
    const body = {
      productId: product._id.toString(),
      quantity: 1,
      size: 'M',
      color: 'Red'
    };

    console.log('Testing addItem logic...');
    
    // Logic from cart.service.ts
    let cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!cart) {
      console.log('Creating new cart...');
      cart = await Cart.create({ userId: new mongoose.Types.ObjectId(userId), items: [] });
    }

    console.log('Pushing item...');
    cart.items.push({
      productId: new mongoose.Types.ObjectId(body.productId),
      quantity: body.quantity,
      size: body.size,
      color: body.color,
      price: product.price,
      name: product.name,
      image: '',
    });

    console.log('Saving cart...');
    await cart.save();
    console.log('SUCCESS!');

  } catch (err) {
    console.error('FAILED:', err);
  } finally {
    // Cleanup
    await Cart.collection.drop();
    await User.collection.drop();
    await Product.collection.drop();
    await mongoose.disconnect();
  }
}

test();
