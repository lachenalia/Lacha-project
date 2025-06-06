export class UserGameInfo {
  name!: string;
  level: number = 0;
  highScore: number = 0;
  gameCount: number = 0;

  constructor(name: string) {
    this.name = name;
  }
}
