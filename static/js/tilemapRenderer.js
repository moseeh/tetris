// tilemapRenderer.js

/**
 * Renders a tilemap inside the specified container element.
 * @param {object} tilemapData - The tilemap data object (from one of the background modules).
 * @param {string} containerId - The id of the container element.
 * @param {string} tilesetUrl - The URL for the background tileset image.
 */
export function renderTilemap(tilemapData, containerId, tilesetUrl) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id ${containerId} not found`);
    return;
  }
  // Clear any previous content.
  container.innerHTML = "";

  // Ensure the container fills the viewport (or desired size)
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.zIndex = "-1"; // make sure background is behind your game wrapper

  // Set the container's background (if needed) to a fallback color.
  container.style.backgroundColor = "#000";

  // Optionally, set the container to overflow hidden.
  container.style.overflow = "hidden";

  // Create a tileset image element once (the same URL for all tiles).
  // We assume all tiles come from the same spritesheet.
  // In this renderer, we use inline styles for each tile.
  const { tileSize, columns, rows, grid, tilesetCols } = tilemapData;

  // Create a document fragment for performance.
  const fragment = document.createDocumentFragment();

  // Loop through each row/column of the tilemap grid.
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      const tileId = grid[index];
      // Skip empty tiles (0 represents no tile)
      if (tileId === 0) continue;

      // Calculate the tile's position within the tileset
      const tileIndex = tileId - 1; // assuming tile ids start at 1.
      const tsCol = tileIndex % tilesetCols;
      const tsRow = Math.floor(tileIndex / tilesetCols);
      const backgroundPosX = -(tsCol * tileSize);
      const backgroundPosY = -(tsRow * tileSize);

      // Create the div element for this tile.
      const tileDiv = document.createElement("div");
      tileDiv.className = "background-tile";
      tileDiv.style.position = "absolute";
      tileDiv.style.width = `${tileSize}px`;
      tileDiv.style.height = `${tileSize}px`;
      tileDiv.style.left = `${col * tileSize}px`;
      tileDiv.style.top = `${row * tileSize}px`;

      // Set the background image (the same for all tiles) and position.
      tileDiv.style.backgroundImage = `url(${tilesetUrl})`;
      tileDiv.style.backgroundPosition = `${backgroundPosX}px ${backgroundPosY}px`;
      tileDiv.style.backgroundRepeat = "no-repeat";
      // Ensure the tile scales correctly.
      tileDiv.style.backgroundSize = "auto";

      fragment.appendChild(tileDiv);
    }
  }
  container.appendChild(fragment);
}
