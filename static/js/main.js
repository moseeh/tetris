// Add these imports at the top of your main.js file
import { TilemapEngine } from "./tilemap.js";
import { allMaps, getNextMap } from "./tilemapData.js";

// Add this to your existing imports section
import { gameState } from "./gameState.js";
import { createBoard, createEmptyBoard } from "./board.js";
import { createShapes, getRandomShape } from "./shapes.js";
import { STARTING_LIVES, FRAME_TIME, GAME_SPEED } from "./constants.js";
import { updateLivesDisplay, togglePauseMenu } from "./ui.js";
import { setupEventListeners } from "./events.js";
import { updateTimer } from "./ui.js";
import { moveShape } from "./gameLogic.js";
import { TetrisStory } from "./gameMode.js";

// Add tilemap engine instance
const tilemapEngine = new TilemapEngine();
let currentMapIndex = 0;
let tilemapEnabled = true;

/**
 * Initialize the tilemap system
 */
function initTilemap() {
  // Initialize the tilemap engine
  if (tilemapEngine.init('#tilemap-container')) {
    // Load the first map
    tilemapEngine.setMap(allMaps[currentMapIndex]);

    // Setup tilemap controls
    setupTilemapControls();

    console.log('Tilemap system initialized successfully');
  } else {
    console.error('Failed to initialize tilemap system');
  }
}

/**
 * Setup tilemap control buttons
 */
function setupTilemapControls() {
  const circuitBtn = document.getElementById('map-circuit');
  const matrixBtn = document.getElementById('map-matrix');
  const cityBtn = document.getElementById('map-city');
  const toggleBtn = document.getElementById('map-toggle');

  if (circuitBtn) {
    circuitBtn.addEventListener('click', () => switchToMap(0));
  }
  if (matrixBtn) {
    matrixBtn.addEventListener('click', () => switchToMap(1));
  }
  if (cityBtn) {
    cityBtn.addEventListener('click', () => switchToMap(2));
  }
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTilemap);
  }

  // Set initial active button
  updateActiveMapButton();
}

/**
 * Switch to a specific tilemap
 */
function switchToMap(mapIndex) {
  if (mapIndex >= 0 && mapIndex < allMaps.length) {
    currentMapIndex = mapIndex;
    if (tilemapEnabled) {
      // Reset map position for new map
      allMaps[currentMapIndex].offsetX = 0;
      allMaps[currentMapIndex].offsetY = 0;
      tilemapEngine.setMap(allMaps[currentMapIndex]);
    }
    updateActiveMapButton();
    console.log(`Switched to tilemap: ${allMaps[currentMapIndex].name}`);
  }
}

/**
 * Toggle tilemap visibility
 */
function toggleTilemap() {
  tilemapEnabled = !tilemapEnabled;
  const container = document.getElementById('tilemap-container');
  const toggleBtn = document.getElementById('map-toggle');

  if (container) {
    container.style.display = tilemapEnabled ? 'block' : 'none';
  }

  if (toggleBtn) {
    toggleBtn.textContent = tilemapEnabled ? 'Hide Background' : 'Show Background';
    toggleBtn.classList.toggle('active', tilemapEnabled);
  }

  console.log(`Tilemap ${tilemapEnabled ? 'enabled' : 'disabled'}`);
}

/**
 * Update active map button styling
 */
function updateActiveMapButton() {
  const buttons = ['map-circuit', 'map-matrix', 'map-city'];
  buttons.forEach((btnId, index) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.classList.toggle('active', index === currentMapIndex && tilemapEnabled);
    }
  });
}

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
 * Updates the game state, handling movement, timing, drawing, and tilemap animation.
 */
export function update(time = 0) {
  const deltaTime = time - gameState.lastTime;
  if (deltaTime < FRAME_TIME) {
    gameState.animationId = requestAnimationFrame(update);
    return;
  }

  gameState.dropCounter += deltaTime;

  if (
    gameState.dropCounter > GAME_SPEED / gameState.level &&
    gameState.state === 1
  ) {
    gameState.direction = "down";
    moveShape();
    gameState.dropCounter = 0;
  }

  if (gameState.timerRunning && gameState.state === 1) {
    updateTimer(time);
  }

  if (gameState.state === 1) {
    draw();

    // Update tilemap animation if enabled
    if (tilemapEnabled && tilemapEngine) {
      tilemapEngine.animate(deltaTime);
    }
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

  // Automatically switch to next tilemap when starting a new game
  if (tilemapEnabled) {
    const nextMapIndex = (currentMapIndex + 1) % allMaps.length;
    switchToMap(nextMapIndex);
  }

  let wasRunning = gameState.state === 1;
  if (wasRunning) {
    gameState.state = 0;
    gameState.timerRunning = false;
  }
  const storyModal = document.getElementById("story-modal");
  const storyText = document.getElementById("story-text");
  storyText.innerText = TetrisStory.messages.intro;
  storyModal.classList.remove("hidden");

  document.getElementById("story-close").onclick = () => {
    storyModal.classList.add("hidden");
    if (wasRunning) {
      gameState.state = 1;
      gameState.timerRunning = true;
    }
  };

  gameState.lastTime = 0;
  gameState.dropCounter = 0;
  update();
}

setupEventListeners();

export function showStoryMessage(message) {
  const storyModal = document.getElementById("story-modal");
  const storyText = document.getElementById("story-text");
  let wasRunning = gameState.state === 1;
  if (wasRunning) {
    gameState.state = 0;
    gameState.timerRunning = false;
  }

  storyText.innerText = message;
  storyModal.classList.remove("hidden");

  document.getElementById("story-close").onclick = () => {
    storyModal.classList.add("hidden");

    if (wasRunning) {
      gameState.state = 1;
      gameState.timerRunning = true;
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.querySelector("#start");
  startButton.addEventListener("click", () => {
    startGame();
  });

  // Initialize tilemap system after DOM is loaded
  initTilemap();
});

// Export the tilemap functions for use in other modules if needed
export { switchToMap, toggleTilemap };