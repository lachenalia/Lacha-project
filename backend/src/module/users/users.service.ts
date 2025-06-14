import { Injectable } from '@nestjs/common';
import { UserGameInfo } from 'src/common/types/user-game-info.type';
import { UserInfo } from 'src/common/types/user-info.type';

@Injectable()
export class UsersService {
  async getUser(username: string): Promise<UserInfo | null> {
    // FIXME: 사용자 정보에 대한 더미 데이터
    const sudokuGame = new UserGameInfo('sudoku');
    const tapGame = new UserGameInfo('taptap');
    return {
      username: username,
      password: 'string',
      gameInfo: [sudokuGame, tapGame],
    };
  }
}
