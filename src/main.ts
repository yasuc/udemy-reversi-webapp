import express from "express";
import "express-async-errors";
import morgan from "morgan";

import { turnRouter } from "./presentation/turnRouter";
import { gameRouter } from "./presentation/gameRouter";

const PORT = 5001;

const app = express();

app.use(morgan("dev"));
app.use(express.static("static", { extensions: ["html"] }));
app.use(express.json());
app.use(errorHandler);

function errorHandler(
  err: any,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) {
  console.error("Unexpected error occurred", err);
  res.status(500).send({
    message: "Unexpected error occurred",
  });
}

app.use(gameRouter);
app.use(turnRouter);

app.listen(PORT, () => {
  console.log(`Reversi application started: http://localhost:${PORT}`);
});

app.get("/api/hello", async (req, res) => {
  res.json({
    message: "Hello Express!!!",
  });
});

app.get("/api/error", async (req, res) => {
  throw new Error("Error endpoint");
});
