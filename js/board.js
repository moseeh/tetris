import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants.js";

// creating the board for main play and board for the next piece
export function createBoard() {
  let board = document.getElementById("tetris-board");
  let nextPieceGrid = document.getElementById("tetris-next");
  nextPieceGrid.innerHTML = "";
  board.innerHTML = "";

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = x;
      cell.dataset.y = y;
      board.appendChild(cell);
    }
  }

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const cell = document.createElement("div");
      cell.className = "cellnext";
      nextPieceGrid.appendChild(cell);
    }
  }
}

export function createEmptyBoard() {
  return Array(BOARD_HEIGHT)
    .fill()
    .map(() => Array(BOARD_WIDTH).fill(0));
}

