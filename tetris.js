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