import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_URL ? undefined : process.env.PGHOST ?? 'localhost',
    port: process.env.DATABASE_URL ? undefined : Number(process.env.PGPORT ?? 5432),
    username: process.env.DATABASE_URL ? undefined : process.env.PGUSER,
    password: process.env.DATABASE_URL ? undefined : process.env.PGPASSWORD,
    database: process.env.DATABASE_URL ? undefined : process.env.PGDATABASE,
    autoLoadEntities: true,
    synchronize: false,
  };
}
