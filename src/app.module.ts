// NestJS modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

// Third-party libraries
import * as Joi from 'joi';

// Config imports
import { config } from './configs/config';
import { environments } from './configs/environments';
import registers from './configs/registers';

// Module imports
import { DatabaseModule } from './modules/database/database.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 7,
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: environments[config.env],
      load: [registers],
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.valid('development', 'test', 'production').required(),
        PORT: Joi.number().integer().positive().min(1000),
      }),
    }),
    DatabaseModule,
    ProductsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
