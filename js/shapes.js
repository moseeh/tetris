import { CENTER, COLORS } from "./constants.js";

export let shapes = [];

// Creates the predefined Tetris shapes
export function createShapes() {
  const line = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ];
  const square = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ];
  const tShape = [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ];
  const lShape = [
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ];
  const jShape = [
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ];
  const sShape = [
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
  ];
  const zShape = [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
  ];

  shapes = [line, square, tShape, lShape, jShape, sShape, zShape];
}

// Returns a random Tetris shape with its color and initial properties
export function getRandomShape() {
  const randomShape = Math.floor(Math.random() * shapes.length);
  const randomColor = randomShape;
  const shape = JSON.parse(JSON.stringify(shapes[randomShape]));
  return {
    index: randomShape,
    shape,
    color: COLORS[randomColor],
    location: [CENTER, 0],
    rotation: 0,
  };
}
