import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const hashPassword = async (rawPassword: string): Promise<string> => {
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    return hashedPassword;
  } catch (error) {
    Logger.error(error);
    throw new Error('Error hashing password');
  }
};
