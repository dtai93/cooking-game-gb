// Tickets on the order board: which plate they accept, and paying them out.

import { plateMatches, orderSteps, stepMet, orderTitle } from './recipes.js';
import { scoreServe, applyServe } from './scoring.js';
import { pushFloater, burstParticles } from './particles.js';
import { playCash, playDing } from './audio.js';

export function orderLabel(order) {
  return orderTitle(order);
}

export function ticketSteps(order) {
  return orderSteps(order);
}

export function ticketChecks(state, order) {
  const steps = orderSteps(order);
  return steps.map((step) => {
    const onAsm = state.assembly.recipeId === order.recipeId && stepMet(state.assembly.items, step);
    const onPlate = state.plate && state.plate.recipeId === order.recipeId && stepMet(state.plate.items, step);
    return { item: step.item, label: step.label, done: onAsm || onPlate };
  });
}

export function focusOrder(state) {
  if (!state.assembly.recipeId) return state.orders[0] || null;
  return state.orders.find((order) => order.recipeId === state.assembly.recipeId) || state.orders[0] || null;
}

export function tryServePlate(state) {
  if (!state.plate) {
    pushFloater(state, 640, 430, 'NO PLATE', '#ffd56a');
    return false;
  }
  const index = state.orders.findIndex((order) => plateMatches(state.plate, order));
  if (index < 0) {
    pushFloater(state, 640, 430, 'NO MATCH', '#ff8a78');
    return false;
  }
  const order = state.orders[index];
  const payout = scoreServe(state, order);
  applyServe(state, order, payout);
  state.orders.splice(index, 1);
  state.plate = null;
  pushFloater(state, 620, 400, `+$${payout.tip} TIP`, '#ffd56a');
  if (state.combo >= 3) pushFloater(state, 700, 360, `RUSH x${state.combo}!`, '#ff9a2e');
  burstParticles(state, 640, 450, '#ffd56a', 10, 'spark');
  playCash();
  playDing();
  return true;
}

export function placePlateOnPass(state, plate) {
  if (state.plate) {
    pushFloater(state, state.chef.x, state.chef.y - 28, 'WINDOW FULL', '#ffd56a');
    return false;
  }
  state.plate = plate;
  playDing();
  pushFloater(state, 640, 420, 'READY', '#fff6e4');
  return true;
}
