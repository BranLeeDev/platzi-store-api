// NestJS modules
import { registerAs } from '@nestjs/config';

// Config imports
import { config } from './config';

export default registerAs('registers', () => {
  const ENVIRONMENT = config.env;

  if (ENVIRONMENT === 'development') {
    return {};
  }

  if (ENVIRONMENT === 'test') {
    return {};
  }

  if (ENVIRONMENT === 'production') {
    return {};
  }
});
