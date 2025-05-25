// Tilemap 1: Circuit Board Pattern
export const circuitBoardMap = {
    name: "Circuit Board",
    columns: 25,
    rows: 20,
    offsetX: 0,
    offsetY: 0,
    animated: false,
    tiles: [
        // Row 1
        1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1,
        // Row 2
        2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2,
        // Row 3
        2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2,
        // Row 4
        2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2,
        // Row 5
        1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1,
        // Repeat pattern...
        2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2,
        2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2,
        2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2,
        1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1,
        2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2,
        2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2,
        2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2,
        1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1,
        2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2,
        2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2,
        2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2,
        1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1,
        2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2, 4, 0, 4, 2, 0, 2,
        2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2, 0, 5, 0, 2, 3, 2,
        1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1
    ],
    getTile: function (col, row) {
        if (col < 0 || col >= this.columns || row < 0 || row >= this.rows) return 0;
        return this.tiles[row * this.columns + col];
    }
};

// Tilemap 2: Matrix Digital Rain Pattern
export const matrixRainMap = {
    name: "Matrix Rain",
    columns: 30,
    rows: 25,
    offsetX: 0,
    offsetY: 0,
    animated: true,
    tiles: generateMatrixPattern(30, 25),
    getTile: function (col, row) {
        if (col < 0 || col >= this.columns || row < 0 || row >= this.rows) return 0;
        return this.tiles[row * this.columns + col];
    }
};

// Tilemap 3: Cyberpunk City Pattern
export const cyberpunkCityMap = {
    name: "Cyberpunk City",
    columns: 20,
    rows: 15,
    offsetX: 0,
    offsetY: 0,
    animated: false,
    tiles: [
        // Sky area (top rows)
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0,
        0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0,
        // Building silhouettes
        0, 7, 7, 7, 0, 7, 7, 7, 7, 0, 0, 7, 7, 7, 0, 7, 7, 7, 7, 0,
        8, 7, 9, 7, 8, 7, 9, 9, 7, 8, 8, 7, 9, 7, 8, 7, 9, 9, 7, 8,
        8, 7, 9, 7, 8, 7, 9, 9, 7, 8, 8, 7, 9, 7, 8, 7, 9, 9, 7, 8,
        8, 7, 9, 7, 8, 7, 9, 9, 7, 8, 8, 7, 9, 7, 8, 7, 9, 9, 7, 8,
        8, 7, 9, 7, 8, 7, 9, 9, 7, 8, 8, 7, 9, 7, 8, 7, 9, 9, 7, 8,
        // Mid-level buildings
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        10, 8, 11, 8, 10, 8, 11, 11, 8, 10, 10, 8, 11, 8, 10, 8, 11, 11, 8, 10,
        10, 8, 11, 8, 10, 8, 11, 11, 8, 10, 10, 8, 11, 8, 10, 8, 11, 11, 8, 10,
        // Ground level
        12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
        13, 14, 13, 14, 13, 14, 13, 14, 13, 14, 13, 14, 13, 14, 13, 14, 13, 14, 13, 14,
        15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
        16, 17, 16, 17, 16, 17, 16, 17, 16, 17, 16, 17, 16, 17, 16, 17, 16, 17, 16, 17
    ],
    getTile: function (col, row) {
        if (col < 0 || col >= this.columns || row < 0 || row >= this.rows) return 0;
        return this.tiles[row * this.columns + col];
    }
};

// Helper function to generate matrix-like pattern
function generateMatrixPattern(columns, rows) {
    const tiles = [];
    const matrixChars = [1, 2, 3, 4, 5]; // Different "character" tiles

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            // Create vertical streams effect
            const streamProbability = Math.sin(col * 0.5) * 0.5 + 0.5;
            const isInStream = Math.random() < streamProbability * 0.7;

            if (isInStream) {
                // Vary intensity based on position in stream
                const intensity = Math.sin(row * 0.3 + col * 0.2) * 0.5 + 0.5;
                const charIndex = Math.floor(intensity * matrixChars.length);
                tiles.push(matrixChars[charIndex]);
            } else {
                // Empty space or faint character
                tiles.push(Math.random() < 0.1 ? 1 : 0);
            }
        }
    }

    return tiles;
}

// Export all maps as an array for easy iteration
export const allMaps = [circuitBoardMap, matrixRainMap, cyberpunkCityMap];

// Helper function to get a map by name
export function getMapByName(name) {
    return allMaps.find(map => map.name === name);
}

// Helper function to get next map in rotation
export function getNextMap(currentMapName) {
    const currentIndex = allMaps.findIndex(map => map.name === currentMapName);
    const nextIndex = (currentIndex + 1) % allMaps.length;
    return allMaps[nextIndex];
}