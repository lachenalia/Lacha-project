import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth/auth.module';
import { UsersModule } from './module/users/users.module';
import { GamesModule } from './module/games/games.module';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from './common/logger/logger.module';
import { TokenModule } from './app/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 어디서든 ConfigService 사용 가능
      envFilePath: '.env',
    }),
    TokenModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
    }),
    AuthModule,
    UsersModule,
    GamesModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
