import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import User from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { hashPassword } from '@src/utils/hash-password';
import { CreateUserDto } from './dtos/create-user.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerConfig } from '@src/common/message-broker/message-broker.config';
import { UserCreatedEvent } from '@src/common/message-broker/interfaces/user-created-event.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private logger: Logger,
    private jwtService: JwtService,
    private readonly amqpConnection: AmqpConnection,
    private configService: ConfigService,
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

    const confirmationToken = await this.createConfirmEmailToken(user.email);

    const userCreatedMessage: UserCreatedEvent = {
      email: user.email,
      name: user.name,
      confirmationToken,
    };

    try {
      await this.amqpConnection.publish(
        MessageBrokerConfig.user.exchanges.userExchange,
        MessageBrokerConfig.user.routingKeys.userCreated,
        userCreatedMessage,
      );
    } catch (error) {
      // There may be a need to retry if messages fail to enter the queue...
      // For now ill just log

      this.logger.error('Failed to send message to broker', error.message);
    }

    return userToCreate;
  }

  async updatePassword(email: string, newPassword: string): Promise<any> {
    const userToUpdate = await this.findOne(email);

    userToUpdate.password = newPassword;

    const updatedUser = await this.userRepository.save(userToUpdate);

    this.logger.log('Updated password of user ', userToUpdate);

    return updatedUser;
  }

  async createConfirmEmailToken(email: string) {
    const token = await this.jwtService.signAsync(
      { email },
      {
        secret: this.configService.get<string>('JWT_CREATION_SECRET'),
        expiresIn: '30d',
      },
    );

    return token;
  }

  async confirmEmail(token: string) {
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_CREATION_SECRET'),
    });

    if (!decoded.email) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.findOne(decoded.email);

    if (!user) {
      throw new BadRequestException('User to confirm not found');
    }

    user.confirmed = true;

    await this.userRepository.save(user);

    return 'Email confirmed';
  }
}
