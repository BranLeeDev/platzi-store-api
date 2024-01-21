// NestJS modules
import { Module } from '@nestjs/common';

// Controller imports
import { UsersController } from './controllers/users/users.controller';

// Service imports
import { UsersService } from './services/users/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
