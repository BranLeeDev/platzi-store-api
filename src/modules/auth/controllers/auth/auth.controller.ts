// NestJS modules
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// DTOs
import { LoginDto } from '../../dtos/login.dto';
import { AuthService } from '../../services/auth/auth.service';
import { BaseController } from 'src/modules/common/base.controller';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const res = await this.authService.validateUser(loginDto);
      return res;
    } catch (error) {
      this.catchError(error);
    }
  }
}
