import { connectMySQL } from "../infrastructure/connection";
import { GameRepository } from "../domain/game/gameRepository";
import { toDisc } from "../domain/turn/disc";
import { Point } from "../domain/turn/point";
import { TurnRepository } from "../domain/turn/turnRepository";

const gameRepository = new GameRepository();
const turnRepository = new TurnRepository();

class FindLatestGameTurnByTrunCountOutput {
  constructor(
    private _turnCount: number,
    private _board: number[][],
    private _nextDisc: number | undefined,
    private _winnerDisc: number | undefined,
  ) {}

  get turnCount() {
    return this._turnCount;
  }

  get board() {
    return this._board;
  }

  get nextDisc() {
    return this._nextDisc;
  }

  get winnerDisc() {
    return this._winnerDisc;
  }
}

export class TurnService {
  async findLatestGameTurnByTrunCount(
    turnCount: number,
  ): Promise<FindLatestGameTurnByTrunCountOutput> {
    const conn = await connectMySQL();
    try {
      const game = await gameRepository.findLatest(conn);

      if (!game) {
        throw new Error("Latest game not found");
      }

      if (!game.id) {
        throw new Error("game.id not exist");
      }

      const turn = await turnRepository.findForGameIdAndTurnCount(
        conn,
        game.id,
        turnCount,
      );

      return new FindLatestGameTurnByTrunCountOutput(
        turnCount,
        turn.board.discs,
        turn.nextDisc,
        undefined,
      );
    } finally {
      await conn.end();
    }
  }

  async registerTurn(turnCount: number, disc: number, x: number, y: number) {
    const conn = await connectMySQL();
    try {
      await conn.beginTransaction();
      // 1つ前のターンを取得する
      const game = await gameRepository.findLatest(conn);

      if (!game) {
        throw new Error("Latest game not found");
      }

      if (!game.id) {
        throw new Error("game.id not exist");
      }

      const previousTurnCount = turnCount - 1;
      const previousTurn = await turnRepository.findForGameIdAndTurnCount(
        conn,
        game.id,
        previousTurnCount,
      );

      // 石を置く
      const newTurn = previousTurn.placeNext(toDisc(disc), new Point(x, y));

      // ターンを保存する
      await turnRepository.save(conn, newTurn);

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
