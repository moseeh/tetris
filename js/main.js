import { gameState } from "./gameState.js";
import { createBoard, createEmptyBoard } from "./board.js";
import { createShapes, getRandomShape } from "./shapes.js";
import { STARTING_LIVES, FRAME_TIME, GAME_SPEED } from "./constants.js";
import { updateLivesDisplay, togglePauseMenu } from "./ui.js";
import { setupEventListeners } from "./events.js";
import { updateTimer } from "./ui.js";
import { moveShape } from "./gameLogic.js";

/**
 * Creates a new shape for the game.
 * The next shape is determined randomly and assigned to the game state.
 */
export function createShape() {
  if (!gameState.nextShape) {
    gameState.nextShape = getRandomShape();
  }
  gameState.currentShape = gameState.nextShape;
  gameState.nextShape = getRandomShape();
  setTimeout(updateNextPieceDisplay, 100);
}

/**
 * Updates the display for the next piece preview.
 */
function updateNextPieceDisplay() {
  let nextPieceGrid = document.getElementById("tetris-next");

  for (let i = 4; i < 12; i++) {
    const cell = nextPieceGrid.children[i];
    cell.style.backgroundColor = "";
  }

  const offsetX = 1;
  const offsetY = 1;
  gameState.nextShape.shape.forEach(([x, y]) => {
    const newX = x + offsetX;
    const newY = y + offsetY;
    let index = newY * 4 + newX;
    if (gameState.nextShape.index === 0) {
      index--;
    }
    if (nextPieceGrid.children[index]) {
      const cell = nextPieceGrid.children[index];
      cell.style.backgroundColor = gameState.nextShape.color;
    }
  });
}

/**
 * Draws the game board and the current falling shape.
 */
function draw() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    if (y >= 0 && gameState.occupiedBlocks[y][x]) {
      cell.style.backgroundColor = gameState.occupiedBlocks[y][x];
    } else {
      cell.style.backgroundColor = "";
    }
  });

  gameState.currentShape.shape.forEach(([x, y]) => {
    const newX = x + gameState.currentShape.location[0];
    const newY = y + gameState.currentShape.location[1];
    if (newY >= 0) {
      const cell = document.querySelector(
        `.cell[data-x="${newX}"][data-y="${newY}"]`
      );
      if (cell) {
        cell.style.backgroundColor = gameState.currentShape.color;
      }
    }
  });
}

/**
 * Updates the game state, handling movement, timing, and drawing.
 */
export function update(time = 0) {
  const deltaTime = time - gameState.lastTime;
  if (deltaTime < FRAME_TIME) {
    gameState.animationId = requestAnimationFrame(update);
    return;
  }

  gameState.dropCounter += deltaTime;

  if (gameState.dropCounter > GAME_SPEED / gameState.level && gameState.state === 1) {
    gameState.direction = "down";
    moveShape();
    gameState.dropCounter = 0;
  }

  if (gameState.timerRunning && gameState.state === 1) {
    updateTimer(time);
  }

  if (gameState.state === 1) {
    draw();
  }
  gameState.lastTime = time;
  gameState.animationId = requestAnimationFrame(update);
}

/**
 * Starts a new game by resetting the game state and initializing components.
 */
export function startGame() {
  gameState.occupiedBlocks = createEmptyBoard();
  gameState.score = 0;
  gameState.level = 1;
  gameState.lines = 0;
  gameState.state = 1;
  gameState.lives = STARTING_LIVES;
  gameState.timeElapsed = 0;
  gameState.lastTimerUpdate = 0;
  gameState.timerRunning = true;
  togglePauseMenu(false);

  document.getElementById("score").textContent = gameState.score;
  document.getElementById("level").textContent = gameState.level;
  document.getElementById("lines").textContent = gameState.lines;
  document.getElementById("minutes").textContent = "00";
  document.getElementById("seconds").textContent = "00";
  document.getElementById("start").textContent = "Restart";
  updateLivesDisplay();

  createBoard();
  createShapes();
  createShape();

  gameState.lastTime = 0;
  gameState.dropCounter = 0;
  update();
}

// Initialize event listeners
setupEventListeners();

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("button").addEventListener("click", startGame);
  setupEventListeners();
});
