// Order board, lantern clock, money, the window list, and the key bar.

import { PAL, NIGHTS, formatClock, clamp } from './config.js';
import { orderLabel, ticketChecks } from './orders.js';
import { moodOf } from './customers.js';
import { objectiveLine } from './nights.js';
import { roundRect, fillPanel, inkText } from './render-kitchen.js';
import { drawItemIcon } from './render-food.js';

function ticket(ctx, state, order, x, y, w, h) {
  const hot = state.assembly.recipeId === order.recipeId;
  fillPanel(ctx, x, y, w, h, hot ? 'rgba(92, 32, 18, 0.92)' : 'rgba(28, 16, 12, 0.88)', hot ? '#ffd56a' : '#a87838');
  ctx.fillStyle = order.vip ? '#ffd56a' : '#e8a04a';
  ctx.beginPath();
  ctx.arc(x + 16, y + 18, 10, 0, 6.2);
  ctx.fill();
  drawItemIcon(ctx, order.recipeId === 'banhmi' ? 'baguette' : order.recipeId === 'goicuon' ? 'ricepaper' : order.recipeId === 'coffee' ? 'coffee' : 'noodles', x + 16, y + 18, 12);
  inkText(ctx, orderLabel(order), x + 30, y + 22, 12, PAL.cream, 'left');
  const steps = ticketChecks(state, order);
  for (let i = 0; i < steps.length; i += 1) {
    const sx = x + 10 + i * 16;
    ctx.globalAlpha = steps[i].done ? 1 : 0.35;
    drawItemIcon(ctx, steps[i].item, sx + 6, y + 38, 10);
    ctx.globalAlpha = 1;
    if (steps[i].done) {
      ctx.strokeStyle = '#c6e84a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx + 2, y + 38);
      ctx.lineTo(sx + 6, y + 42);
      ctx.lineTo(sx + 12, y + 32);
      ctx.stroke();
    }
  }
  const t = clamp(order.patience, 0, 1);
  ctx.fillStyle = '#2a140c';
  roundRect(ctx, x + 8, y + h - 12, w - 16, 6, 3);
  ctx.fill();
  ctx.fillStyle = t > 0.5 ? '#7dce4a' : t > 0.25 ? '#ffb03a' : '#e23b2f';
  roundRect(ctx, x + 8, y + h - 12, (w - 16) * t, 6, 3);
  ctx.fill();
}

function keycap(ctx, x, y, text) {
  ctx.font = 'bold 12px "Trebuchet MS", "Segoe UI", sans-serif';
  const w = Math.max(22, ctx.measureText(text).width + 12);
  roundRect(ctx, x, y, w, 20, 5);
  ctx.fillStyle = '#3a2818';
  ctx.fill();
  ctx.strokeStyle = PAL.gold;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = PAL.cream;
  ctx.textAlign = 'left';
  ctx.fillText(text, x + 6, y + 15);
  return w;
}

export function drawHud(ctx, state) {
  const night = NIGHTS[state.nightIndex];
  fillPanel(ctx, 8, 6, 1008, 42, 'rgba(22, 12, 10, 0.88)');
  inkText(ctx, 'LANTERN LANE', 22, 24, 16, PAL.gold, 'left');
  ctx.font = 'bold 12px "Trebuchet MS", "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = PAL.cream;
  ctx.fillText(`NIGHT ${state.nightIndex + 1}  ·  ${night.name.toUpperCase()}`, 22, 40);

  const left = state.nightLength - state.nightTime;
  const frac = clamp(left / state.nightLength, 0, 1);
  inkText(ctx, 'LANTERN', 512, 20, 11, PAL.gold, 'center');
  ctx.fillStyle = '#2a140c';
  roundRect(ctx, 390, 26, 244, 14, 7);
  ctx.fill();
  ctx.fillStyle = frac > 0.3 ? '#ff9a2e' : '#e23b2f';
  roundRect(ctx, 390, 26, 244 * frac, 14, 7);
  ctx.fill();
  inkText(ctx, formatClock(left), 640, 38, 16, '#fff6e4', 'left');

  inkText(ctx, `$${state.money}`, 900, 24, 18, PAL.gold, 'right');
  ctx.font = 'bold 12px "Trebuchet MS", "Segoe UI", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillStyle = PAL.cream;
  ctx.fillText(`TIPS $${state.nightTips}`, 1000, 24);
  if (state.combo >= 2) inkText(ctx, `RUSH x${state.combo}`, 1000, 42, 14, '#ff9a2e', 'right');
  else ctx.fillText('COMBO —', 1000, 42);

  fillPanel(ctx, 8, 52, 128, 58, 'rgba(28, 14, 10, 0.9)');
  inkText(ctx, 'ORDER', 72, 76, 14, PAL.gold, 'center');
  inkText(ctx, 'BOARD', 72, 96, 14, PAL.cream, 'center');
  const n = state.orders.length;
  const gap = n > 0 ? Math.min(124, (760 - 146) / n) : 124;
  for (let i = 0; i < n; i += 1) ticket(ctx, state, state.orders[i], 146 + i * gap, 52, gap - 6, 58);

  fillPanel(ctx, 792, 116, 220, 438);
  inkText(ctx, 'THE WINDOW', 902, 140, 14, PAL.gold, 'center');
  ctx.font = '12px "Trebuchet MS", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e7c99a';
  ctx.fillText(`${state.orders.length} WAITING`, 902, 158);
  for (let i = 0; i < state.orders.length; i += 1) {
    const order = state.orders[i];
    const y = 176 + i * 70;
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    roundRect(ctx, 804, y, 196, 64, 8);
    ctx.fill();
    inkText(ctx, order.name, 814, y + 18, 13, PAL.cream, 'left');
    ctx.font = 'bold 12px "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = order.vip ? '#ffd56a' : '#ffd0a8';
    ctx.fillText(orderLabel(order), 990, y + 18);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#c8b49a';
    ctx.fillText(moodOf(order), 814, y + 36);
    const t = clamp(order.patience, 0, 1);
    ctx.fillStyle = '#2a140c';
    roundRect(ctx, 814, y + 46, 176, 8, 4);
    ctx.fill();
    ctx.fillStyle = t > 0.5 ? '#7dce4a' : t > 0.25 ? '#ffb03a' : '#e23b2f';
    roundRect(ctx, 814, y + 46, 176 * t, 8, 4);
    ctx.fill();
  }

  fillPanel(ctx, 8, 560, 1008, 72);
  const keys = [['WASD', 'MOVE'], ['E', 'USE'], ['HOLD', 'CHOP'], ['CLICK', 'WALK'], ['P', 'PAUSE'], ['M', 'MUTE']];
  let kx = 20;
  for (let i = 0; i < keys.length; i += 1) {
    kx += keycap(ctx, kx, 572, keys[i][0]) + 4;
    ctx.font = 'bold 11px "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.fillStyle = PAL.cream;
    ctx.textAlign = 'left';
    ctx.fillText(keys[i][1], kx, 586);
    kx += ctx.measureText(keys[i][1]).width + 12;
  }
  inkText(ctx, 'OBJECTIVE', 20, 614, 11, PAL.gold, 'left');
  ctx.font = 'bold 14px "Trebuchet MS", "Segoe UI", sans-serif';
  ctx.fillStyle = PAL.cream;
  ctx.textAlign = 'left';
  ctx.fillText(objectiveLine(state), 110, 614);
}
