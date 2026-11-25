// Kitchen layout and what happens when the chef uses a station.

import { REACH } from './config.js';
import { freshItem, needsChop } from './ingredients.js';
import { addToAssembly, takeFinishedDish, clearAssembly, assemblyComplete } from './plating.js';
import { tryServePlate, placePlateOnPass } from './orders.js';
import { burstParticles, pushFloater, puffSteam } from './particles.js';
import { playChop, playSizzle, playBurn, playThud, playDing } from './audio.js';
import { breakCombo } from './scoring.js';

export const LAYOUT = [
  { id: 'noodles', kind: 'crate', item: 'noodles', x: 168, y: 126, w: 70, h: 50, label: 'NOODLES' },
  { id: 'beef', kind: 'crate', item: 'beef', x: 244, y: 126, w: 70, h: 50, label: 'BEEF' },
  { id: 'herbs', kind: 'crate', item: 'herbs', x: 320, y: 126, w: 70, h: 50, label: 'HERBS' },
  { id: 'lime', kind: 'crate', item: 'lime', x: 396, y: 126, w: 70, h: 50, label: 'LIME' },
  { id: 'chili', kind: 'crate', item: 'chili', x: 472, y: 126, w: 70, h: 50, label: 'CHILI' },
  { id: 'baguette', kind: 'crate', item: 'baguette', x: 548, y: 126, w: 70, h: 50, label: 'BAGUETTE' },
  { id: 'pork', kind: 'crate', item: 'pork', x: 624, y: 126, w: 70, h: 50, label: 'PORK' },
  { id: 'pickle', kind: 'crate', item: 'pickle', x: 700, y: 126, w: 68, h: 50, label: 'PICKLE' },
  { id: 'ricepaper', kind: 'crate', item: 'ricepaper', x: 22, y: 196, w: 78, h: 50, label: 'PAPER' },
  { id: 'shrimp', kind: 'crate', item: 'shrimp', x: 22, y: 258, w: 78, h: 50, label: 'SHRIMP' },
  { id: 'coffee', kind: 'crate', item: 'coffee', x: 22, y: 320, w: 78, h: 50, label: 'COFFEE' },
  { id: 'milk', kind: 'crate', item: 'milk', x: 22, y: 382, w: 78, h: 50, label: 'MILK' },
  { id: 'ice', kind: 'crate', item: 'ice', x: 22, y: 444, w: 78, h: 50, label: 'ICE' },
  { id: 'chop', kind: 'chop', x: 150, y: 236, w: 156, h: 104, label: 'CHOP' },
  { id: 'pot', kind: 'pot', x: 330, y: 210, w: 136, h: 124, label: 'BROTH' },
  { id: 'grill', kind: 'grill', x: 500, y: 206, w: 160, h: 118, label: 'GRILL' },
  { id: 'trash', kind: 'trash', x: 150, y: 392, w: 108, h: 78, label: 'SINK' },
  { id: 'assembly', kind: 'assembly', x: 280, y: 392, w: 236, h: 124, label: 'ASSEMBLY' },
  { id: 'pass', kind: 'pass', x: 534, y: 378, w: 214, h: 140, label: 'PASS' },
];

export function stationById(id) {
  return LAYOUT.find((s) => s.id === id) || null;
}

function center(station) {
  return { x: station.x + station.w / 2, y: station.y + station.h / 2 };
}

export function distToStation(chef, station) {
  const c = center(station);
  return Math.hypot(chef.x - c.x, chef.y - c.y);
}

export function stationAtPoint(x, y) {
  for (let i = LAYOUT.length - 1; i >= 0; i -= 1) {
    const s = LAYOUT[i];
    if (x >= s.x && y >= s.y && x <= s.x + s.w && y <= s.y + s.h) return s;
  }
  return null;
}

export function nearestStation(chef) {
  let best = null;
  let bestD = REACH;
  for (let i = 0; i < LAYOUT.length; i += 1) {
    const d = distToStation(chef, LAYOUT[i]);
    if (d < bestD) {
      best = LAYOUT[i];
      bestD = d;
    }
  }
  return best;
}

function markBurn(state, x, y) {
  state.burnt += 1;
  state.nightBurnt += 1;
  breakCombo(state);
  pushFloater(state, x, y, 'BURNT!', '#ff6a4a');
  playBurn();
}

export function updateStations(state, dt, holdingUse) {
  const chopTime = state.upgrades.knife ? 0.95 : 1.6;
  const cookTime = state.upgrades.pot ? 4.4 : 6.6;
  const readyTime = state.upgrades.pot ? 7.2 : 4.6;
  const grillTime = 5.2;
  const nearChop = distToStation(state.chef, stationById('chop')) < REACH;
  if (state.chop.item && state.chop.item.prep === 'raw' && holdingUse && nearChop) {
    state.chop.progress += dt / chopTime;
    state.chop.thwack = (state.chop.thwack || 0) + dt;
    if (state.chop.thwack > 0.16) {
      state.chop.thwack = 0;
      playChop();
      burstParticles(state, 228, 280, '#3aaa45', 4, 'herb');
    }
    if (state.chop.progress >= 1) {
      state.chop.item.prep = 'chopped';
      state.chop.progress = 1;
      pushFloater(state, 228, 250, 'CHOPPED', '#c6e84a');
      playDing();
    }
  }
  if (state.pot.phase === 'cook') {
    state.pot.progress += dt / cookTime;
    if (state.pot.progress >= 1) {
      state.pot.phase = 'ready';
      state.pot.readyFor = readyTime;
      pushFloater(state, 398, 230, 'BROTH READY', '#ffd56a');
      playDing();
    }
  } else if (state.pot.phase === 'ready') {
    state.pot.readyFor -= dt;
    if (state.pot.readyFor <= 0) {
      state.pot.phase = 'burnt';
      markBurn(state, 398, 230);
    }
  }
  if (state.pot.phase === 'cook' || state.pot.phase === 'ready') {
    state.pot.steam = (state.pot.steam || 0) + dt;
    if (state.pot.steam > 0.18) {
      state.pot.steam = 0;
      puffSteam(state, 398, 230);
    }
  }
  const grill = state.grill;
  if (grill.phase === 'cook' || grill.phase === 'flip' || grill.phase === 'finish') {
    grill.progress += dt / grillTime;
    grill.sizzle = (grill.sizzle || 0) + dt;
    if (grill.sizzle > 0.35) {
      grill.sizzle = 0;
      playSizzle();
    }
    if (grill.phase === 'cook' && grill.progress >= 0.48) grill.phase = 'flip';
    if (grill.phase === 'flip' && grill.progress >= 0.72) {
      grill.phase = 'burnt';
      grill.item = null;
      markBurn(state, 580, 240);
    }
    if (grill.phase === 'finish' && grill.progress >= 1) {
      grill.phase = 'done';
      grill.item.prep = 'grilled';
      pushFloater(state, 580, 230, 'GRILLED', '#ffd56a');
      playDing();
    }
  }
  if (state.plate) {
    state.passSteam = (state.passSteam || 0) + dt;
    if (state.passSteam > 0.22) {
      state.passSteam = 0;
      puffSteam(state, 640, 420);
    }
  }
}

export function useStation(state, id) {
  const station = stationById(id);
  if (!station) return;
  const held = state.chef.holding;
  if (station.kind === 'crate') {
    if (held) {
      pushFloater(state, state.chef.x, state.chef.y - 28, 'HANDS FULL', '#ffd56a');
      return;
    }
    state.chef.holding = freshItem(station.item);
    playThud();
    return;
  }
  if (station.kind === 'chop') {
    if (held && needsChop(held) && !state.chop.item) {
      state.chop.item = held;
      state.chop.progress = 0;
      state.chef.holding = null;
      playThud();
      return;
    }
    if (!held && state.chop.item && state.chop.item.prep === 'chopped') {
      state.chef.holding = state.chop.item;
      state.chop.item = null;
      state.chop.progress = 0;
      playThud();
      return;
    }
    if (!held && state.chop.item && state.chop.item.prep === 'raw') {
      pushFloater(state, state.chef.x, state.chef.y - 28, 'HOLD TO CHOP', '#ffd56a');
    }
    return;
  }
  if (station.kind === 'pot') {
    if (state.pot.phase === 'idle' || state.pot.phase === 'burnt') {
      state.pot.phase = 'cook';
      state.pot.progress = 0;
      playSizzle();
      return;
    }
    if (state.pot.phase === 'ready' && !held) {
      state.chef.holding = { item: 'broth', prep: 'ready' };
      state.pot.phase = 'idle';
      state.pot.progress = 0;
      playThud();
      return;
    }
    if (state.pot.phase === 'ready' && held) {
      pushFloater(state, 398, 220, 'HANDS FULL', '#ffd56a');
      return;
    }
    if (state.pot.phase === 'cook') pushFloater(state, 398, 220, 'SIMMERING', '#ffd56a');
    return;
  }
  if (station.kind === 'grill') {
    if (held && held.item === 'pork' && held.prep === 'raw' && state.grill.phase === 'empty') {
      state.grill.item = held;
      state.grill.phase = 'cook';
      state.grill.progress = 0;
      state.chef.holding = null;
      playSizzle();
      return;
    }
    if (state.grill.phase === 'flip') {
      state.grill.phase = 'finish';
      playSizzle();
      pushFloater(state, 580, 230, 'FLIPPED', '#fff6e4');
      return;
    }
    if (!held && state.grill.phase === 'done' && state.grill.item) {
      state.chef.holding = state.grill.item;
      state.grill.item = null;
      state.grill.phase = 'empty';
      state.grill.progress = 0;
      playThud();
      return;
    }
    if (state.grill.phase === 'burnt') {
      state.grill.phase = 'empty';
      state.grill.item = null;
      state.grill.progress = 0;
    }
    return;
  }
  if (station.kind === 'assembly') {
    if (held && held.kind === 'dish') {
      pushFloater(state, state.chef.x, state.chef.y - 28, 'TAKE IT TO THE PASS', '#ffd56a');
      return;
    }
    if (held) {
      if (addToAssembly(state, held)) state.chef.holding = null;
      return;
    }
    if (assemblyComplete(state)) {
      const plate = takeFinishedDish(state);
      if (plate) state.chef.holding = { kind: 'dish', plate };
    }
    return;
  }
  if (station.kind === 'pass') {
    if (held && held.kind === 'dish') {
      if (placePlateOnPass(state, held.plate)) state.chef.holding = null;
      return;
    }
    if (state.plate) tryServePlate(state);
    return;
  }
  if (station.kind === 'trash') {
    if (held) state.chef.holding = null;
    else if (state.assembly.recipeId) clearAssembly(state);
    else if (state.plate) state.plate = null;
    else if (state.chop.item) state.chop.item = null;
    playThud();
  }
}

export function dropDrag(state, item, station) {
  if (!station) return false;
  if (station.kind === 'chop' && needsChop(item) && !state.chop.item) {
    state.chop.item = { item: item.item, prep: 'raw' };
    state.chop.progress = 0;
    playThud();
    return true;
  }
  if (station.kind === 'grill' && item.item === 'pork' && state.grill.phase === 'empty') {
    state.grill.item = { item: 'pork', prep: 'raw' };
    state.grill.phase = 'cook';
    state.grill.progress = 0;
    playSizzle();
    return true;
  }
  if (station.kind === 'assembly') return addToAssembly(state, { item: item.item, prep: item.prep });
  if (station.kind === 'trash') {
    playThud();
    return true;
  }
  return false;
}
