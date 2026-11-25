// Money, tips, rush combo, night stars, letter grade, and the feat checklist.

import { NIGHTS } from './config.js';
import { recipeById } from './recipes.js';

export function scoreServe(state, order) {
  const recipe = recipeById(order.recipeId);
  const patience = Math.max(0, Math.min(1, order.patience));
  let tip = Math.round(recipe.price * 0.5 * patience);
  tip += order.extras.length * 3;
  if (order.vip) tip += 6;
  const perfect = patience > 0.7;
  if (perfect) tip += 2;
  if (state.upgrades.jar) tip = Math.round(tip * 1.3);
  const rush = state.combo >= 2 ? state.combo * 2 : 0;
  return { price: recipe.price, tip, rush, total: recipe.price + tip + rush, perfect };
}

export function applyServe(state, order, payout) {
  state.money += payout.total;
  state.score += payout.total;
  state.tipsTotal += payout.tip;
  state.nightTips += payout.tip;
  state.served += 1;
  state.nightServed += 1;
  if (payout.perfect) {
    state.perfect += 1;
    state.feats.perfect = true;
  }
  if (order.vip) state.feats.vip = true;
  if (state.comboLeft > 0) state.combo += 1;
  else state.combo = 1;
  state.comboLeft = 9;
  if (state.combo > state.bestCombo) state.bestCombo = state.combo;
  if (state.bestCombo >= 5) state.feats.rush5 = true;
  if (state.tipsTotal >= 200) state.feats.tips = true;
}

export function breakCombo(state) {
  state.combo = 0;
  state.comboLeft = 0;
}

export function nightStars(state) {
  const quota = NIGHTS[state.nightIndex].quota;
  if (state.nightServed >= quota && state.nightStrikes === 0 && state.nightBurnt === 0) return 3;
  if (state.nightServed >= quota) return 2;
  if (state.nightServed >= Math.ceil(quota * 0.5)) return 1;
  return 0;
}

export function letterGrade(state) {
  const stars = state.stars.reduce((sum, n) => sum + n, 0);
  if (state.result === 'clear' && stars >= 16) return 'S';
  if (stars >= 13) return 'A';
  if (stars >= 10) return 'B';
  if (stars >= 7) return 'C';
  if (stars >= 4) return 'D';
  return 'E';
}

export function featList(state) {
  return [
    { id: 'perfect', name: 'A perfect plate', done: Boolean(state.feats.perfect) },
    { id: 'vip', name: 'Served a VIP pho', done: Boolean(state.feats.vip) },
    { id: 'rush5', name: 'Rush combo of five', done: Boolean(state.feats.rush5) },
    { id: 'tips', name: 'Two hundred in tips', done: Boolean(state.feats.tips) },
    { id: 'clean', name: 'A clean night, no burns', done: Boolean(state.feats.clean) },
    { id: 'cleared', name: 'Six nights on the lane', done: state.result === 'clear' },
  ];
}
