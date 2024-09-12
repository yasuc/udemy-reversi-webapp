import mysql from "mysql2/promise";
import { Turn } from "./turn";
import { TurnGateway } from "../../infrastructure/turnGateway";
import { SquareGateway } from "../../infrastructure/squareGateway";
import { MoveGateway } from "../../infrastructure/moveGateway";
import { Point } from "./point";
import { Move } from "./move";
import { toDisc } from "./disc";
import { Board } from "./board";

const turnGateway = new TurnGateway();
const squareGateway = new SquareGateway();
const moveGateway = new MoveGateway();

export class TurnRepository {
  async findForGameIdAndTurnCount(
    conn: mysql.Connection,
    gameId: number,
    turnCount: number,
  ): Promise<Turn> {
    const turnRecord = await turnGateway.findForGameIdAndTurnCout(
      conn,
      gameId,
      turnCount,
    );

    if (!turnRecord) {
      throw new Error("Specified turn not found");
    }

    const squareRecords = await squareGateway.findForTurnId(
      conn,
      turnRecord.id,
    );

    const board = Array.from(Array(8)).map(() => Array.from(Array(8)));
    squareRecords.forEach((s) => {
      board[s.y][s.x] = s.disc;
    });

    const moveRecord = await moveGateway.findForTurnId(conn, turnRecord.id);
    let move: Move | undefined;

    if (moveRecord) {
      move = new Move(
        toDisc(moveRecord.disc),
        new Point(moveRecord.x, moveRecord.y),
      );
    }

    return new Turn(
      gameId,
      turnCount,
      toDisc(turnRecord.nextDisc),
      move,
      new Board(board),
      turnRecord.endAt,
    );
  }

  async save(conn: mysql.Connection, turn: Turn) {
    const turnRecord = await turnGateway.insert(
      conn,
      turn.gameID,
      turn.turnCount,
      turn.nextDisc,
      turn.endAt,
    );

    await squareGateway.insertAll(conn, turnRecord.id, turn.board.discs);

    if (turn.move) {
      await moveGateway.insert(
        conn,
        turnRecord.id,
        turn.move.disc,
        turn.move.point.x,
        turn.move.point.y,
      );
    }
  }
}
