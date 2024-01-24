// NestJS modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controller imports
import { UsersController } from './controllers/users/users.controller';
import { CustomersController } from './controllers/customers/customers.controller';
import { OrdersController } from './controllers/orders/orders.controller';
import { OrdersProductsController } from './controllers/orders-products/orders-products.controller';

// Service imports
import { UsersService } from './services/users/users.service';
import { CustomersService } from './services/customers/customers.service';
import { OrdersService } from './services/orders/orders.service';
import { OrdersProductsService } from './services/orders-products/orders-products.service';

// Entity imports
import { User } from './entities/user.entity';
import { Customer } from './entities/customer.entity';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-product.entity';

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
})
export class UsersModule {}
