import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { UsersModule } from './module/users/users.module';
import { GamesModule } from './module/games/games.module';

@Module({
  imports: [AuthModule, UsersModule, GamesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
