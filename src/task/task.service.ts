import { Injectable } from '@nestjs/common';
import { Task, Prisma } from '@prisma/client';
import { DatabaseService } from '../infrastructure/database/database.service';
import { UserService } from '../user/user.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TaskService {
  constructor(
    private databaseService: DatabaseService,
    private userService: UserService,
  ) { }

  async addTask(
    name: string,
    userId: number,
    priority: number,
  ): Promise<Task> {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new HttpException(
        'User does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const userTask = await this.getTaskByName(name);

    if (userTask !== null) {
      throw new HttpException('Task already exists', HttpStatus.CONFLICT);
    }

    const task = Prisma.validator<Prisma.TaskCreateInput>()({
      name: name,
      user: {
        connect: {
          id: parseInt(userId.toString()),
        },
      },
      priority: parseInt(priority.toString()),
    });

    return this.databaseService.task.create({
      data: task,
    });
  }

  getTaskByName(name: string): Promise<Task> {
    const whereNameIs = Prisma.validator<Prisma.TaskWhereInput>()({
      name: name,
    });

    return this.databaseService.task.findFirst({
      where: whereNameIs,
    });
  }

  async getUserTasks(userId: number): Promise<Task[]> {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new HttpException(
        'User does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const whereUserIdIs = Prisma.validator<Prisma.TaskWhereInput>()({
      userId: parseInt(userId.toString()),
    });

    return this.databaseService.task.findMany({
      where: whereUserIdIs,
    });
  }

  resetData(): Promise<Prisma.BatchPayload> {
    return this.databaseService.task.deleteMany();
  }
}
