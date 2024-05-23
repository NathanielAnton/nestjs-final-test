import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DatabaseService } from '../infrastructure/database/database.service';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) { }

  async addUser(email: string): Promise<User> {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    return this.databaseService.user.create({
      data: {
        email,
      },
    });
  }

  async getUser(email: string): Promise<User> {
    return this.databaseService.user.findUnique({
      where: { email },
    });
  }

  async getUserById(userId: number): Promise<User> {
    return this.databaseService.user.findUnique({
      where: { id: parseInt(userId.toString()) },
    });
  }

  async getUsers(): Promise<User[]> {
    return this.databaseService.user.findMany();
  }

  resetData(): Promise<Prisma.BatchPayload> {
    return this.databaseService.user.deleteMany();
  }
}
