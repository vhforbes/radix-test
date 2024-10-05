import { Injectable } from '@nestjs/common';
import User from './user.entity';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: 'uuid',
      name: 'User Name',
      email: 'vhforbes@gmail.com',
      password: '170496',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'uuid',
      name: 'User Name2',
      email: 'email2@email.com',
      password: 'changeme',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === username);
  }
}
