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
const bcrypt = __importStar(require("bcryptjs"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopco';
async function createAdmin() {
    console.log('🚀 Connecting to MongoDB...');
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('✅ Connected.');
        const adminEmail = 'admin@shopco.com';
        const adminPassword = 'admin123';
        const existingAdmin = await mongoose_1.default.connection.collection('users').findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log(`⚠️  User with email ${adminEmail} already exists.`);
            console.log('Updating role to "admin" just in case...');
            await mongoose_1.default.connection.collection('users').updateOne({ email: adminEmail }, { $set: { role: 'admin' } });
            console.log('✅ Done.');
        }
        else {
            console.log('Generating password hash...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            console.log('Creating Admin user...');
            await mongoose_1.default.connection.collection('users').insertOne({
                name: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                loyaltyPoints: 0,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log('✅ Admin user created successfully!');
            console.log('-----------------------------------');
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
            console.log('-----------------------------------');
        }
    }
    catch (error) {
        console.error('❌ Error creating admin:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('👋 Disconnected from MongoDB.');
        process.exit(0);
    }
}
createAdmin();
//# sourceMappingURL=create-admin.js.map