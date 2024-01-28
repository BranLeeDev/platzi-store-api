// NestJS modules
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// Services
import { AuthService } from './services/auth/auth.service';

// Controllers
import { AuthController } from './controllers/auth/auth.controller';

// Config imports
import registers from 'src/configs/registers';

// Strategies
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

// Config imports
import { ConfigType } from '@nestjs/config';

// Module imports
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [registers.KEY],
      useFactory: (configService: ConfigType<typeof registers>) => {
        const { jwtSecret } = configService;
        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: '15m',
          },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
