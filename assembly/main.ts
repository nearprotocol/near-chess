export { memory };

import { context, storage, near } from "./near";
import { Game, GameWithId } from "./model.near";

// --- contract code goes below

export function getRecentGames(): Array<GameWithId> {
  let lastId = storage.getU64('lastId');
  let games = new Array<GameWithId>();
  for (let id = lastId; id + 10 > lastId && id > 0; --id) {
    let game = new GameWithId();
    game.id = id;
    game.game = getGame(id);
    games.push(game);
  }
  return games;
}

export function giveUpCurrentGame(): void {
  let gameId = getCurrentGame(context.sender);
  if (gameId == 0) {
    return;
  }
  let game = getGame(gameId);
  if (game.outcome != null || game.player2 == null) {
    return;
  }
  game.outcome = "Player " + context.sender + " gave up";
  storage.setBytes(getGameKey(gameId), game.encode());
}

export function createOrJoinGame(): void {
  giveUpCurrentGame();
  let lastId = storage.getU64('lastId');
  let gameKey: string;
  let game: Game;
  if (lastId > 0) {
    gameKey = getGameKey(lastId);
    game = Game.decode(storage.getBytes(gameKey));
    if (game.player2) {
      game = null;
    } else {
      if (game.player1 == context.sender) {
        return;
      }
      game.player2 = context.sender;
    }
  }
  if (game == null) {
    game = new Game();
    lastId++;
    storage.setU64('lastId', lastId);
    gameKey = getGameKey(lastId);
    game.player1 = context.sender;
  }
  storage.setBytes(gameKey, game.encode());
  // TODO: Make it possible to return result from method to avoid this
  near.log("sender: " + context.sender);
  storage.setU64("gameId:" + context.sender, lastId);
}

export function getCurrentGame(player: string): u64 {
  return storage.getU64("gameId:" + player);
}

export function getGame(gameId: u64): Game {
  return Game.decode(storage.getBytes(getGameKey(gameId)));
}

export function makeMove(gameId: u64, fen: string): void {
  let gameKey = getGameKey(gameId);
  let game = Game.decode(storage.getBytes(gameKey));
  assert(game.outcome == null, "Game over");
  let turn = getCurrentTurn(game.fen);
  let nextTurn = getCurrentTurn(fen);
  let validTurn =
    nextTurn != turn && (
      (context.sender == game.player1 && turn == 'w') ||
      (context.sender == game.player2 && turn == 'b'));
  near.log("turn " + turn);
  near.log("nextTurn " + nextTurn);
  near.log("sender " + context.sender);
  
  assert(validTurn, 'Wrong side to make move');
  // TODO: Validate chess rules
  game.fen = fen;
  storage.setBytes(gameKey, game.encode());
}

function getGameKey(gameId: u64): string {
  return 'game:' + gameId.toString();
}

function getCurrentTurn(fen: string): string {
  // TODO: Pull all of chess.js working with fen
  var tokens = fen.split(' ');
  var position = tokens[0];
  let turn = tokens[1];
  return turn;
}
