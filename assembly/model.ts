// @nearfile

export class Game {
  player1: string;
  player2: string;
  fen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  outcome: string;
}

export class GameWithId {
  id: u64;
  game: Game;
}
