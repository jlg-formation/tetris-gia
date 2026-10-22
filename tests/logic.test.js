const test = require("node:test");
const assert = require("node:assert/strict");
const L = require("../src/logic.js");

const zeroRng = () => 0;

function emptyFilledBoard(rows) {
  const board = L.createBoard();
  for (const [r, c] of rows) board[r][c] = "#000";
  return board;
}

test("rotateMatrix tourne une matrice dans le sens horaire", () => {
  assert.deepEqual(
    L.rotateMatrix([
      [1, 2],
      [3, 4],
    ]),
    [
      [3, 1],
      [4, 2],
    ],
  );
});

test("pieceShape I en rotation 1 occupe une colonne verticale", () => {
  const shape = L.pieceShape("I", 1);
  const filledCols = new Set();
  shape.forEach((row) =>
    row.forEach((v, c) => {
      if (v) filledCols.add(c);
    }),
  );
  assert.equal(filledCols.size, 1);
  assert.equal(shape.filter((row) => row.some(Boolean)).length, 4);
});

test("fits refuse les sorties latérales et le sol, accepte le dessus du plateau", () => {
  const board = L.createBoard();
  const square = L.pieceShape("O", 0);
  assert.equal(L.fits(board, square, -1, 0), false);
  assert.equal(L.fits(board, square, L.COLS - 1, 0), false);
  assert.equal(L.fits(board, square, 0, L.ROWS - 1), false);
  assert.equal(L.fits(board, square, 0, -1), true);
});

test("fits refuse une cellule déjà occupée", () => {
  const board = emptyFilledBoard([[5, 5]]);
  assert.equal(L.fits(board, L.pieceShape("O", 0), 4, 4), false);
  assert.equal(L.fits(board, L.pieceShape("O", 0), 0, 0), true);
});

test("clearLines supprime les lignes pleines et ajoute des lignes vides en haut", () => {
  const board = L.createBoard();
  for (let c = 0; c < L.COLS; c++) board[L.ROWS - 1][c] = "#000";
  board[L.ROWS - 2][0] = "#fff";
  const result = L.clearLines(board);
  assert.deepEqual(result.cleared, [L.ROWS - 1]);
  assert.equal(result.board.length, L.ROWS);
  assert.equal(result.board[L.ROWS - 1][0], "#fff");
  assert.equal(result.board[0][0], null);
});

test("scoring : barème classique multiplié par le niveau", () => {
  assert.equal(L.scoreForClear(1, 1), 100);
  assert.equal(L.scoreForClear(4, 2), 1600);
  assert.equal(L.scoreForClear(0, 3), 0);
});

test("levelForLines passe au niveau suivant toutes les 10 lignes", () => {
  assert.equal(L.levelForLines(0), 1);
  assert.equal(L.levelForLines(9), 1);
  assert.equal(L.levelForLines(10), 2);
  assert.equal(L.levelForLines(25), 3);
});

test("gravityMs diminue avec le niveau sans descendre sous 100 ms", () => {
  assert.equal(L.gravityMs(1), 1000);
  assert.ok(L.gravityMs(2) < L.gravityMs(1));
  assert.equal(L.gravityMs(100), 100);
});

test("refillQueue produit des sacs de 7 pièces uniques", () => {
  const queue = L.refillQueue([], Math.random);
  assert.ok(queue.length >= 4);
  const firstBag = queue.slice(0, 7);
  assert.equal(new Set(firstBag).size, 7);
});

test("createGame fait apparaître une pièce en haut et centrée", () => {
  const game = L.createGame(zeroRng);
  assert.ok(game.current);
  assert.equal(game.current.y, 0);
  assert.equal(game.over, false);
});

test("moveLeft et moveRight déplacent la pièce et respectent les bords", () => {
  const game = L.createGame(zeroRng);
  const x = game.current.x;
  assert.equal(L.moveLeft(game), true);
  assert.equal(game.current.x, x - 1);
  assert.equal(L.moveRight(game), true);
  for (let i = 0; i < L.COLS; i++) L.moveLeft(game);
  assert.equal(L.moveLeft(game), false);
});

test("rotate tourne la pièce courante", () => {
  const game = L.createGame(zeroRng);
  game.current = { type: "T", rotation: 0, x: 3, y: 5 };
  assert.equal(L.rotate(game, 1), true);
  assert.equal(game.current.rotation, 1);
});

test("ghostY donne la position de chute et correspond au drop dur", () => {
  const game = L.createGame(zeroRng);
  game.board = L.createBoard();
  game.current = { type: "T", rotation: 0, x: 3, y: 0 };
  const ghost = L.ghostY(game);
  assert.equal(ghost, L.ROWS - 2);
  L.hardDrop(game);
  assert.notEqual(game.board[L.ROWS - 1][4], null);
});

test("hardDrop fige la pièce et fait apparaître la suivante", () => {
  const game = L.createGame(zeroRng);
  const before = game.lockCount;
  L.hardDrop(game);
  assert.equal(game.lockCount, before + 1);
  assert.ok(game.current);
  assert.equal(game.current.y, 0);
});

test("hold met la pièce de côté puis échange, une seule fois par pièce", () => {
  const game = L.createGame(zeroRng);
  const first = game.current.type;
  assert.equal(L.hold(game), true);
  assert.equal(game.hold, first);
  assert.equal(L.hold(game), false);
  L.hardDrop(game);
  assert.equal(L.hold(game), true);
});

test("une ligne complète est supprimée et le score est attribué", () => {
  const game = L.createGame(zeroRng);
  game.board = L.createBoard();
  for (let r = L.ROWS - 2; r < L.ROWS; r++) {
    for (let c = 0; c < 8; c++) game.board[r][c] = "#000";
  }
  game.current = { type: "O", rotation: 0, x: 8, y: 18 };
  L.hardDrop(game);
  assert.equal(game.lines, 2);
  assert.equal(game.score, 300);
  assert.equal(game.clearedRows.length, 2);
  assert.equal(game.board[L.ROWS - 1][0], null);
});

test("la partie se termine si la pièce suivante ne peut pas apparaître", () => {
  const game = L.createGame(zeroRng);
  game.board = L.createBoard();
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < L.COLS - 1; c++) game.board[r][c] = "#000";
  game.current = { type: "O", rotation: 0, x: 0, y: L.ROWS - 2 };
  L.hardDrop(game);
  assert.equal(game.over, true);
});
