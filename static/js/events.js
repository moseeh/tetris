import { gameState } from './gameState.js';
import { rotateShape, moveShape } from './gameLogic.js';
import { togglePauseMenu } from './ui.js';
import { startGame } from './main.js';
import { checkCollision } from './gameLogic.js';
import { mergeShape } from './gameLogic.js';
import { update } from './main.js';
import { gameOverMenu } from './ui.js'
import { PAGESIZE } from "./constants.js";;

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
  const submitcsore = document.getElementById("submitscore");
  const restart = document.getElementById("restart");
  const quit = document.getElementById("quit");
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");

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
    const scoreboard = document.getElementById("scores");
    scoreboard.classList.toggle("hidden", true);
    startGame();
  });

  submitcsore.addEventListener("click", score);

  previous.addEventListener("click", decreasePage);

  next.addEventListener("click", increasePage);
}

function updatePaginationControls() {
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");

  // Previous button control
  previous.style.display = gameState.page === 1 ? "none" : "block";

  // Next button control
  const hasNextPage = (gameState.page) * PAGESIZE < gameState.leaderboard.length;
  next.style.display = hasNextPage ? "block" : "none";
  if ((gameState.page) * PAGESIZE === gameState.leaderboard.length) {
    next.style.display = "none";
  }
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

async function score() {
  const name = document.getElementById("playername").value;
  const minute = document.getElementById("minutes").textContent;
  const seconds = document.getElementById("seconds").textContent;
  if (name === "" || name.length > 7) {
    alert("Please enter your name or provide a shorter name");
    return;
  }

  // Wait for the POST request to complete
  await fetch("/scores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      score: gameState.score,
      time: `${minute}:${seconds}`,
    }),
  });

  gameOverMenu(false);

  // Wait for the GET request and parse the JSON response
  const response = await fetch(`/return`);
  gameState.leaderboard = await response.json();

  // Now the leaderboard data is ready
  displaySuggestions();
}