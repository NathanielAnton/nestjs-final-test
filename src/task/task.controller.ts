import { Body, Controller, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { Get, Param } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  async addTask(
    @Body('name') name: string,
    @Body('userId') userId: number,
    @Body('priority') priority: number,
  ) {
    if (!name || !userId || !priority) {
      throw new HttpException(
        'Name, userId and priority are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (isNaN(priority) || priority < 0) {
      throw new HttpException('Invalid priority', HttpStatus.BAD_REQUEST);
    }
    if (isNaN(userId) || userId < 0) {
      throw new HttpException('Invalid userId', HttpStatus.BAD_REQUEST);
    }
    return this.taskService.addTask(name, userId, priority);
  }

  @Get('user/:userId')
  async getUserTasks(@Param('userId') userId: number) {
    if (isNaN(userId) || userId < 0) {
      throw new HttpException('Invalid userId', HttpStatus.BAD_REQUEST);
    }

    return this.taskService.getUserTasks(userId);
  }
}
