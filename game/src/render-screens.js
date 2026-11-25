// Title, stall shop, victory and game-over, and the pause veil.

import { PAL, NIGHTS, UPGRADES } from './config.js';
import { recipeList } from './recipes.js';
import { letterGrade, featList } from './scoring.js';
import { shopCardRect, continueRect, upgradeList } from './shop.js';
import { roundRect, fillPanel, inkText } from './render-kitchen.js';
import { drawDish, drawItemIcon } from './render-food.js';

function hit(r, x, y) {
  return x >= r.x && y >= r.y && x <= r.x + r.w && y <= r.y + r.h;
}

function nightRect(index) {
  return { x: 536 + (index % 3) * 156, y: 392 + Math.floor(index / 3) * 68, w: 146, h: 60 };
}

function playRect() {
  return { x: 620, y: 540, w: 360, h: 72 };
}

function againRect() {
  return { x: 688, y: 548, w: 292, h: 64 };
}

function miniLantern(ctx, x, y, color) {
  ctx.fillStyle = color;
  roundRect(ctx, x, y, 28, 42, 8);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = PAL.ink;
  ctx.stroke();
  ctx.fillStyle = '#fff3c4';
  roundRect(ctx, x + 8, y + 12, 12, 16, 3);
  ctx.fill();
}

function stars(ctx, x, y, count, size) {
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = i < count ? '#ffd56a' : '#4a3424';
    ctx.strokeStyle = PAL.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + i * (size + 6), y, size * 0.45, 0, 6.2);
    ctx.fill();
    ctx.stroke();
  }
}

function backdrop(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 640);
  g.addColorStop(0, '#3a1860');
  g.addColorStop(0.4, '#7a3030');
  g.addColorStop(1, '#1a0c10');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 640);
  ctx.fillStyle = '#6b3418';
  ctx.fillRect(0, 560, 1024, 80);
}

function logoBowl(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(255,180,60,0.35)';
  ctx.beginPath();
  ctx.arc(0, 0, 78, 0, 6.2);
  ctx.fill();
  ctx.fillStyle = '#f4f0e8';
  ctx.beginPath();
  ctx.ellipse(0, 10, 70, 28, 0, 0, 6.2);
  ctx.fill();
  ctx.strokeStyle = PAL.ink;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#e8a04a';
  ctx.beginPath();
  ctx.ellipse(0, 2, 54, 20, 0, 0, 6.2);
  ctx.fill();
  ctx.strokeStyle = '#f6e6c0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(-10, 0, 16, 0, 5);
  ctx.stroke();
  ctx.fillStyle = '#3aaa45';
  ctx.beginPath();
  ctx.ellipse(16, -2, 8, 14, 0.4, 0, 6.2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-16, -36);
  ctx.quadraticCurveTo(-4, -56, -8, -74);
  ctx.moveTo(6, -34);
  ctx.quadraticCurveTo(18, -58, 10, -78);
  ctx.stroke();
  ctx.restore();
}

export function drawTitleScreen(ctx, state) {
  backdrop(ctx);
  logoBowl(ctx, 200, 150);
  miniLantern(ctx, 78, 28, '#ff9a2e');
  miniLantern(ctx, 300, 20, '#e23a3a');
  inkText(ctx, 'LANTERN LANE', 40, 250, 36, PAL.gold, 'left');
  inkText(ctx, 'SAIGON NIGHT-MARKET KITCHEN', 42, 278, 14, PAL.cream, 'left');
  ctx.font = 'bold 15px "Trebuchet MS", "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffe7b8';
  ctx.textAlign = 'left';
  ctx.fillText('Six nights. One stall. Keep the broth alive.', 42, 304);

  fillPanel(ctx, 28, 328, 480, 250);
  inkText(ctx, 'HOW TO PLAY', 48, 356, 16, PAL.gold, 'left');
  const lines = [
    'WASD or arrows move. Click a station to walk there.',
    'E or Space picks up, sets down, ladles, flips, serves.',
    'Hold E on the board to chop. Flip pork in the gold window.',
    'Stack a ticket on the assembly counter, then bell the pass.',
    'Patience drains. Three angry customers close the lane.',
    'M mutes. P pauses. Tips grow when the rush chains.',
  ];
  ctx.font = 'bold 14px "Trebuchet MS", "Segoe UI", sans-serif';
  ctx.fillStyle = PAL.cream;
  for (let i = 0; i < lines.length; i += 1) ctx.fillText(lines[i], 48, 388 + i * 28);

  const recipes = recipeList();
  for (let i = 0; i < recipes.length; i += 1) {
    const r = recipes[i];
    const x = 530 + (i % 2) * 240;
    const y = 24 + Math.floor(i / 2) * 150;
    fillPanel(ctx, x, y, 228, 140);
    drawDish(ctx, { recipeId: r.id, items: [] }, x + 52, y + 70, 0.95);
    inkText(ctx, r.name.toUpperCase(), x + 96, y + 36, 15, PAL.gold, 'left');
    ctx.font = 'bold 13px "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.fillStyle = PAL.cream;
    ctx.textAlign = 'left';
    ctx.fillText(`$${r.price}`, x + 96, y + 58);
    const bits = r.steps.map((s) => s.label).join(' · ');
    ctx.font = '12px "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.fillStyle = '#f0d8b0';
    wrap(ctx, bits, x + 96, y + 82, 120);
  }

  fillPanel(ctx, 524, 340, 476, 186);
  inkText(ctx, 'CHOOSE A NIGHT', 544, 368, 15, PAL.gold, 'left');
  for (let i = 0; i < NIGHTS.length; i += 1) {
    const r = nightRect(i);
    const open = i <= state.unlockedThrough;
    const on = i === state.selectedNight;
    fillPanel(ctx, r.x, r.y, r.w, r.h, on ? 'rgba(120, 48, 16, 0.95)' : 'rgba(20, 12, 10, 0.85)', on ? '#ffd56a' : '#8a6840');
    inkText(ctx, open ? `NIGHT ${i + 1}` : 'LOCKED', r.x + 12, r.y + 24, 13, open ? PAL.cream : '#8a7060', 'left');
    ctx.font = '12px "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.fillStyle = '#f0d8b0';
    ctx.textAlign = 'left';
    ctx.fillText(open ? NIGHTS[i].name : '—', r.x + 12, r.y + 44);
  }
  const play = playRect();
  fillPanel(ctx, play.x, play.y, play.w, play.h, '#c9842a', '#fff1c2');
  inkText(ctx, 'PLAY', play.x + play.w / 2, play.y + 46, 32, '#2a140c', 'center');
}

function wrap(ctx, text, x, y, width) {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (let i = 0; i < words.length; i += 1) {
    const trial = `${line} ${words[i]}`.trim();
    if (ctx.measureText(trial).width > width && line) {
      ctx.fillText(line, x, yy);
      line = words[i];
      yy += 16;
    } else line = trial;
  }
  if (line) ctx.fillText(line, x, yy);
}

export function drawShopScreen(ctx, state) {
  backdrop(ctx);
  fillPanel(ctx, 24, 16, 976, 120);
  inkText(ctx, `NIGHT ${state.nightIndex + 1} CLEARED`, 48, 62, 32, PAL.gold, 'left');
  inkText(ctx, NIGHTS[state.nightIndex].name, 48, 96, 16, PAL.cream, 'left');
  stars(ctx, 520, 62, state.lastStars, 28);
  inkText(ctx, `TIPS +$${state.nightTips}`, 760, 52, 18, PAL.gold, 'left');
  inkText(ctx, `STALL $${state.money}`, 760, 84, 18, PAL.cream, 'left');
  const list = upgradeList();
  for (let i = 0; i < list.length; i += 1) {
    const spec = list[i];
    const r = shopCardRect(i);
    const owned = state.upgrades[spec.id];
    fillPanel(ctx, r.x, r.y, r.w, r.h, owned ? 'rgba(48, 72, 32, 0.92)' : 'rgba(28, 16, 12, 0.92)');
    drawUpgradeArt(ctx, spec.id, r.x + r.w / 2, r.y + 62);
    inkText(ctx, spec.name.toUpperCase(), r.x + r.w / 2, r.y + 118, 14, PAL.gold, 'center');
    ctx.font = '13px "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.fillStyle = PAL.cream;
    ctx.textAlign = 'center';
    wrap(ctx, spec.blurb, r.x + r.w / 2, r.y + 146, r.w - 32);
    inkText(ctx, owned ? 'OWNED' : `$${spec.cost}`, r.x + r.w / 2, r.y + 206, 18, owned ? '#b6e04a' : '#fff6e4', 'center');
  }
  fillPanel(ctx, 36, 400, 690, 200);
  inkText(ctx, 'RECIPE BOOK', 56, 430, 16, PAL.gold, 'left');
  const recipes = recipeList();
  for (let i = 0; i < recipes.length; i += 1) {
    const r = recipes[i];
    const x = 56 + i * 166;
    const open = NIGHTS.slice(0, state.nightIndex + 1).some((night) => night.recipes.includes(r.id));
    ctx.globalAlpha = open ? 1 : 0.4;
    drawDish(ctx, { recipeId: r.id }, x + 50, 500, 0.9);
    ctx.globalAlpha = 1;
    inkText(ctx, r.short.toUpperCase(), x + 50, 560, 13, open ? PAL.cream : '#8a7060', 'center');
    ctx.font = '12px "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.fillStyle = open ? '#f0d8b0' : '#8a7060';
    ctx.textAlign = 'center';
    ctx.fillText(open ? 'UNLOCKED' : 'LOCKED', x + 50, 578);
  }
  const go = continueRect();
  fillPanel(ctx, go.x, go.y, go.w, go.h, '#c9842a', '#fff1c2');
  inkText(ctx, 'CONTINUE', go.x + go.w / 2, go.y + 42, 24, '#2a140c', 'center');
}

function drawUpgradeArt(ctx, id, x, y) {
  ctx.save();
  ctx.translate(x, y);
  if (id === 'knife') {
    ctx.strokeStyle = '#d8dde4';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-20, 16);
    ctx.lineTo(16, -18);
    ctx.stroke();
    ctx.strokeStyle = '#8a3a1c';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(-24, 20);
    ctx.lineTo(-12, 10);
    ctx.stroke();
  } else if (id === 'pot') {
    ctx.fillStyle = '#3a3e44';
    roundRect(ctx, -22, -8, 44, 28, 8);
    ctx.fill();
    ctx.fillStyle = '#e8a04a';
    ctx.beginPath();
    ctx.ellipse(0, -2, 14, 6, 0, 0, 6.2);
    ctx.fill();
  } else if (id === 'cat') {
    ctx.fillStyle = '#e8923a';
    roundRect(ctx, -20, -6, 36, 18, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(16, -10, 9, 0, 6.2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#c9842a';
    roundRect(ctx, -16, -16, 32, 36, 6);
    ctx.fill();
    ctx.fillStyle = '#ffd56a';
    ctx.font = 'bold 16px "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('$', 0, 8);
  }
  ctx.restore();
}

export function drawResultsScreen(ctx, state) {
  backdrop(ctx);
  const won = state.result === 'clear';
  fillPanel(ctx, 24, 16, 976, 608);
  inkText(ctx, won ? 'THE LANE IS YOURS' : 'THE LANE GOES DARK', 512, 64, 28, PAL.gold, 'center');
  inkText(ctx, won ? 'Six nights served' : 'Too many customers walked off', 512, 96, 16, PAL.cream, 'center');
  ctx.beginPath();
  ctx.arc(180, 240, 78, 0, 6.2);
  ctx.fillStyle = '#c9842a';
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#fff1c2';
  ctx.stroke();
  inkText(ctx, letterGrade(state), 180, 256, 64, '#2a140c', 'center');
  inkText(ctx, 'GRADE', 180, 290, 14, '#3a2412', 'center');
  inkText(ctx, `$${state.score}`, 430, 180, 42, PAL.gold, 'left');
  const stats = [
    ['DISHES SERVED', state.served],
    ['PERFECT PLATES', state.perfect],
    ['BEST RUSH', `x${state.bestCombo}`],
    ['TIPS', `$${state.tipsTotal}`],
    ['BURNT ITEMS', state.burnt],
  ];
  for (let i = 0; i < stats.length; i += 1) {
    const y = 220 + i * 42;
    ctx.font = 'bold 16px "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.fillStyle = '#f0d8b0';
    ctx.textAlign = 'left';
    ctx.fillText(stats[i][0], 360, y);
    inkText(ctx, String(stats[i][1]), 680, y, 18, PAL.cream, 'right');
  }
  inkText(ctx, 'NIGHTS', 800, 168, 14, PAL.gold, 'left');
  for (let i = 0; i < 6; i += 1) {
    const y = 198 + i * 28;
    ctx.font = 'bold 13px "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.fillStyle = PAL.cream;
    ctx.textAlign = 'left';
    ctx.fillText(`${i + 1} ${NIGHTS[i].name}`, 790, y);
    stars(ctx, 930, y - 5, state.stars[i], 10);
  }
  const feats = featList(state);
  inkText(ctx, 'FEATS', 60, 400, 16, PAL.gold, 'left');
  for (let i = 0; i < feats.length; i += 1) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 60 + col * 280;
    const y = 430 + row * 36;
    roundRect(ctx, x, y - 16, 22, 22, 4);
    ctx.fillStyle = feats[i].done ? '#7dce4a' : '#3a2818';
    ctx.fill();
    ctx.strokeStyle = PAL.gold;
    ctx.stroke();
    if (feats[i].done) inkText(ctx, '✓', x + 11, y + 1, 14, '#1a1008', 'center');
    ctx.font = 'bold 14px "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.fillStyle = PAL.cream;
    ctx.textAlign = 'left';
    ctx.fillText(feats[i].name, x + 30, y);
  }
  const again = againRect();
  fillPanel(ctx, again.x, again.y, again.w, again.h, '#c9842a', '#fff1c2');
  inkText(ctx, 'PLAY AGAIN', again.x + again.w / 2, again.y + 42, 22, '#2a140c', 'center');
}

export function drawPauseOverlay(ctx) {
  ctx.fillStyle = 'rgba(12, 6, 10, 0.55)';
  ctx.fillRect(0, 0, 1024, 640);
  fillPanel(ctx, 312, 240, 400, 150);
  inkText(ctx, 'PAUSED', 512, 310, 36, PAL.gold, 'center');
  inkText(ctx, 'P OR ENTER TO RETURN', 512, 350, 14, PAL.cream, 'center');
}

export function screenClick(state, x, y) {
  if (state.screen === 'title') {
    if (hit(playRect(), x, y)) return { type: 'play' };
    for (let i = 0; i < NIGHTS.length; i += 1) {
      if (hit(nightRect(i), x, y)) return { type: 'night', index: i };
    }
  }
  if (state.screen === 'shop') {
    for (let i = 0; i < UPGRADES.length; i += 1) {
      if (hit(shopCardRect(i), x, y)) return { type: 'buy', id: UPGRADES[i].id };
    }
    if (hit(continueRect(), x, y)) return { type: 'continue' };
  }
  if (state.screen === 'results' && hit(againRect(), x, y)) return { type: 'again' };
  return null;
}
