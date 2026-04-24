import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateGoogleUser(googleUser: {
        googleId: string;
        email: string;
        name: string;
        avatar: string;
    }): Promise<import("../users/user.entity").User>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            avatar: any;
            displayName: any;
        };
    }>;
}
