import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { UserService } from 'src/user/user.service';
import { DynamicModule } from '@nestjs/common';

@Module({})
export class TaskModule {
  static register(
    databaseService: DatabaseService,
    userService: UserService,
  ): DynamicModule {
    return {
      module: TaskModule,
      providers: [
        {
          provide: TaskService,
          useValue: new TaskService(databaseService, userService),
        },
      ],
      exports: [TaskService],
      controllers: [TaskController],
    };
  }
}
