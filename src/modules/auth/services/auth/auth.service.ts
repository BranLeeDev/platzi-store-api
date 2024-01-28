// NestJS modules
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Third-party libraries
import * as bcrypt from 'bcrypt';

// Services
import { UsersService } from '../../../users/services/users/users.service';
import { BaseService } from 'src/modules/common/base.service';

// Entities
import { User } from '../../../users/entities/user.entity';

// Types
import { PayloadToken } from '../../types/interfaces';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findUserByEmail(email);
      if (!user) return null;
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return null;
      return user;
    } catch (error) {
      this.catchError(error);
    }
  }

  generateJWT(user: User) {
    const payload: PayloadToken = { role: user.role, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
