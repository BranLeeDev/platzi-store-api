// NestJS modules
import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Config imports
import { config } from 'src/configs/config';
import registers from 'src/configs/registers';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [registers.KEY],
      useFactory: (registerService: ConfigType<typeof registers>) => {
        let DATABASE_URL: string;
        if (config.env === 'production') {
          DATABASE_URL = registerService.db.postgres.dbUrl;
        } else {
          const { user, password, host, port, name } =
            registerService.db.postgres;

          const USER = encodeURIComponent(user);
          const PASSWORD = encodeURIComponent(password);

          DATABASE_URL = `postgresql://${USER}:${PASSWORD}@${host}:${port}/${name}`;
        }

        return {
          type: 'postgres',
          url: DATABASE_URL,
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
