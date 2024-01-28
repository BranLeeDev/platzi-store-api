import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Request } from 'express';
import { PayloadToken } from 'src/modules/auth/types/interfaces';
import { ROLES } from '../../types/enums';
import { OrdersService } from '../../services';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(ROLES.CUSTOMER)
  @Get('my-orders')
  getOrders(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.ordersService.ordersByUser(user.sub);
  }
}
