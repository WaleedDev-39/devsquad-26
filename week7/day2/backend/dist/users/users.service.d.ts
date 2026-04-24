import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOrCreate(googleUser: {
        googleId: string;
        email: string;
        name: string;
        avatar: string;
    }): Promise<User>;
    findById(id: number): Promise<User | null>;
    updateProfile(id: number, displayName: string): Promise<User | null>;
}
