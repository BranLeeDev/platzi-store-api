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
      cloudinary: {
        cloudName: process.env.CLOUDINARY_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
      },
      jwtSecret: process.env.JWT_SECRET,
      masterPassword: process.env.MASTER_PASSWORD,
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
      cloudinary: {
        cloudName: process.env.CLOUDINARY_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
      },
      jwtSecret: process.env.JWT_SECRET,
      masterPassword: process.env.MASTER_PASSWORD,
    };
  }
});
