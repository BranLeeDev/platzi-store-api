import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['src/modules/database/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations',
});
