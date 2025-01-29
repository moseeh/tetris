import { gameState } from "./gameState.js";
import { BOARD_WIDTH, BOARD_HEIGHT } from "./constants.js";
import { updateScore } from "./ui.js";
import { createShape } from "./main.js";
import { updateLivesDisplay } from "./ui.js";
import { gameOverMenu } from "./ui.js";
import { TetrisStory } from "./gameMode.js";
import { showStoryMessage } from "./main.js";

// rotates a piece clockwise when the user clicks the up button
export function rotateShape() {
  const originalShape = gameState.currentShape.shape;
  const rotated = gameState.currentShape.shape.map(([x, y]) => [-y, x]);

  const minX = Math.min(...rotated.map(([x, y]) => x));
  const minY = Math.min(...rotated.map(([x, y]) => y));

  gameState.currentShape.shape = rotated.map(([x, y]) => [x - minX, y - minY]);

  if (checkCollision()) {
    gameState.currentShape.shape = originalShape;
  }
}

export function checkCollision() {
  return gameState.currentShape.shape.some(([x, y]) => {
    const newX = x + gameState.currentShape.location[0];
    const newY = y + gameState.currentShape.location[1];

    return (
      newX < 0 ||
      newX >= BOARD_WIDTH ||
      newY >= BOARD_HEIGHT ||
      newY < 0 ||
      gameState.occupiedBlocks[newY][newX]
    );
  });
}

export function moveShape() {
  let [x, y] = gameState.currentShape.location;

  if (gameState.direction === "down") y++;
  else if (gameState.direction === "left") x--;
  else if (gameState.direction === "right") x++;

  gameState.currentShape.location = [x, y];

  if (checkCollision()) {
    if (gameState.direction === "down") {
      gameState.currentShape.location = [x, y - 1];
      mergeShape();
    } else {
      gameState.currentShape.location = [
        gameState.direction === "left" ? x + 1 : x - 1,
        y,
      ];
    }
  }

  gameState.direction = "";
}

// land the piece
export function mergeShape() {
  gameState.currentShape.shape.forEach(([x, y]) => {
    const newX = x + gameState.currentShape.location[0];
    const newY = y + gameState.currentShape.location[1];
    if (newY >= 0) {
      gameState.occupiedBlocks[newY][newX] = gameState.currentShape.color;
    }
  });

  checkLines();
  createShape();

  if (checkCollision()) {
    gameOver();
  }
}

// check entire row of the occupiedblocks if already filled
function checkLines() {
  gameState.linesCleared = 0;

  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (gameState.occupiedBlocks[y].every((cell) => cell)) {
      gameState.occupiedBlocks.splice(y, 1);
      gameState.occupiedBlocks.unshift(Array(BOARD_WIDTH).fill(0));
      gameState.linesCleared++;
      y++;
    }
  }

  if (gameState.linesCleared > 0) {
    setTimeout(updateScore, 30);
  }
}

function gameOver() {
  gameState.lives--;
  updateLivesDisplay();
  if (gameState.lives <= 0) {
    gameState.state = 2;
    gameState.timerRunning = false;
    cancelAnimationFrame(gameState.animationId);

    const storyModal = document.getElementById("story-modal");
    const storyText = document.getElementById("story-text");
    storyText.innerText = TetrisStory.messages.gameOver;
    storyModal.classList.remove("hidden");
    document.getElementById("story-close").onclick = () => {
      storyModal.classList.add("hidden");
      gameOverMenu(true);
    };
  } else {
    
    const lostLifeMessages = TetrisStory.messages.lostLife;
    const randomMessage =
      lostLifeMessages[Math.floor(Math.random() * lostLifeMessages.length)];
    showStoryMessage(randomMessage);

    gameState.occupiedBlocks = Array(BOARD_HEIGHT)
      .fill()
      .map(() => Array(BOARD_WIDTH).fill(0));
    createShape();
    gameState.state = 1;
  }
}
