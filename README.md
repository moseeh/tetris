# Tetris

A classic Tetris implementation with game built with plain JavaScript and DOM, featuring dynamic tilemap backgrounds and focusing on performance and smooth gameplay.

You can play it [here](https://tetris-production-2e33.up.railway.app/)

## Features

- **60 FPS Gameplay**: Optimized rendering using `requestAnimationFrame` and delta timing for consistent frame rates.
- **Dynamic Tilemap Backgrounds**: Three unique animated background themes that enhance visual experience
  - **Circuit Board**: Tech-inspired pattern with glowing elements
  - **Matrix Rain**: Animated digital rain effect with flickering characters  
  - **Cyberpunk City**: Urban skyline with neon lights and traffic effects
- **Smooth Controls**: Responsive keyboard inputs with key repeat support for continuous movement.
- **Pause Menu**:
  - Resume current game
  - Restart game
  - Quit to main menu
- **Scoreboard**:
  - Game timer (MM:SS format)
  - Score tracking with level multipliers
  - Lives counter (❤️ system)
  - Level progression (up every 10 lines)
  - Lines cleared counter
- **Game Mechanics**:
  - 7 classic Tetris pieces
  - Piece rotation
  - Hard drop (space bar)
  - Next piece preview
  - Level-based speed increases
  - Three-life system
- **Performance Optimized**: Minimal DOM layers, targeted cell updates, and efficient tilemap rendering
- **Story Mode**: A storyline to engage players and make it interesting
- **Leaderboard**: A board to show the scores of previous players
- **Responsive Design**: Adapts to different screen sizes with scalable tilemaps

## Controls

### Game Controls
- **← → Arrow Keys**: Move piece horizontally
- **↑ Arrow Key**: Rotate piece
- **↓ Arrow Key**: Soft drop
- **Space**: Hard drop
- **P**: Pause/Resume
- **Enter**: Start/Restart game

### Tilemap Controls
- **Circuit Button**: Switch to Circuit Board background
- **Matrix Button**: Switch to Matrix Rain background  
- **City Button**: Switch to Cyberpunk City background
- **Toggle Background**: Show/hide tilemap backgrounds

## How to Play

1. Clear lines by filling horizontal rows
2. Earn more points by clearing multiple lines at once
3. Avoid stacking pieces to the top
4. Game ends after losing 3 lives
5. Speed increases with each level (every 10 lines)
6. Switch background themes for visual variety
7. Background automatically changes when starting new games

## Score System

- **Points**:
  - 1 line: 40 × level
  - 2 lines: 100 × level
  - 3 lines: 300 × level
  - 4 lines: 1200 × level
- **Level Up**: Every 10 cleared lines
- **Lives**: Lose one life when pieces stack to the top

## Performance Features

- Frame timing using `requestAnimationFrame`
- Delta time calculations for consistent movement
- Selective DOM updates (only modified cells)
- Matrix-based collision detection
- Minimal object creation during gameplay
- **Tilemap Optimizations**:
  - Viewport culling (only visible tiles rendered)
  - GPU acceleration with CSS transforms
  - Efficient tile pattern repetition
  - Responsive tile scaling
  - Reduced paint operations

## Technical Stack

- Vanilla JavaScript (no frameworks)
- Pure DOM manipulation (no Canvas)
- CSS Grid for board layout
- **Custom Tilemap Engine**: Built from scratch without tile editors
- Modern JavaScript features (ES6+)
- CSS animations and transforms for visual effects

## Tilemap System

### Architecture
- **TilemapEngine**: Core rendering engine with performance optimizations
- **Pattern-based Generation**: Procedural tilemap creation using mathematical patterns
- **Dynamic Sizing**: Automatically adapts to screen dimensions
- **Animation Support**: Smooth scrolling and visual effects

### Themes
1. **Circuit Board**: Electronic/tech aesthetic with pulsing elements
2. **Matrix Rain**: Digital falling code with animated opacity
3. **Cyberpunk City**: Urban landscape with glowing windows and traffic lights

### Performance
- Only renders tiles visible in viewport
- Uses CSS `will-change` for GPU acceleration
- Minimal DOM reflows and repaints
- Efficient memory usage with tile reuse

## How to Run

1. Clone repository and cd into the directory
```bash
git clone https://learn.zone01kisumu.ke/git/moonyango/make-your-game-different-maps
cd make-your-game-different-maps
```

2. Run the program
```bash
make
```

3. Open your browser with link
```bash
http://localhost:8080
```

## File Structure

```
├── cmd/
│   └── main.go                 # Go server implementation
├── internals/
│   └── handlers.go            # HTTP handlers
├── static/
│   ├── css/
│   │   ├── tetris.css         # Main game styling
│   │   ├── error.css          # Error page styling
│   │   └── tilemap.css        # Tilemap visual styles
│   └── js/
│       ├── main.js            # Core game loop and initialization
│       ├── gameState.js       # Game state management
│       ├── gameLogic.js       # Game mechanics and rules
│       ├── board.js           # Game board creation
│       ├── shapes.js          # Tetris piece definitions
│       ├── ui.js              # UI updates and display
│       ├── events.js          # Input handling and events
│       ├── gameMode.js        # Story mode content
│       ├── tilemap.js         # Tilemap rendering engine
│       └── tilemapData.js     # Tilemap patterns and data
└── index.html                 # Main game interface
```

## Optimization Strategies

- Pre-calculated piece matrices
- Object pooling for game pieces
- Batch DOM updates
- Efficient collision detection
- Throttled event handling
- **Tilemap-specific**:
  - Visibility culling for off-screen tiles
  - Pattern repetition instead of large arrays
  - CSS-based animations over JavaScript
  - Minimal layer creation and compositing

## Browser Compatibility

- Modern browsers supporting ES6+
- CSS Grid and Flexbox support
- `requestAnimationFrame` support
- CSS transforms and animations
- ResizeObserver API for responsive tilemaps

## Authors

[Moses Onyango](https://github.com/moseeh)
[Andrew Osindo](https://github.com/andyosyndoh)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Zone01 Kisumu for project support
- All contributors and testers
- Classic Tetris for game mechanics inspiration

---

For additional information or support, please open an issue in the repository.

Happy gaming with dynamic backgrounds! 🎮✨