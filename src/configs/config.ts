// Third-party libraries
import * as dotenv from 'dotenv';

// Type imports
import { Config, environments } from 'src/types';

dotenv.config();

const ENVIRONMENT = process.env.NODE_ENV as environments;

export const config: Config = {
  env: ENVIRONMENT,
  port: parseInt(process.env.PORT) || 3000,
  isPro: ENVIRONMENT === 'production',
};
