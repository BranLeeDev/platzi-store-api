// NestJS modules
import { registerAs } from '@nestjs/config';

// Config imports
import { config } from './config';

export default registerAs('registers', () => {
  const ENVIRONMENT = config.env;

  if (ENVIRONMENT === 'development') {
    return {
      db: {
        postgres: {
          name: process.env.POSTGRES_DB,
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          host: process.env.POSTGRES_HOST,
          port: process.env.POSTGRES_PORT,
        },
      },
    };
  }

  if (ENVIRONMENT === 'test') {
    return {};
  }

  if (ENVIRONMENT === 'production') {
    return {
      db: {
        postgres: {
          dbUrl: process.env.DATABASE_URL,
        },
      },
    };
  }
});
