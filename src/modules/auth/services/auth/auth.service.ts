// NestJS modules
import { Injectable } from '@nestjs/common';

// Third-party libraries
import * as bcrypt from 'bcrypt';

// DTOs
import { LoginDto } from '../../dtos/login.dto';

// Services
import { UsersService } from '../../../users/services/users/users.service';
import { BaseService } from 'src/modules/common/base.service';

@Injectable()
export class AuthService extends BaseService {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async validateUser(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const user = await this.usersService.findUserByEmail(email);
      if (!user) return null;
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return null;
      return user;
    } catch (error) {
      this.catchError(error);
    }
  }
}
