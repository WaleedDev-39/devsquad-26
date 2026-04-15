import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<User>, jwtService: JwtService);
    signup(signupDto: SignupDto): Promise<{
        token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            username: string;
            email: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            username: string;
            email: string;
        };
    }>;
}
