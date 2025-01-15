// Game constants
const GAME_SPEED = 1000; // Initial speed in milliseconds
const POINTS_PER_LINE = 100;
const POINTS_PER_LEVEL = 1000;
const MAX_LEVEL = 10;

// Game state
let shapes = [];
let currentShape;
let nextShape;
let height = 20;
let width = 10;
let state = 1;      // 1 running - 0 paused - 2 game over
let colors = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'];
let occupiedBlocks = Array(height).fill().map(() => Array(width).fill(0));
let direction = "";
let score = 0;
let level = 1;
let lines = 0;
let lastTime = 0;
let dropCounter = 0;
let animationId;

function startGame() {
    // Reset game state
    occupiedBlocks = Array(height).fill().map(() => Array(width).fill(0));
    score = 0;
    level = 1;
    lines = 0;
    state = 1;
    
    // Update display
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
    
    createBoard();
    createShapes();
    createShape();
    
    // Start game loop
    lastTime = 0;
    dropCounter = 0;
    update();
}

// Event listeners
document.addEventListener('keydown', handleInput);
document.querySelector('button').addEventListener('click', startGame);