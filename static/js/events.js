import { gameState } from './gameState.js';
import { rotateShape, moveShape } from './gameLogic.js';
import { togglePauseMenu } from './ui.js';
import { startGame } from './main.js';
import { checkCollision } from './gameLogic.js';
import { mergeShape } from './gameLogic.js';
import { update } from './main.js';
import { gameOverMenu } from './ui.js';

/**
 * Handles keyboard input for controlling the game.
 * Supports movement, rotation, pause, and instant drop.
 */
export function handleInput(e) {
  if (gameState.state === 2 && e.key !== " ") {
    return;
  }
  if (e.key === "Enter" && gameState.state === 3) {
    startGame();
    return;
  }

  if (e.key === "p") {
    e.preventDefault();
    if (gameState.state === 1) {
      gameState.state = 0;
      gameState.timerRunning = false;
      togglePauseMenu(true);
    } else if (gameState.state === 0) {
      gameState.state = 1;
      gameState.timerRunning = true;
      togglePauseMenu(false);
      gameState.lastTimerUpdate = 0;
      update();
    }
    return;
  }

  if (gameState.state !== 1) return;

  e.preventDefault();
  switch (e.key) {
    case "ArrowLeft":
      gameState.direction = "left";
      moveShape();
      break;
    case "ArrowRight":
      gameState.direction = "right";
      moveShape();
      break;
    case "ArrowDown":
      gameState.direction = "down";
      moveShape();
      break;
    case "ArrowUp":
      rotateShape();
      break;
    case " ":
      while (!checkCollision()) {
        gameState.currentShape.location[1]++;
      }
      gameState.currentShape.location[1]--;
      mergeShape();
      break;
  }
}

/**
 * Sets up event listeners for keyboard and visibility changes.
 */
export function setupEventListeners() {
  document.addEventListener("keydown", handleInput);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  setupButtonListeners();
}

/**
 * Handles visibility changes (e.g., when the tab is hidden).
 * Pauses the game when hidden and resumes when visible.
 */
function handleVisibilityChange() {
  if (document.visibilityState === "hidden" && gameState.state === 1) {
    gameState.state = 0;
    gameState.timerRunning = false;
    togglePauseMenu(true);
  } else if (document.visibilityState === "visible" && gameState.state === 0) {
    togglePauseMenu(false);
    gameState.timerRunning = true;
    gameState.state = 1;
    update();
  }
}

/**
 * Adds event listeners for game control buttons (resume, restart, quit).
 */
function setupButtonListeners() {
  const resumeBtn = document.getElementById("resume-btn");
  const restartBtn = document.getElementById("restart-btn");
  const quitBtn = document.getElementById("quit-btn");
  const restart = document.getElementById("restart");
  const quit = document.getElementById("quit");

  resumeBtn.addEventListener("click", () => {
    gameState.state = 1;
    gameState.timerRunning = true;
    togglePauseMenu(false);
    gameState.lastTimerUpdate = 0;
    update();
  });

  restartBtn.addEventListener("click", () => {
    togglePauseMenu(false);
    startGame();
  });

  quitBtn.addEventListener("click", handleQuit);
  quit.addEventListener("click", handleQuit);

  restart.addEventListener("click", () => {
    gameOverMenu(false);
    startGame();
  });
}

/**
 * Handles the quit button click.
 * Asks for confirmation before reloading the page.
 */
function handleQuit() {
  if (confirm("Are you sure you want to quit the game")) {
    window.location.reload();
  }
}
