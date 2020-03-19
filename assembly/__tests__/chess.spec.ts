import * as chess from "../main";
import { Context, context } from 'near-sdk-as';
import { Game } from "../model";

const PLAYER1 = "Bobby";
const PLAYER2 = "Garry"
function getCurrentGame(player: string): Game {
  return chess.getGame(chess.getCurrentGame(player));
}

describe("Game", () => {
  beforeAll(() => {
    Context.setSigner_account_id(PLAYER1);
  });

  it("create a new game", () => {
    chess.createOrJoinGame();
    const game = getCurrentGame(PLAYER1);
    expect(game.player1).toBe(PLAYER1, "Only one player.");
    expect(game.player2).toBeNull("No second player");
  });  

  it("join a game", () => {
    Context.setSigner_account_id(PLAYER2);
    chess.createOrJoinGame();
    const game = getCurrentGame(PLAYER1);
    expect(game.player1).toBe(PLAYER1, "Only one player.");
    expect(game.player2).not.toBeNull("Should be a second player");
    expect(game.player2).toBe(PLAYER2);
  });
});
