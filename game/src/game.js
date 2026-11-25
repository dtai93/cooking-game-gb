// Live stall state and one fixed step of the service loop.

import { makeRng, WALK, REACH, NIGHTS, clamp } from './config.js';
import { freshItem } from './ingredients.js';
import { updateChef, walkTargetFor } from './chef.js';
import { updateStations, useStation, nearestStation, stationAtPoint, distToStation, dropDrag } from './stations.js';
import { updateCustomers, spawnCustomer } from './customers.js';
import { updateParticles } from './particles.js';
import { beginNight, finishNight } from './nights.js';
import { armAudio, setMuted, updateTune } from './audio.js';
import { buyUpgrade } from './shop.js';

export function createState(seed) {
  return {
    seed,
    rng: makeRng(seed),
    screen: 'title',
    result: null,
    nightIndex: 0,
    nightTime: 0,
    nightLength: NIGHTS[0].length,
    time: 0,
    money: 30,
    score: 0,
    tipsTotal: 0,
    nightTips: 0,
    combo: 0,
    comboLeft: 0,
    bestCombo: 0,
    served: 0,
    perfect: 0,
    burnt: 0,
    nightServed: 0,
    nightBurnt: 0,
    strikes: 0,
    nightStrikes: 0,
    stars: [0, 0, 0, 0, 0, 0],
    upgrades: { knife: false, pot: false, cat: false, jar: false },
    feats: {},
    selectedNight: 0,
    unlockedThrough: 0,
    spawnLeft: 0,
    spawnIn: 0,
    orders: [],
    nextOrderId: 1,
    chef: { x: 420, y: 360, facing: 1, holding: null, dest: null, bob: 0 },
    chop: { item: null, progress: 0, thwack: 0 },
    pot: { phase: 'idle', progress: 0, readyFor: 0, steam: 0 },
    grill: { item: null, progress: 0, phase: 'empty', sizzle: 0 },
    assembly: { recipeId: null, items: [] },
    plate: null,
    particles: [],
    floaters: [],
    passSteam: 0,
    muted: false,
    lastStars: 0,
    dragItem: null,
    nearId: null,
  };
}

export function resetRun(state) {
  const next = createState(state.seed);
  const keys = Object.keys(next);
  for (let i = 0; i < keys.length; i += 1) state[keys[i]] = next[keys[i]];
}

export function applyScreenAction(state, action) {
  if (!action) return;
  if (action.type === 'play') beginNight(state, state.selectedNight);
  if (action.type === 'night' && action.index <= state.unlockedThrough) state.selectedNight = action.index;
  if (action.type === 'buy') buyUpgrade(state, action.id);
  if (action.type === 'continue') beginNight(state, state.nightIndex + 1);
  if (action.type === 'again') resetRun(state);
}

function playClick(state, x, y) {
  if (y < 116 || y > 558 || x > 780) return;
  const station = stationAtPoint(x, y);
  if (station && distToStation(state.chef, station) < REACH + 6) {
    useStation(state, station.id);
    return;
  }
  if (station) state.chef.dest = walkTargetFor(station);
  else state.chef.dest = { x: clamp(x, WALK.x0, WALK.x1), y: clamp(y, WALK.y0, WALK.y1), stationId: null };
}

export function stepGame(state, dt, input) {
  state.time += dt;
  if (input.pressedMute) {
    state.muted = !state.muted;
    setMuted(state.muted);
  }
  const played = input.pressedInteract || input.pressedConfirm || input.pressedPause
    || input.clicked || input.left || input.right || input.up || input.down || input.use;
  if (played) armAudio();
  if (!state.muted) updateTune(dt);
  if (state.screen === 'title' && (input.pressedConfirm || input.pressedInteract)) {
    beginNight(state, state.selectedNight);
    return;
  }
  if (state.screen === 'shop' && input.pressedConfirm) {
    beginNight(state, state.nightIndex + 1);
    return;
  }
  if (state.screen === 'results' && (input.pressedConfirm || input.pressedInteract)) {
    resetRun(state);
    return;
  }
  if (state.screen === 'pause') {
    if (input.pressedPause || input.pressedConfirm) state.screen = 'play';
    return;
  }
  if (state.screen !== 'play') return;
  if (input.pressedPause) {
    state.screen = 'pause';
    return;
  }
  state.pointer = { x: input.mx || 0, y: input.my || 0 };
  updateChef(state, dt, input);
  const near = nearestStation(state.chef);
  state.nearId = near ? near.id : null;
  if (input.pressedInteract && near) useStation(state, near.id);
  if (input.clicked) {
    state.dragItem = null;
    playClick(state, input.clickX, input.clickY);
  } else if (input.drag && !state.dragItem) {
    const from = stationAtPoint(input.drag.x, input.drag.y);
    if (from && from.kind === 'crate') state.dragItem = freshItem(from.item);
  }
  if (input.dragEnded && state.dragItem) {
    dropDrag(state, state.dragItem, stationAtPoint(input.dragEnded.x, input.dragEnded.y));
    state.dragItem = null;
  }
  if (state.screen !== 'play') return;
  updateStations(state, dt, input.use);
  updateCustomers(state, dt);
  if (state.screen !== 'play') return;
  const night = NIGHTS[state.nightIndex];
  state.spawnIn -= dt;
  if (state.spawnIn <= 0 && state.spawnLeft > 0) {
    if (spawnCustomer(state)) state.spawnLeft -= 1;
    state.spawnIn = night.spawnEvery;
  }
  if (state.comboLeft > 0) {
    state.comboLeft -= dt;
    if (state.comboLeft <= 0) {
      state.comboLeft = 0;
      state.combo = 0;
    }
  }
  state.nightTime += dt;
  updateParticles(state, dt);
  if (state.nightTime >= state.nightLength) finishNight(state);
}
