// Food, the chef, the plate, and the customer at the window.

import { PAL } from './config.js';
import { LAYOUT } from './stations.js';
import { assemblyRatio } from './plating.js';
import { focusOrder, orderLabel } from './orders.js';
import { customerLine } from './customers.js';
import { roundRect, inkText } from './render-kitchen.js';

export function drawItemIcon(ctx, id, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = PAL.ink;
  if (id === 'noodles' || id === 'broth') {
    ctx.strokeStyle = id === 'broth' ? '#f0c27a' : '#f6e6c0';
    ctx.beginPath();
    ctx.arc(0, 2, s * 0.42, 0.2, 5.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(2, 0, s * 0.22, 0, 6);
    ctx.stroke();
  } else if (id === 'beef' || id === 'pork') {
    ctx.fillStyle = id === 'pork' ? '#f0a080' : '#9a4034';
    ctx.beginPath();
    ctx.ellipse(-4, 0, s * 0.32, s * 0.2, -0.5, 0, 6.2);
    ctx.ellipse(5, 2, s * 0.28, s * 0.18, 0.4, 0, 6.2);
    ctx.fill();
    ctx.stroke();
  } else if (id === 'herbs') {
    ctx.fillStyle = '#3aaa45';
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.16, s * 0.42, 0.4, 0, 6.2);
    ctx.ellipse(-6, 2, s * 0.14, s * 0.36, -0.6, 0, 6.2);
    ctx.fill();
  } else if (id === 'lime') {
    ctx.fillStyle = '#c6e84a';
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.4, 0, 6.2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#6a8a20';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(s * 0.28, -s * 0.2);
    ctx.moveTo(0, 0);
    ctx.lineTo(-s * 0.1, s * 0.3);
    ctx.stroke();
  } else if (id === 'chili') {
    ctx.fillStyle = '#e23b2f';
    ctx.beginPath();
    ctx.ellipse(0, 2, s * 0.18, s * 0.42, 0.6, 0, 6.2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#3aaa45';
    ctx.beginPath();
    ctx.moveTo(-2, -s * 0.3);
    ctx.lineTo(2, -s * 0.5);
    ctx.stroke();
  } else if (id === 'baguette') {
    ctx.fillStyle = '#e8b45e';
    roundRect(ctx, -s * 0.5, -s * 0.22, s, s * 0.44, s * 0.2);
    ctx.fill();
    ctx.stroke();
  } else if (id === 'pickle') {
    ctx.fillStyle = '#ef8a3c';
    roundRect(ctx, -s * 0.34, -s * 0.16, s * 0.68, s * 0.28, 4);
    ctx.fill();
    ctx.stroke();
  } else if (id === 'ricepaper') {
    ctx.fillStyle = 'rgba(255,248,236,0.95)';
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.4, 0, 6.2);
    ctx.fill();
    ctx.stroke();
  } else if (id === 'shrimp') {
    ctx.strokeStyle = '#ff8d78';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.32, 0.5, 4.2);
    ctx.stroke();
  } else if (id === 'coffee') {
    ctx.fillStyle = '#5c3418';
    roundRect(ctx, -s * 0.28, -s * 0.2, s * 0.5, s * 0.48, 3);
    ctx.fill();
    ctx.stroke();
  } else if (id === 'milk') {
    ctx.fillStyle = '#fff8ea';
    roundRect(ctx, -s * 0.26, -s * 0.32, s * 0.52, s * 0.64, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e23b2f';
    ctx.fillRect(-s * 0.26, -s * 0.08, s * 0.52, s * 0.16);
  } else if (id === 'ice') {
    ctx.fillStyle = '#d4f6ff';
    ctx.fillRect(-s * 0.28, -s * 0.28, s * 0.28, s * 0.28);
    ctx.fillRect(0, -s * 0.08, s * 0.3, s * 0.3);
    ctx.strokeRect(-s * 0.28, -s * 0.28, s * 0.28, s * 0.28);
  }
  ctx.restore();
}

function ring(ctx, x, y, r, t, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(20,8,8,0.55)';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, Math.min(1, t)));
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.stroke();
}

export function drawDish(ctx, plate, x, y, scale) {
  const s = scale || 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const id = plate.recipeId;
  if (id === 'pho' || id === 'coffee') {
    ctx.fillStyle = id === 'coffee' ? '#d8ecf4' : '#f4f0e8';
    ctx.beginPath();
    ctx.ellipse(0, 8, 28, 12, 0, 0, 6.2);
    ctx.fill();
    ctx.strokeStyle = PAL.ink;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = id === 'coffee' ? '#5c3418' : '#e8a04a';
    ctx.beginPath();
    ctx.ellipse(0, 4, 22, 9, 0, 0, 6.2);
    ctx.fill();
    if (id === 'pho') {
      ctx.strokeStyle = '#f6e6c0';
      ctx.beginPath();
      ctx.arc(-4, 4, 8, 0, 5);
      ctx.stroke();
      ctx.fillStyle = '#9a4034';
      ctx.fillRect(4, 0, 8, 5);
      ctx.fillStyle = '#3aaa45';
      ctx.fillRect(-10, 2, 5, 5);
    } else {
      ctx.fillStyle = '#fff8ea';
      ctx.fillRect(-8, 6, 16, 4);
      ctx.fillStyle = '#d4f6ff';
      ctx.fillRect(-4, -2, 6, 6);
    }
  } else if (id === 'banhmi') {
    ctx.fillStyle = '#e8b45e';
    roundRect(ctx, -30, -8, 60, 22, 10);
    ctx.fill();
    ctx.strokeStyle = PAL.ink;
    ctx.stroke();
    ctx.fillStyle = '#3aaa45';
    ctx.fillRect(-18, -2, 8, 6);
    ctx.fillStyle = '#ef8a3c';
    ctx.fillRect(-6, -2, 8, 6);
    ctx.fillStyle = '#e23b2f';
    ctx.fillRect(6, -2, 7, 6);
    ctx.fillStyle = '#f0a080';
    ctx.fillRect(-22, 4, 14, 5);
  } else {
    ctx.fillStyle = 'rgba(244, 236, 220, 0.95)';
    roundRect(ctx, -26, -6, 22, 14, 7);
    ctx.fill();
    roundRect(ctx, 2, -4, 22, 14, 7);
    ctx.fill();
    ctx.strokeStyle = PAL.ink;
    ctx.stroke();
    ctx.fillStyle = '#ff8d78';
    ctx.fillRect(-16, -2, 6, 4);
    ctx.fillRect(10, 0, 6, 4);
    ctx.fillStyle = '#3aaa45';
    ctx.fillRect(-8, -1, 5, 4);
  }
  ctx.restore();
}

function drawChef(ctx, chef) {
  const bob = Math.sin(chef.bob) * 1.4;
  ctx.save();
  ctx.translate(chef.x, chef.y + bob);
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.beginPath();
  ctx.ellipse(0, 22, 16, 6, 0, 0, 6.2);
  ctx.fill();
  ctx.scale(chef.facing || 1, 1);
  ctx.fillStyle = '#2a140c';
  ctx.fillRect(-11, 8, 8, 10);
  ctx.fillRect(3, 8, 8, 10);
  ctx.fillStyle = '#fff1dc';
  roundRect(ctx, -14, -8, 28, 20, 6);
  ctx.fill();
  ctx.fillStyle = '#c4383a';
  roundRect(ctx, -14, -2, 28, 16, 4);
  ctx.fill();
  ctx.fillStyle = '#f0b48a';
  ctx.beginPath();
  ctx.arc(0, -18, 11, 0, 6.2);
  ctx.fill();
  ctx.fillStyle = '#2a140c';
  ctx.beginPath();
  ctx.arc(0, -22, 11, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = PAL.gold;
  ctx.fillRect(-12, -20, 24, 5);
  ctx.fillStyle = PAL.ink;
  ctx.fillRect(2, -18, 2.4, 2.4);
  ctx.fillRect(7, -18, 2.4, 2.4);
  ctx.restore();
  if (chef.holding?.kind === 'dish') drawDish(ctx, chef.holding.plate, chef.x + 22, chef.y - 8, 0.7);
  else if (chef.holding?.item) drawItemIcon(ctx, chef.holding.item, chef.x + 22, chef.y - 6, 18);
}

function drawCat(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#e8923a';
  roundRect(ctx, -16, -8, 32, 16, 8);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(14, -10, 8, 0, 6.2);
  ctx.fill();
  ctx.fillStyle = PAL.ink;
  ctx.fillRect(16, -14, 2, 2);
  ctx.fillRect(20, -14, 2, 2);
  ctx.fillStyle = '#fff6e4';
  ctx.fillRect(18, -8, 3, 2);
  ctx.restore();
  inkText(ctx, 'MISO', x, y + 20, 11, PAL.cream, 'center');
}

function drawCustomer(ctx, order, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 28, 14, 5, 0, 0, 6.2);
  ctx.fill();
  ctx.fillStyle = order.vip ? '#ffd56a' : '#3a6ea5';
  roundRect(ctx, -12, 0, 24, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#f0b48a';
  ctx.beginPath();
  ctx.arc(0, -8, 10, 0, 6.2);
  ctx.fill();
  ctx.fillStyle = '#2a140c';
  ctx.beginPath();
  ctx.arc(0, -12, 10, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = PAL.ink;
  ctx.fillRect(-4, -8, 2, 2);
  ctx.fillRect(2, -8, 2, 2);
  ctx.restore();
}

function bubble(ctx, text, x, y) {
  ctx.font = 'bold 13px "Trebuchet MS", "Segoe UI", sans-serif';
  const w = ctx.measureText(text).width + 18;
  roundRect(ctx, x, y, w, 26, 8);
  ctx.fillStyle = '#fffaf0';
  ctx.fill();
  ctx.strokeStyle = PAL.ink;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 22, y + 26);
  ctx.lineTo(x + 30, y + 36);
  ctx.lineTo(x + 38, y + 26);
  ctx.fillStyle = '#fffaf0';
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = PAL.ink;
  ctx.textAlign = 'left';
  ctx.fillText(text, x + 9, y + 18);
}

export function drawFood(ctx, state) {
  for (let i = 0; i < LAYOUT.length; i += 1) {
    const s = LAYOUT[i];
    if (s.kind !== 'crate') continue;
    drawItemIcon(ctx, s.item, s.x + s.w / 2, s.y + 18, 16);
    inkText(ctx, s.label, s.x + s.w / 2, s.y + s.h + 12, 11, PAL.cream, 'center');
  }
  const chop = LAYOUT.find((s) => s.id === 'chop');
  if (state.chop.item) {
    drawItemIcon(ctx, state.chop.item.item, chop.x + 48, chop.y + 58, 22);
    ring(ctx, chop.x + chop.w - 28, chop.y + 36, 18, state.chop.progress, '#c6e84a');
  }
  inkText(ctx, 'CHOP', chop.x + 16, chop.y + 14, 13, PAL.gold, 'left');

  const pot = LAYOUT.find((s) => s.id === 'pot');
  ctx.fillStyle = state.pot.phase === 'burnt' ? '#5a4030' : '#e8a04a';
  ctx.beginPath();
  ctx.ellipse(pot.x + pot.w / 2, pot.y + 70, 36, 14, 0, 0, 6.2);
  ctx.fill();
  ctx.strokeStyle = PAL.ink;
  ctx.stroke();
  if (state.pot.phase === 'cook' || state.pot.phase === 'ready') {
    ring(ctx, pot.x + pot.w - 18, pot.y + 28, 16, state.pot.phase === 'ready' ? state.pot.readyFor / 5 : state.pot.progress, state.pot.phase === 'ready' ? '#fff6e4' : '#ff9a2e');
  }
  inkText(ctx, state.pot.phase === 'burnt' ? 'BURNT' : 'BROTH', pot.x + pot.w / 2, pot.y + 16, 13, PAL.gold, 'center');

  const grill = LAYOUT.find((s) => s.id === 'grill');
  if (state.grill.item) drawItemIcon(ctx, 'pork', grill.x + grill.w / 2, grill.y + 58, 22);
  if (state.grill.phase === 'flip') inkText(ctx, 'FLIP!', grill.x + grill.w / 2, grill.y + 18, 16, '#fff6e4', 'center');
  else inkText(ctx, 'GRILL', grill.x + 12, grill.y + 16, 13, PAL.gold, 'left');
  if (state.grill.phase === 'cook' || state.grill.phase === 'flip' || state.grill.phase === 'finish') {
    ring(ctx, grill.x + grill.w - 22, grill.y + 30, 16, state.grill.progress, state.grill.phase === 'flip' ? '#ffd56a' : '#ff7a3c');
  }

  const asm = LAYOUT.find((s) => s.id === 'assembly');
  inkText(ctx, 'ASSEMBLY', asm.x + 12, asm.y + 20, 14, PAL.gold, 'left');
  if (state.assembly.recipeId) {
    const order = focusOrder(state);
    const ratio = assemblyRatio(state, order && order.recipeId === state.assembly.recipeId ? order : null);
    drawDish(ctx, { recipeId: state.assembly.recipeId, items: state.assembly.items }, asm.x + 78, asm.y + 62, 1.15);
    inkText(ctx, `${ratio.have}/${ratio.need}`, asm.x + asm.w - 46, asm.y + 78, 22, '#fff6e4', 'center');
  }

  const pass = LAYOUT.find((s) => s.id === 'pass');
  inkText(ctx, 'PASS', pass.x + 14, pass.y + 28, 13, PAL.gold, 'left');
  if (state.plate) {
    const pulse = 0.35 + Math.sin(state.time * 5) * 0.15;
    ctx.save();
    ctx.shadowColor = '#ffd56a';
    ctx.shadowBlur = 18;
    ctx.fillStyle = `rgba(255, 210, 120, ${pulse})`;
    ctx.beginPath();
    ctx.ellipse(pass.x + 78, pass.y + 78, 40, 18, 0, 0, 6.2);
    ctx.fill();
    ctx.restore();
    drawDish(ctx, state.plate, pass.x + 70, pass.y + 64, 1.15);
    inkText(ctx, 'READY', pass.x + 70, pass.y + 118, 18, '#fff6e4', 'center');
  }
  const guest = state.orders[0];
  if (guest) {
    drawCustomer(ctx, guest, pass.x + 170, pass.y + 58);
    bubble(ctx, customerLine(guest), pass.x + 8, pass.y - 30);
  }
  if (state.upgrades.cat) drawCat(ctx, 470, 360);
  drawChef(ctx, state.chef);
  if (state.dragItem && state.pointer) drawItemIcon(ctx, state.dragItem.item, state.pointer.x, state.pointer.y, 18);
  inkText(ctx, 'SINK', 176, 468, 12, PAL.cream, 'left');
}
