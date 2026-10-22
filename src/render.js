// Rendu canvas : lit l'état du jeu sans jamais le modifier.

const CELL_SIZE = 30;
const PREVIEW_CELL = 22;
const PARTICLE_COLORS = ["#FFF3A3", "#FF6EC7", "#C8A2FF", "#B5F5E0"];

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function forEachCell(shape, x, y, fn) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) fn(x + c, y + r);
    }
  }
}

function drawBlock(ctx, px, py, size, color, alpha = 1) {
  const pad = 2;
  ctx.save();
  ctx.globalAlpha = alpha;
  roundRect(
    ctx,
    px + pad,
    py + pad,
    size - pad * 2,
    size - pad * 2,
    size * 0.3,
  );
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(
    px + size * 0.35,
    py + size * 0.3,
    size * 0.18,
    size * 0.1,
    -0.5,
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.fill();
  ctx.restore();
}

function drawGhost(ctx, x, y) {
  ctx.save();
  roundRect(
    ctx,
    x * CELL_SIZE + 3,
    y * CELL_SIZE + 3,
    CELL_SIZE - 6,
    CELL_SIZE - 6,
    CELL_SIZE * 0.3,
  );
  ctx.setLineDash([4, 3]);
  ctx.strokeStyle = "rgba(122, 62, 157, 0.55)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawBoard(ctx, state) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.fillStyle =
        (r + c) % 2 ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.12)";
      ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      const color = state.board[r][c];
      if (color) drawBlock(ctx, c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, color);
    }
  }
  if (!state.current || state.over) return;
  const p = state.current;
  const shape = currentShape(state);
  forEachCell(shape, p.x, ghostY(state), (x, y) => drawGhost(ctx, x, y));
  forEachCell(shape, p.x, p.y, (x, y) => {
    if (y >= 0)
      drawBlock(
        ctx,
        x * CELL_SIZE,
        y * CELL_SIZE,
        CELL_SIZE,
        PIECE_DEFS[p.type].color,
      );
  });
}

function drawPreview(ctx, type, slotY, slotH) {
  if (!type) return;
  const shape = pieceShape(type, 0);
  const w = shape[0].length * PREVIEW_CELL;
  const h = shape.length * PREVIEW_CELL;
  const ox = (ctx.canvas.width - w) / 2;
  const oy = slotY + (slotH - h) / 2;
  forEachCell(shape, 0, 0, (c, r) => {
    drawBlock(
      ctx,
      ox + c * PREVIEW_CELL,
      oy + r * PREVIEW_CELL,
      PREVIEW_CELL,
      PIECE_DEFS[type].color,
    );
  });
}

function drawPreviewList(ctx, types) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const slotH = ctx.canvas.height / 3;
  types.forEach((type, i) => drawPreview(ctx, type, i * slotH, slotH));
}

function drawStar(ctx, x, y, radius, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? radius : radius * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function spawnLineParticles(particles, rows) {
  rows.forEach((row) => {
    for (let i = 0; i < 16; i++) {
      particles.push({
        x: Math.random() * COLS * CELL_SIZE,
        y: (row + 0.5) * CELL_SIZE,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.8) * 5,
        life: 1,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      });
    }
  });
}

function updateParticles(particles) {
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life -= 0.025;
  });
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].life <= 0) particles.splice(i, 1);
  }
}

function drawEffects(ctx, particles, flash) {
  if (flash > 0) {
    ctx.save();
    ctx.globalAlpha = flash * 0.8;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  }
  particles.forEach((p) =>
    drawStar(ctx, p.x, p.y, 3 + 5 * p.life, p.color, p.life),
  );
}
