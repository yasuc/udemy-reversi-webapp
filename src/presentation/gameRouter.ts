import express from "express";
import { GameGateway } from "../dataaccess/gameGateway";
import { TurnGateway } from "../dataaccess/turnGateway";
import { SquareGateway } from "../dataaccess/squareGateway";
import { connectMySQL } from "../dataaccess/connection";
import { DARK, INITIAL_BOARD } from "../application/constants";

export const gameRouter = express.Router();

const gameGateway = new GameGateway();
const turnGateway = new TurnGateway();
const squaresGateway = new SquareGateway();

gameRouter.post("/api/games", async (req, res) => {
  const now = new Date();

  const conn = await connectMySQL();
  try {
    await conn.beginTransaction();

    const gameRecord = await gameGateway.insert(conn, now);

    const turnRecord = await turnGateway.insert(
      conn,
      gameRecord.id,
      0,
      DARK,
      now,
    );

    await squaresGateway.insertAll(conn, turnRecord.id, INITIAL_BOARD);

    await conn.commit();
  } finally {
    await conn.end();
  }

  res.status(201).end();
});
