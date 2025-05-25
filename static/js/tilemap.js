// static/js/tilemap.js
export class TilemapEngine {
    constructor() {
        this.tileSize = 32; // Size of each tile in pixels
        this.viewportWidth = 0;
        this.viewportHeight = 0;
        this.currentMap = null;
        this.tilemapContainer = null;
        this.visibleTiles = new Map(); // Cache for visible tiles
        this.animationFrame = null;
    }

    // Initialize the tilemap system
    init(containerSelector) {
        this.tilemapContainer = document.querySelector(containerSelector);
        if (!this.tilemapContainer) {
            console.error('Tilemap container not found!');
            return false;
        }

        // Set up the container for tilemap rendering
        this.tilemapContainer.style.position = 'absolute';
        this.tilemapContainer.style.top = '0';
        this.tilemapContainer.style.left = '0';
        this.tilemapContainer.style.zIndex = '-1'; // Behind game elements
        this.tilemapContainer.style.overflow = 'hidden';

        this.updateViewportSize();
        this.setupResizeListener();

        return true;
    }
    expandMapToFitScreen(originalMap) {
        const expandedMap = {
            ...originalMap,
            columns: this.tilesNeededX,
            rows: this.tilesNeededY,
            tiles: []
        };

        // Generate new tile array by repeating the original pattern
        for (let row = 0; row < this.tilesNeededY; row++) {
            for (let col = 0; col < this.tilesNeededX; col++) {
                // Get tile from original pattern using modulo to repeat
                const originalCol = col % originalMap.columns;
                const originalRow = row % originalMap.rows;
                const tileId = originalMap.getTile(originalCol, originalRow);
                expandedMap.tiles.push(tileId);
            }
        }

        return expandedMap;
    }

    // Update viewport dimensions and calculate required tiles
    updateViewportSize() {
        if (!this.tilemapContainer) return;

        const rect = this.tilemapContainer.getBoundingClientRect();
        this.viewportWidth = rect.width;
        this.viewportHeight = rect.height;

        // Calculate how many tiles we need to fill the entire screen
        this.tilesNeededX = Math.ceil(this.viewportWidth / this.tileSize) + 2; // +2 for buffer
        this.tilesNeededY = Math.ceil(this.viewportHeight / this.tileSize) + 2; // +2 for buffer
    }

    // Listen for container resize
    setupResizeListener() {
        const resizeObserver = new ResizeObserver(() => {
            this.updateViewportSize();
            if (this.currentMap) {
                this.renderMap(this.currentMap);
            }
        });

        if (this.tilemapContainer) {
            resizeObserver.observe(this.tilemapContainer);
        }
    }

    // Load and set a tilemap
    setMap(mapData) {
        // Expand the map to fill the entire screen
        this.currentMap = this.expandMapToFitScreen(mapData);
        this.clearMap();
        this.renderMap(this.currentMap);
    }

    // Clear the current map
    clearMap() {
        if (this.tilemapContainer) {
            this.tilemapContainer.innerHTML = '';
        }
        this.visibleTiles.clear();
    }

    // Render the tilemap (optimized for performance)
    renderMap(mapData) {
        if (!mapData || !this.tilemapContainer) return;

        // Calculate visible tile bounds
        const startCol = Math.max(0, Math.floor(-mapData.offsetX / this.tileSize));
        const endCol = Math.min(mapData.columns, Math.ceil((this.viewportWidth - mapData.offsetX) / this.tileSize));
        const startRow = Math.max(0, Math.floor(-mapData.offsetY / this.tileSize));
        const endRow = Math.min(mapData.rows, Math.ceil((this.viewportHeight - mapData.offsetY) / this.tileSize));

        // Create a document fragment for better performance
        const fragment = document.createDocumentFragment();

        // Render only visible tiles
        for (let row = startRow; row < endRow; row++) {
            for (let col = startCol; col < endCol; col++) {
                const tileId = mapData.getTile(col, row);
                if (tileId > 0) { // 0 = empty tile
                    const tileElement = this.createTileElement(tileId, col, row, mapData);
                    fragment.appendChild(tileElement);
                }
            }
        }

        // Clear and append all tiles at once
        this.tilemapContainer.innerHTML = '';
        this.tilemapContainer.appendChild(fragment);
    }

    // Create a single tile element
    createTileElement(tileId, col, row, mapData) {
        const tile = document.createElement('div');
        tile.className = `tile tile-${tileId}`;
        tile.style.position = 'absolute';
        tile.style.width = `${this.tileSize}px`;
        tile.style.height = `${this.tileSize}px`;
        tile.style.left = `${col * this.tileSize + mapData.offsetX}px`;
        tile.style.top = `${row * this.tileSize + mapData.offsetY}px`;

        // Apply tile-specific styling
        this.applyTileStyle(tile, tileId);

        return tile;
    }

    // Apply visual styling to tiles based on their ID
    applyTileStyle(tileElement, tileId) {
        // Remove any existing tile classes
        tileElement.className = tileElement.className.replace(/tile-\d+/g, '');
        tileElement.classList.add(`tile-${tileId}`);
    }

    // Animate the tilemap (for scrolling or other effects)
    animate(deltaTime) {
        if (!this.currentMap) return;

        // Example: Slow scrolling effect
        if (this.currentMap.animated) {
            this.currentMap.offsetX -= 0.5; // Slow horizontal scroll

            // Wrap around when map goes off screen
            if (this.currentMap.offsetX <= -this.currentMap.columns * this.tileSize) {
                this.currentMap.offsetX = 0;
            }

            // Re-render only if significant change
            if (Math.floor(this.currentMap.offsetX) % 4 === 0) {
                this.renderMap(this.currentMap);
            }
        }
    }

    // Get tile at world coordinates
    getTileAtPosition(x, y) {
        if (!this.currentMap) return null;

        const col = Math.floor((x - this.currentMap.offsetX) / this.tileSize);
        const row = Math.floor((y - this.currentMap.offsetY) / this.tileSize);

        if (col >= 0 && col < this.currentMap.columns && row >= 0 && row < this.currentMap.rows) {
            return this.currentMap.getTile(col, row);
        }

        return null;
    }

    // Destroy the tilemap engine
    destroy() {
        this.clearMap();
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}