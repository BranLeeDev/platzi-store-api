// NestJS modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import {
  UsersController,
  CustomersController,
  OrdersController,
  OrdersProductsController,
} from './controllers';

// Services
import {
  UsersService,
  CustomersService,
  OrdersService,
  OrdersProductsService,
} from './services';

// Entities
import { User, Customer, Order, OrderProduct } from './entities';

// Module imports
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Customer, Order, OrderProduct]),
    ProductsModule,
  ],
  controllers: [
    UsersController,
    CustomersController,
    OrdersController,
    OrdersProductsController,
  ],
  providers: [
    UsersService,
    CustomersService,
    OrdersService,
    OrdersProductsService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
