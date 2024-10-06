import { BadRequestException, Injectable } from '@nestjs/common';
import User from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    const user = this.userRepository.findOneBy({ email: username });

    return user;
  }

  async create(user: CreateUserDto): Promise<any> {
    const userExists = this.userRepository.findOneBy({
      email: user.email,
    });

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const createdUser = this.userRepository.create(user);

    await this.userRepository.save(createdUser);

    return createdUser;
  }
}
