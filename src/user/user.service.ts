import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import User from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.validator';
import * as bycript from 'bcrypt';

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
    const userExists = await this.userRepository.findOneBy({
      email: user.email,
    });

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const userToCreate = this.userRepository.create(user);

    const saltRounds = 10;

    bycript.genSalt(saltRounds, (err, salt) => {
      if (err) {
        throw new InternalServerErrorException(
          'Error generating password salt',
        );
      }

      bycript.hash(user.password, salt, async (err, hash) => {
        if (err) {
          throw new InternalServerErrorException('Error hashing password salt');
        }

        userToCreate.password = hash;

        await this.userRepository.save(userToCreate);
      });
    });

    return userToCreate;
  }
}
