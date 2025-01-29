import { STARTING_LIVES } from './constants.js';
import { createEmptyBoard } from './board.js';

export const gameState = {
  shapes: [],
  currentShape: null,
  nextShape: null,
  occupiedBlocks: createEmptyBoard(),
  direction: "",
  score: 0,
  level: 1,
  lines: 0,
  state: 3,
  lastTime: 0,
  dropCounter: 0,
  animationId: null,
  lives: STARTING_LIVES,
  timeElapsed: 0,
  lastTimerUpdate: 0,
  timerRunning: false,
  linesCleared: 0
};