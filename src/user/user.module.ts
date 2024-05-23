import { DynamicModule, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { UserController } from './user.controller';

@Module({})
export class UserModule {
  static register(databaseService: DatabaseService): DynamicModule {
    return {
      module: UserModule,
      providers: [
        {
          provide: UserService,
          useValue: new UserService(databaseService),
        },
      ],
      exports: [UserService],
      controllers: [UserController],
    };
  }
}
