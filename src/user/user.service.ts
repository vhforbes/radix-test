import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import User from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.validator';
import { hashPassword } from '@src/utils/hash-password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private logger: Logger,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    const user = this.userRepository.findOneBy({ email: username });

    return user;
  }

  async create(user: CreateUserDto): Promise<any> {
    const userExists = await this.userRepository.findOneBy({
      email: user.email,
    });

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const userToCreate = this.userRepository.create(user);

    userToCreate.password = await hashPassword(user.password);

    await this.userRepository.save(userToCreate);

    this.logger.log('Created user: ', { userToCreate });

    return userToCreate;
  }
}
