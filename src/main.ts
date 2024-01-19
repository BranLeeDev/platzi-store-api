// NestJS modules
import { NestFactory } from '@nestjs/core';

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
  app.enableCors();
  app.use(helmet());

  await app.listen(PORT);
}
bootstrap();
