// NestJS modules
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Third-party libraries
import { Request } from 'express';

// Entities
import { User } from 'src/modules/users/entities';

// Services
import { AuthService } from '../../services/auth/auth.service';

// Controllers
import { BaseController } from 'src/modules/common/base.controller';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    const res = this.authService.generateJWT(user);
    return res;
  }
}
