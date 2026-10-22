// Logique pure du jeu : aucun accès au DOM. Chargé par le navigateur et par node --test.

const COLS = 10;
const ROWS = 20;

const PIECE_DEFS = {
  I: {
    color: "#B5F5E0",
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  O: {
    color: "#FFF3A3",
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  T: {
    color: "#C8A2FF",
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  S: {
    color: "#9EF0B0",
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
  },
  Z: {
    color: "#FF9AA2",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
  },
  J: {
    color: "#9ED2FF",
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  L: {
    color: "#FFC59E",
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
};
const PIECE_TYPES = Object.keys(PIECE_DEFS);

// Décalages testés lors d'une rotation (version simplifiée des wall kicks SRS).
const KICKS = [
  [0, 0],
  [-1, 0],
  [1, 0],
  [0, -1],
  [-2, 0],
  [2, 0],
  [0, -2],
];

function rotateMatrix(m) {
  const n = m.length;
  return m.map((_, r) => m.map((_, c) => m[n - 1 - c][r]));
}

function pieceShape(type, rotation) {
  let m = PIECE_DEFS[type].shape;
  for (let i = 0; i < ((rotation % 4) + 4) % 4; i++) m = rotateMatrix(m);
  return m;
}

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function forEachFilled(shape, x, y, fn) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) fn(x + c, y + r);
    }
  }
}

// Les cellules au-dessus du plateau (y < 0) ne provoquent pas de collision.
function fits(board, shape, x, y) {
  let ok = true;
  forEachFilled(shape, x, y, (bx, by) => {
    if (bx < 0 || bx >= COLS || by >= ROWS) ok = false;
    else if (by >= 0 && board[by][bx]) ok = false;
  });
  return ok;
}

function lockPiece(board, type, rotation, x, y) {
  const next = board.map((row) => row.slice());
  const color = PIECE_DEFS[type].color;
  forEachFilled(pieceShape(type, rotation), x, y, (bx, by) => {
    if (by >= 0) next[by][bx] = color;
  });
  return next;
}

function clearLines(board) {
  const full = (row) => row.every(Boolean);
  const cleared = [];
  board.forEach((row, i) => {
    if (full(row)) cleared.push(i);
  });
  const kept = board.filter((row) => !full(row));
  while (kept.length < ROWS) kept.unshift(Array(COLS).fill(null));
  return { board: kept, cleared };
}

const LINE_POINTS = [0, 100, 300, 500, 800];
const LINES_PER_LEVEL = 10;

function levelForLines(lines) {
  return Math.floor(lines / LINES_PER_LEVEL) + 1;
}

function scoreForClear(count, level) {
  return (LINE_POINTS[count] || 0) * level;
}

function gravityMs(level) {
  return Math.max(100, 1000 - (level - 1) * 90);
}

function shuffle(items, rng) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Garde au moins 4 pièces en file pour l'aperçu.
function refillQueue(queue, rng) {
  while (queue.length < 4) queue.push(...shuffle(PIECE_TYPES, rng));
  return queue;
}

function drawFromQueue(queue, rng) {
  refillQueue(queue, rng);
  return queue.shift();
}

function createGame(rng = Math.random) {
  const state = {
    board: createBoard(),
    queue: [],
    rng,
    current: null,
    hold: null,
    canHold: true,
    score: 0,
    lines: 0,
    level: 1,
    over: false,
    clearedRows: [],
    lockCount: 0,
  };
  spawnPiece(state, drawFromQueue(state.queue, rng));
  return state;
}

function spawnPiece(state, type) {
  const width = pieceShape(type, 0)[0].length;
  state.current = {
    type,
    rotation: 0,
    x: Math.floor((COLS - width) / 2),
    y: 0,
  };
  if (
    !fits(state.board, currentShape(state), state.current.x, state.current.y)
  ) {
    state.over = true;
  }
}

function currentShape(state) {
  return pieceShape(state.current.type, state.current.rotation);
}

function tryMove(state, dx, dy) {
  if (state.over || !state.current) return false;
  const { x, y } = state.current;
  if (!fits(state.board, currentShape(state), x + dx, y + dy)) return false;
  state.current.x += dx;
  state.current.y += dy;
  return true;
}

function moveLeft(state) {
  return tryMove(state, -1, 0);
}

function moveRight(state) {
  return tryMove(state, 1, 0);
}

function rotate(state, dir) {
  if (state.over || !state.current) return false;
  const p = state.current;
  const rotation = (((p.rotation + dir) % 4) + 4) % 4;
  const shape = pieceShape(p.type, rotation);
  for (const [dx, dy] of KICKS) {
    if (fits(state.board, shape, p.x + dx, p.y + dy)) {
      p.rotation = rotation;
      p.x += dx;
      p.y += dy;
      return true;
    }
  }
  return false;
}

function lockCurrent(state) {
  const p = state.current;
  const outOfTop = currentShape(state).some((row, r) =>
    row.some((v, c) => v && p.y + r < 0),
  );
  const placed = lockPiece(state.board, p.type, p.rotation, p.x, p.y);
  const result = clearLines(placed);
  const n = result.cleared.length;

  state.board = result.board;
  state.clearedRows = result.cleared;
  state.lines += n;
  state.score += scoreForClear(n, state.level);
  state.level = levelForLines(state.lines);
  state.canHold = true;
  state.lockCount += 1;
  state.current = null;

  if (outOfTop) state.over = true;
  else spawnPiece(state, drawFromQueue(state.queue, state.rng));
}

// Retourne false si la pièce a été figée au lieu de descendre.
function softDrop(state) {
  if (state.over || !state.current) return false;
  if (tryMove(state, 0, 1)) return true;
  lockCurrent(state);
  return false;
}

function hardDrop(state) {
  if (state.over || !state.current) return 0;
  let distance = 0;
  while (tryMove(state, 0, 1)) distance++;
  lockCurrent(state);
  return distance;
}

function ghostY(state) {
  const { x, y } = state.current;
  const shape = currentShape(state);
  let gy = y;
  while (fits(state.board, shape, x, gy + 1)) gy++;
  return gy;
}

// Un seul échange par pièce posée.
function hold(state) {
  if (state.over || !state.canHold || !state.current) return false;
  const type = state.current.type;
  if (state.hold === null) {
    state.hold = type;
    state.current = null;
    spawnPiece(state, drawFromQueue(state.queue, state.rng));
  } else {
    const held = state.hold;
    state.hold = type;
    spawnPiece(state, held);
  }
  state.canHold = false;
  return true;
}

if (typeof module !== "undefined") {
  module.exports = {
    COLS,
    ROWS,
    PIECE_DEFS,
    PIECE_TYPES,
    KICKS,
    rotateMatrix,
    pieceShape,
    createBoard,
    fits,
    lockPiece,
    clearLines,
    LINE_POINTS,
    levelForLines,
    scoreForClear,
    gravityMs,
    shuffle,
    refillQueue,
    drawFromQueue,
    createGame,
    currentShape,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
    ghostY,
    hold,
  };
}
