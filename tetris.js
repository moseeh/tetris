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

function createBoard() {
    let board = document.getElementById('tetris-board');
    board.innerHTML = '';
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            board.appendChild(cell);
        }
    }
}

function createShapes() {
    // I piece
    const line = [[0, 1], [1, 1], [2, 1], [3, 1]];
    // O piece
    const square = [[0, 0], [1, 0], [0, 1], [1, 1]];
    // T piece
    const tShape = [[1, 0], [0, 1], [1, 1], [2, 1]];
    // L piece
    const lShape = [[2, 0], [0, 1], [1, 1], [2, 1]];
    // J piece
    const jShape = [[0, 0], [0, 1], [1, 1], [2, 1]];
    // S piece
    const sShape = [[1, 0], [2, 0], [0, 1], [1, 1]];
    // Z piece
    const zShape = [[0, 0], [1, 0], [1, 1], [2, 1]];

    shapes = [line, square, tShape, lShape, jShape, sShape, zShape];
}

function createShape() {
    if (!nextShape) {
        nextShape = getRandomShape();
    }
    currentShape = nextShape;
    nextShape = getRandomShape();
    updateNextPieceDisplay();
}

function getRandomShape() {
    const randomShape = Math.floor(Math.random() * shapes.length);
    const randomColor = randomShape; // Match color to shape for consistency
    const center = Math.floor(width / 2) - 1;
    const shape = JSON.parse(JSON.stringify(shapes[randomShape])); // Deep clone

    return {
        index : randomShape,
        shape,
        color: colors[randomColor],
        location: [center, 0],
        rotation: 0
    };
}

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