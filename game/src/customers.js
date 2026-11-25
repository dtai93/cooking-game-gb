// People at the window: names, speech, patience, and the moment they walk off angry.

import { NIGHTS, MAX_STRIKES } from './config.js';
import { recipeById } from './recipes.js';
import { pushFloater } from './particles.js';
import { playBurn } from './audio.js';
import { breakCombo } from './scoring.js';

const NAMES = ['Lan', 'Minh', 'Hoa', 'Duc', 'Trang', 'Bao', 'Kim', 'Vy', 'An', 'Mai', 'Kiet', 'Phuoc'];

export function customerLine(order) {
  const recipe = recipeById(order.recipeId);
  if (order.vip) return 'VIP — the full pho!';
  if (order.recipeId === 'pho' && order.extras.includes('lime') && order.extras.includes('chili')) return 'Pho, lime and chili!';
  if (order.recipeId === 'pho' && order.extras.includes('lime')) return 'Pho, extra lime!';
  if (order.recipeId === 'pho' && order.extras.includes('chili')) return 'Pho, extra chili!';
  if (order.recipeId === 'banhmi') return 'Banh mi, please!';
  if (order.recipeId === 'goicuon') return 'Goi cuon, two rolls!';
  if (order.recipeId === 'coffee') return 'Ca phe sua da!';
  return `${recipe.short}, please!`;
}

export function spawnCustomer(state) {
  const night = NIGHTS[state.nightIndex];
  if (state.orders.length >= night.maxTickets) return false;
  const roll = state.rng();
  const recipeId = night.recipes[Math.floor(roll * night.recipes.length) % night.recipes.length];
  const extras = [];
  if (recipeId === 'pho') {
    const vipRoll = state.rng();
    if (vipRoll < night.vip) extras.push('lime', 'chili');
    else if (state.rng() < 0.45) extras.push(state.rng() < 0.5 ? 'lime' : 'chili');
  }
  const name = NAMES[Math.floor(state.rng() * NAMES.length) % NAMES.length];
  state.orders.push({
    id: state.nextOrderId,
    recipeId,
    extras,
    vip: extras.length > 1,
    patience: 1,
    maxTime: night.patience * (extras.length > 1 ? 1.15 : 1),
    name,
    born: state.time,
  });
  state.nextOrderId += 1;
  return true;
}

export function updateCustomers(state, dt) {
  const slow = state.upgrades.cat ? 0.86 : 1;
  const keep = [];
  for (let i = 0; i < state.orders.length; i += 1) {
    const order = state.orders[i];
    order.patience -= (dt / order.maxTime) * slow;
    if (order.patience > 0) {
      keep.push(order);
      continue;
    }
    state.nightStrikes += 1;
    state.strikes += 1;
    breakCombo(state);
    pushFloater(state, 640, 460, `${order.name} LEFT`, '#ff8a78');
    playBurn();
  }
  state.orders = keep;
  if (state.nightStrikes >= MAX_STRIKES && state.screen === 'play') {
    state.screen = 'results';
    state.result = 'over';
  }
}

export function moodOf(order) {
  if (order.patience > 0.66) return 'PLEASED';
  if (order.patience > 0.33) return 'WAITING';
  return 'IMPATIENT';
}
