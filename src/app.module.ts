// NodeJS modules
import { join } from 'path';

// NestJS modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';

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
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    CacheModule.register(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/(.*)'],
    }),
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
        DATABASE_URL: Joi.string().min(20).required(),
        CLOUDINARY_NAME: Joi.string().min(1).required(),
        CLOUDINARY_API_KEY: Joi.number().positive().integer().required(),
        CLOUDINARY_API_SECRET: Joi.string().min(1).required(),
        JWT_SECRET: Joi.string().required(),
        MASTER_PASSWORD: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    ProductsModule,
    UsersModule,
    CloudinaryModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
