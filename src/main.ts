// NestJS modules
import { NestFactory } from '@nestjs/core';

// Third-party libraries
import helmet from 'helmet';

// Module imports
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  await app.listen(3000);
}
bootstrap();
