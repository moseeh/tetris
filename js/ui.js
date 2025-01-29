import { HEART_EMOJI } from "./constants.js";
import { gameState } from "./gameState.js";
import { MAX_LEVEL } from "./constants.js";
import { showStoryMessage } from "./main.js";
import { TetrisStory } from "./gameMode.js";

export function updateScore() {
  let basePoints;
  switch (gameState.linesCleared) {
    case 1:
      basePoints = 40;
      break;
    case 2:
      basePoints = 100;
      break;
    case 3:
      basePoints = 300;
      break;
    case 4:
      basePoints = 1200;
      break;
    default:
      basePoints = 0;
  }

  const linePoints = basePoints * gameState.level;
  gameState.score += linePoints;
  gameState.lines += gameState.linesCleared;

  const newLevel = Math.min(Math.floor(gameState.lines / 10) + 1, MAX_LEVEL);
  if (newLevel > gameState.level) {
    gameState.level = newLevel;
    showStoryMessage(TetrisStory.messages.levels[newLevel]);
  }

  document.getElementById("score").textContent = gameState.score;
  document.getElementById("level").textContent = gameState.level;
  document.getElementById("lines").textContent = gameState.lines;
}

export function updateTimer(currentTime) {
  if (!gameState.lastTimerUpdate) gameState.lastTimerUpdate = currentTime;

  if (currentTime - gameState.lastTimerUpdate >= 1000) {
    gameState.timeElapsed++;

    const minutes = Math.floor(gameState.timeElapsed / 60);
    const seconds = gameState.timeElapsed % 60;

    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
      .toString()
      .padStart(2, "0");

    gameState.lastTimerUpdate = currentTime;
  }
}

export function updateLivesDisplay() {
  const livesDisplay = document.getElementById("lives");
  livesDisplay.textContent = HEART_EMOJI.repeat(gameState.lives);
}

export function togglePauseMenu(show) {
  const pauseMenu = document.getElementById("pause-menu");
  pauseMenu.classList.toggle("hidden", !show);
}

export function gameOverMenu(show) {
  const gameOver = document.getElementById("gameover");
  let overtext = document.getElementById("gametext");
  overtext.textContent = show
    ? `Game Over! High Score ${gameState.score}`
    : "Game Restarted!";
  gameOver.classList.toggle("hidden", !show);
}
