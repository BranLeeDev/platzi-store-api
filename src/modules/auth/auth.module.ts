// NestJS modules
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

// Services
import { AuthService } from './services/auth/auth.service';

// Strategies
import { LocalStrategy } from './strategies/local.strategy';

// Module imports
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth/auth.controller';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
