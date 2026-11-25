// The night-market stall: floor, counters, lanterns, and station furniture.

import { W, H, PAL } from './config.js';
import { LAYOUT } from './stations.js';

export function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function fillPanel(ctx, x, y, w, h, fill, edge) {
  roundRect(ctx, x, y, w, h, 12);
  ctx.fillStyle = fill || PAL.panel;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = edge || PAL.panelEdge;
  ctx.stroke();
}

export function pillLabel(ctx, text, x, y, size) {
  const px = size || 13;
  ctx.font = `bold ${px}px "Trebuchet MS", "Segoe UI", sans-serif`;
  const w = Math.ceil(ctx.measureText(text).width + 18);
  const h = px + 10;
  const left = Math.round(x - w / 2);
  const top = Math.round(y - px - 1);
  roundRect(ctx, left, top, w, h, 8);
  ctx.fillStyle = 'rgba(18, 8, 8, 0.92)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffd56a';
  ctx.stroke();
  inkText(ctx, text, x, y, px, '#fff6e4', 'center');
}

export function inkText(ctx, text, x, y, size, color, align) {
  ctx.font = `bold ${size}px "Trebuchet MS", "Segoe UI", sans-serif`;
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = color || PAL.cream;
  const hex = String(color || '').toLowerCase();
  const dark = hex === '#2a140c' || hex === '#1a1008' || hex === '#3a2412';
  if (!dark) {
    ctx.lineWidth = Math.max(2, size / 7);
    ctx.strokeStyle = PAL.ink;
    ctx.strokeText(text, x, y);
  }
  ctx.fillText(text, x, y);
}

function glow(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 2, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function lantern(ctx, x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#3a2412';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 16);
  ctx.stroke();
  ctx.fillStyle = color;
  roundRect(ctx, -16, 16, 32, 40, 8);
  ctx.fill();
  ctx.strokeStyle = PAL.ink;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 244, 210, 0.9)';
  roundRect(ctx, -7, 26, 14, 18, 3);
  ctx.fill();
  ctx.restore();
}

function shell(ctx, station, hot) {
  const { x, y, w, h, kind } = station;
  ctx.save();
  if (kind === 'crate') {
    ctx.fillStyle = '#a86a32';
    roundRect(ctx, x, y, w, h, 6);
    ctx.fill();
    ctx.fillStyle = '#c9844a';
    roundRect(ctx, x + 4, y + 4, w - 8, h - 14, 4);
    ctx.fill();
    ctx.strokeStyle = PAL.ink;
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, w, h, 6);
    ctx.stroke();
  } else if (kind === 'chop') {
    ctx.fillStyle = '#e6c48a';
    roundRect(ctx, x, y + 16, w, h - 16, 18);
    ctx.fill();
    ctx.strokeStyle = '#6a3e1c';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.strokeStyle = '#f3e0b8';
    ctx.lineWidth = 2;
    roundRect(ctx, x + 10, y + 26, w - 20, h - 36, 12);
    ctx.stroke();
  } else if (kind === 'pot') {
    ctx.fillStyle = '#3a3e44';
    roundRect(ctx, x + 10, y + 28, w - 20, h - 36, 16);
    ctx.fill();
    ctx.fillStyle = '#2a2e32';
    ctx.fillRect(x + 18, y + 18, w - 36, 16);
    ctx.strokeStyle = PAL.ink;
    ctx.lineWidth = 3;
    roundRect(ctx, x + 10, y + 28, w - 20, h - 36, 16);
    ctx.stroke();
  } else if (kind === 'grill') {
    ctx.fillStyle = '#4a2418';
    roundRect(ctx, x, y + 20, w, h - 24, 8);
    ctx.fill();
    ctx.fillStyle = '#1a0c08';
    for (let i = 0; i < 5; i += 1) ctx.fillRect(x + 12, y + 36 + i * 12, w - 24, 4);
    ctx.fillStyle = '#ff6a2a';
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(x + 40, y + h - 28, 8, 0, 7);
    ctx.arc(x + w / 2, y + h - 22, 10, 0, 7);
    ctx.arc(x + w - 40, y + h - 30, 7, 0, 7);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = PAL.ink;
    ctx.lineWidth = 3;
    roundRect(ctx, x, y + 20, w, h - 24, 8);
    ctx.stroke();
  } else if (kind === 'assembly') {
    ctx.fillStyle = '#7a1e28';
    roundRect(ctx, x, y, w, h, 12);
    ctx.fill();
    ctx.fillStyle = '#9a3038';
    roundRect(ctx, x + 8, y + 8, w - 16, h - 16, 8);
    ctx.fill();
    ctx.strokeStyle = PAL.gold;
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, w, h, 12);
    ctx.stroke();
  } else if (kind === 'pass') {
    ctx.fillStyle = '#5c3418';
    roundRect(ctx, x, y, w, h, 10);
    ctx.fill();
    ctx.fillStyle = '#1c1018';
    roundRect(ctx, x + 10, y + 16, w - 20, h - 28, 8);
    ctx.fill();
    ctx.strokeStyle = PAL.gold;
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, w, h, 10);
    ctx.stroke();
  } else if (kind === 'trash') {
    ctx.fillStyle = '#2f6f8a';
    roundRect(ctx, x, y + 16, w, h - 16, 8);
    ctx.fill();
    ctx.fillStyle = '#d8eef6';
    roundRect(ctx, x + 8, y + 24, w - 16, 16, 4);
    ctx.fill();
    ctx.strokeStyle = PAL.ink;
    ctx.lineWidth = 2;
    roundRect(ctx, x, y + 16, w, h - 16, 8);
    ctx.stroke();
  }
  if (hot) {
    ctx.strokeStyle = '#fff3bf';
    ctx.lineWidth = 3;
    roundRect(ctx, x - 3, y - 3, w + 6, h + 6, 12);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawKitchen(ctx, state) {
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#3a1860');
  sky.addColorStop(0.22, '#6a2a38');
  sky.addColorStop(1, '#1a0c10');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  for (let y = 108; y < H; y += 40) {
    for (let x = 0; x < 792; x += 40) {
      const alt = ((x / 40) + (y / 40)) & 1;
      ctx.fillStyle = alt ? '#efc17a' : '#d7964c';
      ctx.fillRect(x, y, 40, 40);
      ctx.strokeStyle = 'rgba(80, 36, 12, 0.28)';
      ctx.strokeRect(x + 1, y + 1, 38, 38);
    }
  }
  ctx.fillStyle = '#2c223c';
  ctx.fillRect(786, 100, 238, H - 100);
  for (let i = 0; i < 40; i += 1) {
    ctx.fillStyle = i % 2 ? '#3a3050' : '#261c38';
    ctx.beginPath();
    ctx.arc(810 + (i * 47) % 200, 140 + (i * 73) % 460, 8, 0, 7);
    ctx.fill();
  }

  glow(ctx, 80, 70, 120, 'rgba(255, 150, 40, 0.45)');
  glow(ctx, 500, 40, 140, 'rgba(255, 200, 90, 0.30)');
  glow(ctx, 930, 80, 110, 'rgba(255, 70, 50, 0.28)');

  ctx.fillStyle = '#6b3418';
  roundRect(ctx, 150, 112, 636, 72, 8);
  ctx.fill();
  ctx.strokeStyle = '#3a180c';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#7a2840';
  roundRect(ctx, 8, 186, 108, 330, 10);
  ctx.fill();
  ctx.strokeStyle = PAL.goldDeep;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = 'rgba(120, 24, 32, 0.35)';
  roundRect(ctx, 140, 206, 620, 340, 18);
  ctx.fill();

  for (let i = 0; i < LAYOUT.length; i += 1) {
    shell(ctx, LAYOUT[i], state.nearId === LAYOUT[i].id);
  }

  lantern(ctx, 70, 0, '#ff9a2e');
  lantern(ctx, 430, 0, '#e23a3a');
  lantern(ctx, 760, 0, '#ffb03a');
  lantern(ctx, 960, 0, '#ff5a3c');

  ctx.strokeStyle = '#ffd27a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(70, 58);
  ctx.lineTo(430, 52);
  ctx.lineTo(760, 58);
  ctx.stroke();
  for (let x = 120; x < 760; x += 70) {
    ctx.fillStyle = x % 140 === 50 ? '#fff6d0' : '#ffb03a';
    ctx.beginPath();
    ctx.arc(x, 62, 3.5, 0, 7);
    ctx.fill();
  }

  pillLabel(ctx, 'COUNTER', 468, 198, 14);
}
