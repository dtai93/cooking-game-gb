// Deterministic scenes. Each one builds a legal stall state, then steps the real rules.

import { createState, stepGame } from './game.js';
import { pushFloater, burstParticles, puffSteam } from './particles.js';

function idleInput(use) {
  return {
    left: false, right: false, up: false, down: false, use: Boolean(use),
    pressedInteract: false, pressedPause: false, pressedMute: false, pressedConfirm: false,
    clicked: false, drag: null, dragEnded: null, mx: 0, my: 0, pointer: false,
  };
}

function run(state, frames, use) {
  const input = idleInput(use);
  for (let i = 0; i < frames; i += 1) stepGame(state, 1 / 60, input);
}

function makeOrder(state, recipeId, extras, name, patience) {
  const order = {
    id: state.nextOrderId,
    recipeId,
    extras,
    vip: extras.length > 1,
    patience,
    maxTime: 30,
    name,
    born: 0,
  };
  state.nextOrderId += 1;
  state.orders.push(order);
  return order;
}

function stageService(state) {
  state.screen = 'play';
  state.nightIndex = 3;
  state.nightLength = 92;
  state.nightTime = 20;
  state.money = 186;
  state.score = 428;
  state.tipsTotal = 96;
  state.nightTips = 64;
  state.combo = 3;
  state.comboLeft = 6;
  state.bestCombo = 3;
  state.served = 11;
  state.nightServed = 4;
  state.perfect = 3;
  state.upgrades.knife = true;
  state.upgrades.cat = true;
  state.spawnLeft = 4;
  state.spawnIn = 40;
  state.chef.x = 230;
  state.chef.y = 300;
  state.chef.facing = 1;
  state.chop.item = { item: 'herbs', prep: 'raw' };
  state.chop.progress = 0.58;
  state.pot.phase = 'cook';
  state.pot.progress = 0.64;
  state.grill.phase = 'cook';
  state.grill.progress = 0.28;
  state.grill.item = { item: 'pork', prep: 'raw' };
  state.assembly = {
    recipeId: 'pho',
    items: [
      { item: 'noodles', prep: 'raw' },
      { item: 'broth', prep: 'ready' },
      { item: 'beef', prep: 'raw' },
    ],
  };
  state.plate = {
    recipeId: 'banhmi',
    extras: [],
    items: [
      { item: 'baguette', prep: 'raw' },
      { item: 'pork', prep: 'grilled' },
      { item: 'pickle', prep: 'chopped' },
      { item: 'herbs', prep: 'chopped' },
      { item: 'chili', prep: 'chopped' },
    ],
  };
  makeOrder(state, 'pho', ['lime'], 'Hoa', 0.74);
  makeOrder(state, 'banhmi', [], 'Minh', 0.58);
  makeOrder(state, 'coffee', [], 'Lan', 0.42);
  makeOrder(state, 'goicuon', [], 'Bao', 0.86);
  makeOrder(state, 'pho', ['lime', 'chili'], 'Kim', 0.36);
  state.nearId = 'chop';
  run(state, 20, false);
  state.chop.item = { item: 'herbs', prep: 'raw' };
  state.chop.progress = 0.58;
  state.pot.phase = 'cook';
  state.pot.progress = 0.64;
  state.grill.phase = 'cook';
  state.grill.progress = 0.28;
  state.grill.item = { item: 'pork', prep: 'raw' };
  state.nightTime = 20;
  state.combo = 3;
  state.comboLeft = 6;
  state.orders[0].patience = 0.74;
  state.orders[1].patience = 0.58;
  state.orders[2].patience = 0.42;
  state.orders[3].patience = 0.86;
  state.orders[4].patience = 0.36;
  state.floaters = [];
  state.particles = [];
  pushFloater(state, 620, 352, '+$12 TIP', '#ffd56a');
  pushFloater(state, 710, 318, 'RUSH x3!', '#ff9a2e');
  burstParticles(state, 210, 268, '#3aaa45', 9, 'herb');
  puffSteam(state, 398, 230);
  puffSteam(state, 600, 400);
  state.nearId = 'chop';
}

function stageShop(state) {
  state.screen = 'shop';
  state.nightIndex = 2;
  state.lastStars = 3;
  state.stars = [3, 2, 3, 0, 0, 0];
  state.money = 132;
  state.nightTips = 54;
  state.tipsTotal = 88;
  state.score = 310;
  state.served = 14;
  state.upgrades.knife = true;
  state.unlockedThrough = 3;
}

function stageResults(state) {
  state.screen = 'results';
  state.result = 'clear';
  state.nightIndex = 5;
  state.stars = [3, 3, 3, 2, 3, 3];
  state.money = 640;
  state.score = 1284;
  state.tipsTotal = 246;
  state.served = 48;
  state.perfect = 17;
  state.bestCombo = 6;
  state.burnt = 2;
  state.feats = { perfect: true, vip: true, rush5: true, tips: true, clean: true, cleared: true };
  state.upgrades = { knife: true, pot: true, cat: true, jar: true };
}

export function stageShot(name, seed) {
  const state = createState(seed);
  if (name === 'service') stageService(state);
  else if (name === 'shop') stageShop(state);
  else if (name === 'results') stageResults(state);
  else {
    state.screen = 'title';
    state.unlockedThrough = 5;
    state.selectedNight = 0;
    state.money = 30;
  }
  return state;
}
