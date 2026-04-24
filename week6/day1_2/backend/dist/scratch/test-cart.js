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
async function test() {
    console.log('Connecting to MongoDB...');
    await mongoose_1.default.connect(MONGO_URI);
    const CartItemSchema = new mongoose_1.default.Schema({
        productId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        size: { type: String, required: true },
        color: { type: String, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },
        image: String,
    });
    const CartSchema = new mongoose_1.default.Schema({
        userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        items: [CartItemSchema],
    }, { timestamps: true });
    const Cart = mongoose_1.default.model('CartTest', CartSchema);
    const User = mongoose_1.default.model('UserTest', new mongoose_1.default.Schema({ name: String, email: String }));
    const Product = mongoose_1.default.model('ProductTest', new mongoose_1.default.Schema({ name: String, price: Number, stock: Number }));
    try {
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
        let cart = await Cart.findOne({ userId: new mongoose_1.default.Types.ObjectId(userId) });
        if (!cart) {
            console.log('Creating new cart...');
            cart = await Cart.create({ userId: new mongoose_1.default.Types.ObjectId(userId), items: [] });
        }
        console.log('Pushing item...');
        cart.items.push({
            productId: new mongoose_1.default.Types.ObjectId(body.productId),
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
    }
    catch (err) {
        console.error('FAILED:', err);
    }
    finally {
        await Cart.collection.drop();
        await User.collection.drop();
        await Product.collection.drop();
        await mongoose_1.default.disconnect();
    }
}
test();
//# sourceMappingURL=test-cart.js.map