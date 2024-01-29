// NestJS modules
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

// Third-party libraries
import helmet from 'helmet';

// Config imports
import { config } from './configs/config';

// Module imports
import { AppModule } from './app.module';

// Environment variables
const PORT = config.port;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: config.isPro,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors();
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'img-src': ['self', 'https: data:'],
      },
    }),
  );

  app.setGlobalPrefix('api/v1');

  const configSwagger = new DocumentBuilder()
    .setTitle('Platzi Store API Documentation')
    .setDescription(
      'REST API built with NestJS, Docker, PostgreSQL and TypeORM',
    )
    .setVersion('0.0.1')
    .build();

  const documentSwagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/v1/docs', app, documentSwagger);

  await app.listen(PORT);
}
bootstrap();
