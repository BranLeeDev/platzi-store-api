import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import registers from 'src/configs/registers';
import { PayloadToken } from '../types/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(registers.KEY) registerService: ConfigType<typeof registers>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: registerService.jwtSecret,
    });
  }

  validate(payload: PayloadToken) {
    return payload;
  }
}
