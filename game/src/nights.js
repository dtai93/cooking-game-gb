// Opening a night, closing it, and the objective line under the key bar.

import { NIGHTS } from './config.js';
import { spawnCustomer } from './customers.js';
import { nightStars } from './scoring.js';
import { recipeById } from './recipes.js';
import { assemblyRatio, assemblyComplete } from './plating.js';
import { focusOrder } from './orders.js';

export function nightDef(index) {
  return NIGHTS[index];
}

export function beginNight(state, index) {
  const night = NIGHTS[index];
  state.screen = 'play';
  state.result = null;
  state.nightIndex = index;
  state.nightTime = 0;
  state.nightLength = night.length;
  state.spawnLeft = night.toSpawn;
  state.spawnIn = 0.4;
  state.orders = [];
  state.nightServed = 0;
  state.nightTips = 0;
  state.nightBurnt = 0;
  state.nightStrikes = 0;
  state.combo = 0;
  state.comboLeft = 0;
  state.chop = { item: null, progress: 0, thwack: 0 };
  state.pot = { phase: 'idle', progress: 0, readyFor: 0, steam: 0 };
  state.grill = { item: null, progress: 0, phase: 'empty', sizzle: 0 };
  state.assembly = { recipeId: null, items: [] };
  state.plate = null;
  state.chef.x = 420;
  state.chef.y = 360;
  state.chef.holding = null;
  state.chef.dest = null;
  state.particles = [];
  state.floaters = [];
  state.passSteam = 0;
  spawnCustomer(state);
  state.spawnLeft -= 1;
  if (state.spawnLeft > 0) {
    spawnCustomer(state);
    state.spawnLeft -= 1;
  }
}

export function finishNight(state) {
  const stars = nightStars(state);
  state.stars[state.nightIndex] = Math.max(state.stars[state.nightIndex], stars);
  state.lastStars = stars;
  if (state.nightBurnt === 0 && state.nightServed >= NIGHTS[state.nightIndex].quota) state.feats.clean = true;
  if (state.nightIndex >= NIGHTS.length - 1) {
    state.screen = 'results';
    state.result = 'clear';
    state.feats.cleared = true;
    return;
  }
  state.unlockedThrough = Math.max(state.unlockedThrough, state.nightIndex + 1);
  state.screen = 'shop';
}

export function objectiveLine(state) {
  const night = NIGHTS[state.nightIndex];
  const quota = `${state.nightServed}/${night.quota} plates`;
  if (state.chop.item && state.chop.item.prep === 'raw') return `Hold E on the board. ${quota}. Keep the lantern burning.`;
  if (state.grill.phase === 'flip') return `Flip the pork — the gold window is open. ${quota}.`;
  if (state.pot.phase === 'ready') return `Ladle the broth before it burns. ${quota}.`;
  if (state.pot.phase === 'cook') return `Broth is simmering. Route the next ingredient. ${quota}.`;
  if (state.plate) return `Plate is READY at the pass. Serve the matching ticket. ${quota}.`;
  if (state.assembly.recipeId && !assemblyComplete(state)) {
    const order = focusOrder(state);
    const ratio = assemblyRatio(state, order);
    const recipe = recipeById(state.assembly.recipeId);
    return `${recipe.name} ${ratio.have}/${ratio.need} on the counter. ${quota}.`;
  }
  if (state.orders[0]) {
    const recipe = recipeById(state.orders[0].recipeId);
    return `Next ticket: ${recipe.name}. Plan the route. ${quota}.`;
  }
  return `Watch the window. ${quota}.`;
}
