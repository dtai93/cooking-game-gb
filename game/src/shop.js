// Between-night stall upgrades. Each one is bought once.

import { UPGRADES } from './config.js';
import { playCash, playThud } from './audio.js';

export function upgradeList() {
  return UPGRADES;
}

export function shopCardRect(index) {
  return { x: 36 + index * 176, y: 150, w: 164, h: 230 };
}

export function continueRect() {
  return { x: 748, y: 536, w: 236, h: 64 };
}

export function buyUpgrade(state, id) {
  const spec = UPGRADES.find((u) => u.id === id);
  if (!spec || state.upgrades[id]) return false;
  if (state.money < spec.cost) {
    playThud();
    return false;
  }
  state.money -= spec.cost;
  state.upgrades[id] = true;
  playCash();
  return true;
}

export function cardAt(x, y) {
  for (let i = 0; i < UPGRADES.length; i += 1) {
    const r = shopCardRect(i);
    if (x >= r.x && y >= r.y && x <= r.x + r.w && y <= r.y + r.h) return UPGRADES[i].id;
  }
  return null;
}
