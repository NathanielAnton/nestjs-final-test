import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async addUser(@Body('email') email: string) {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
    }

    return this.userService.addUser(email);
  }

  @Get('users')
  async getUsers() {
    return this.userService.getUsers();
  }
}
