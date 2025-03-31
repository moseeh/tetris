# Tetris

A classic Tetris implementation with game built with plain JavaScript and DOM, focusing on performance and smooth gameplay.
You can play it [here](https://tetris-production-2e33.up.railway.app/)

## Features

- **60 FPS Gameplay**: Optimized rendering using `requestAnimationFrame` and delta timing for consistent frame rates.
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
- **Performance Optimized**: Minimal DOM layers and targeted cell updates
- **Story Mode** : A story line to engage players and makeit interesting
- **Leaderboard** : A board to show the scores of previous players

## Controls

- **← → Arrow Keys**: Move piece horizontally
- **↑ Arrow Key**: Rotate piece
- **↓ Arrow Key**: Soft drop
- **Space**: Hard drop
- **P**: Pause/Resume
- **Enter**: Start/Restart game

## How to Play

1. Clear lines by filling horizontal rows
2. Earn more points by clearing multiple lines at once
3. Avoid stacking pieces to the top
4. Game ends after losing 3 lives
5. Speed increases with each level (every 10 lines)

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

## Technical Stack

- Vanilla JavaScript (no frameworks)
- Pure DOM manipulation (no Canvas)
- CSS Grid for board layout
- Modern JavaScript features (ES6+)

## How to Run

1. Clone repository and cd into the directory

```bash

git clone https://learn.zone01kisumu.ke/git/aosindo/make-your-game-score-handling.git

cd make-your-game-score-handling

```

2. Run the program

```bash

make

```

3. Open your browser with link

```bash

http://localhost:8080

```


## Optimization Strategies

- Pre-calculated piece matrices
- Object pooling for game pieces
- Batch DOM updates
- Efficient collision detection
- Throttled event handling

## Authors

[Moses Onyango](https://github.com/moseeh)

[Andrew Osindo](https://github.com/andyosyndoh)


## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Zone01 Kisumu for project support
- All contributors and testers

---
For additional information or support, please open an issue in the repository.

Happy exploring! 🎸✨