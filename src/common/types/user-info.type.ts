import { UserGameInfo } from './user-game-info.type';

export class UserInfo {
  username!: string;
  password?: string;
  gameInfo!: UserGameInfo[];
}
