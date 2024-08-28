const boardElement = document.getElementById("board");

async function showBoard() {
  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild);
  }

  INITIAL_BOARD.forEach((line) => {
    line.forEach((square) => {
      // <div class="square">
      const squareElement = document.createElement("div");
      squareElement.className = "square";

      if (square !== EMPTY) {
        const stoneElement = document.createElement("div");
        const color = square === DARK ? "dark" : "light";
        stoneElement.className = `stone ${color}`;
        squareElement.appendChild(stoneElement);
      }

      boardElement.appendChild(squareElement);
    });
  });
}

async function registerGame() {
  await fetch("/api/games", {
    method: "POST",
  });
}
async function main() {
  await registerGame();
  await showBoard();
}

main();
