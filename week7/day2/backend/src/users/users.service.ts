import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOrCreate(googleUser: {
    googleId: string;
    email: string;
    name: string;
    avatar: string;
  }): Promise<User> {
    let user = await this.usersRepository.findOne({
      where: { googleId: googleUser.googleId },
    });

    if (!user) {
      user = this.usersRepository.create({
        googleId: googleUser.googleId,
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
        displayName: googleUser.name,
      });
      await this.usersRepository.save(user);
    }

    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateProfile(id: number, displayName: string): Promise<User | null> {
    await this.usersRepository.update(id, { displayName });
    return this.findById(id);
  }
}
