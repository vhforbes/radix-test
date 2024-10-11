import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import User from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { hashPassword } from '@src/utils/hash-password';
import { CreateUserDto } from './dtos/create-user.dto';
import { NotificationService } from '@src/notification/notification.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private logger: Logger,
    private notificationService: NotificationService,
  ) {}

  async findOne(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({
      email: email ? email : IsNull(),
    });

    return user;
  }

  async create(user: CreateUserDto): Promise<any> {
    const userExists = await this.findOne(user.email);

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const userToCreate = this.userRepository.create(user);

    userToCreate.password = await hashPassword(user.password);

    await this.userRepository.save(userToCreate);

    this.logger.log('Created user: ', { userToCreate });

    this.notificationService.sendNotification();

    return userToCreate;
  }

  async updatePassword(email: string, newPassword: string): Promise<any> {
    const userToUpdate = await this.findOne(email);

    userToUpdate.password = newPassword;

    const updatedUser = await this.userRepository.save(userToUpdate);

    this.logger.log('Updated password of user ', userToUpdate);

    return updatedUser;
  }
}
