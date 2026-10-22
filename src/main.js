// Boucle de jeu, contrôles clavier et branchement logique vers rendu.

const boardCtx = document.getElementById("board").getContext("2d");
const nextCtx = document.getElementById("next").getContext("2d");
const holdCtx = document.getElementById("hold").getContext("2d");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlay-text");
const scoreEl = document.getElementById("score");
const linesEl = document.getElementById("lines");
const levelEl = document.getElementById("level");

let game;
let particles = [];
let flash = 0;
let paused = false;
let gravityAcc = 0;
let lastLockCount = 0;
let lastTime = performance.now();

function startGame() {
  game = createGame();
  particles = [];
  flash = 0;
  paused = false;
  gravityAcc = 0;
  lastLockCount = game.lockCount;
}

function afterAction() {
  if (game.lockCount === lastLockCount) return;
  lastLockCount = game.lockCount;
  if (game.clearedRows.length) {
    spawnLineParticles(particles, game.clearedRows);
    flash = 1;
  }
}

const KEY_ACTIONS = {
  ArrowLeft: () => moveLeft(game),
  ArrowRight: () => moveRight(game),
  ArrowUp: () => rotate(game, 1),
  x: () => rotate(game, 1),
  z: () => rotate(game, -1),
  ArrowDown: () => {
    softDrop(game);
    gravityAcc = 0;
  },
  " ": () => hardDrop(game),
  c: () => hold(game),
};

document.addEventListener("keydown", (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (key === "r") {
    startGame();
    return;
  }
  if (key === "p") {
    if (!game.over) paused = !paused;
    return;
  }
  const action = KEY_ACTIONS[key];
  if (!action) return;
  e.preventDefault();
  if (game.over || paused) return;
  action();
  afterAction();
});

function update(dt) {
  if (game.over || paused) return;
  gravityAcc += dt;
  if (gravityAcc >= gravityMs(game.level)) {
    gravityAcc = 0;
    softDrop(game);
    afterAction();
  }
}

function render() {
  drawBoard(boardCtx, game);
  drawEffects(boardCtx, particles, flash);
  drawPreviewList(nextCtx, game.queue.slice(0, 3));
  holdCtx.clearRect(0, 0, holdCtx.canvas.width, holdCtx.canvas.height);
  drawPreview(holdCtx, game.hold, 0, holdCtx.canvas.height);
  scoreEl.textContent = game.score;
  linesEl.textContent = game.lines;
  levelEl.textContent = game.level;
  const showOverlay = paused || game.over;
  overlay.classList.toggle("hidden", !showOverlay);
  overlayText.textContent = game.over
    ? "Partie terminée · R pour recommencer"
    : "Pause · P pour reprendre";
}

function frame(now) {
  update(now - lastTime);
  lastTime = now;
  updateParticles(particles);
  flash = Math.max(0, flash - 0.06);
  render();
  requestAnimationFrame(frame);
}

startGame();
requestAnimationFrame(frame);
