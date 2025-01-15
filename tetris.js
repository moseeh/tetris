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

function updateNextPieceDisplay() {
    let nextPieceGrid = document.getElementById('tetris-next');
    nextPieceGrid.innerHTML = '';
    
    // Create 4x4 grid
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const cell = document.createElement('div');
            cell.className = 'cellnext';
            nextPieceGrid.appendChild(cell);
        }
    }
    
    // Draw next piece using a different approach
    const offsetX = 1; // Center the piece in the 4x4 grid
    const offsetY = 1;
    nextShape.shape.forEach(([x, y]) => {
        const newX = x + offsetX;
        const newY = y + offsetY;
        let index = newY * 4 + newX;
        if (nextShape.index === 0 ) {
            index--
        }
        if (nextPieceGrid.children[index]) {
            const cell = nextPieceGrid.children[index];
            cell.style.backgroundColor = nextShape.color;
        }
    });
}


function rotateShape() {
    const originalShape = currentShape.shape;
    const rotated = currentShape.shape.map(([x, y]) => {
        return [-y, x];
    });
    
    currentShape.shape = rotated;
    
    if (checkCollision()) {
        currentShape.shape = originalShape;
    }
}

function checkCollision() {
    return currentShape.shape.some(([x, y]) => {
        const newX = x + currentShape.location[0];
        const newY = y + currentShape.location[1];
        
        return (
            newX < 0 || 
            newX >= width ||
            newY >= height ||
            (newY >= 0 && occupiedBlocks[newY][newX])
        );
    });
}

function mergeShape() {
    currentShape.shape.forEach(([x, y]) => {
        const newX = x + currentShape.location[0];
        const newY = y + currentShape.location[1];
        if (newY >= 0) {
            occupiedBlocks[newY][newX] = currentShape.color;
        }
    });
    
    checkLines();
    createShape();
    
    if (checkCollision()) {
        gameOver();
    }
}

function checkLines() {
    let linesCleared = 0;
    
    for (let y = height - 1; y >= 0; y--) {
        if (occupiedBlocks[y].every(cell => cell)) {
            // Remove the line
            occupiedBlocks.splice(y, 1);
            // Add new empty line at top
            occupiedBlocks.unshift(Array(width).fill(0));
            linesCleared++;
            y++; // Check the same row again
        }
    }
    
    if (linesCleared > 0) {
        updateScore(linesCleared);
    }
}

function updateScore(linesCleared) {
    const linePoints = POINTS_PER_LINE * linesCleared * level;
    score += linePoints;
    lines += linesCleared;
    
    if (score >= level * POINTS_PER_LEVEL && level < MAX_LEVEL) {
        level++;
    }
    
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

function gameOver() {
    state = 2;
    cancelAnimationFrame(animationId);
    alert(`Game Over! Final Score: ${score}`);
}

function update(time = 0) {
    if (state !== 1) return;

    const deltaTime = time - lastTime;
    dropCounter += deltaTime;

    if (dropCounter > GAME_SPEED / level) {
        direction = "down";
        moveShape();
        dropCounter = 0;
    }

    // console.log(currentShape)
    // console.log(nextShape)

    draw();
    lastTime = time;
    animationId = requestAnimationFrame(update);
}

function moveShape() {
    let [x, y] = currentShape.location;
    
    if (direction === "down") y++;
    else if (direction === "left") x--;
    else if (direction === "right") x++;
    
    currentShape.location = [x, y];
    
    if (checkCollision()) {
        if (direction === "down") {
            currentShape.location = [x, y - 1];
            mergeShape();
        } else {
            currentShape.location = [direction === "left" ? x + 1 : x - 1, y];
        }
    }
    
    direction = "";
}

function draw() {
    // Clear board
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        if (y >= 0 && occupiedBlocks[y][x]) {
            cell.style.backgroundColor = occupiedBlocks[y][x];
        } else {
            cell.style.backgroundColor = "";
        }
    });

    // Draw current piece
    currentShape.shape.forEach(([x, y]) => {
        const newX = x + currentShape.location[0];
        const newY = y + currentShape.location[1];
        if (newY >= 0) {
            const cell = document.querySelector(`.cell[data-x="${newX}"][data-y="${newY}"]`);
            if (cell) {
                cell.style.backgroundColor = currentShape.color;
            }
        }
    });
}


function handleInput(e) {
    if (state !== 1) {
        if (e.key !== 'p') return;
    }
    e.preventDefault();
    
    switch (e.key) {
        case 'ArrowLeft':
            direction = "left";
            moveShape();
            break;
        case 'ArrowRight':
            direction = "right";
            moveShape();
            break;
        case 'ArrowDown':
            direction = "down";
            moveShape();
            break;
        case 'ArrowUp':
            rotateShape();
            break;
        case ' ':
            // Hard drop
            while (!checkCollision()) {
                currentShape.location[1]++;
            }
            currentShape.location[1]--;
            mergeShape();
            break;
        case 'p':
            state = state == 1 ? 0 : 1;
            if (state === 1) {
                update();
            }
            break;
    }
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