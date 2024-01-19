export type environments = 'development' | 'test' | 'production';

export interface Config {
  env: environments;
  port: number;
  isPro: boolean;
}

export interface EnvironmentFiles {
  development: '.env.development.local';
  test: '.env.test.local';
  production: '.env';
}
