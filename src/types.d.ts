export type environments = 'development' | 'test' | 'production';

export interface EnvironmentFiles {
  development: '.env.development.local';
  test: '.env.test.local';
  production: '.env';
}
