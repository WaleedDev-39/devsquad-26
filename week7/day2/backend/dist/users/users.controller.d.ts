import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("./user.entity").User>;
    updateProfile(req: any, body: {
        displayName: string;
    }): Promise<import("./user.entity").User>;
}
