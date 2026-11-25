// Dishes the stall serves. The first item placed on the counter chooses the recipe.

import { INGREDIENTS } from './ingredients.js';

export const RECIPES = {
  pho: {
    id: 'pho',
    name: 'Pho Bowl',
    short: 'Pho',
    price: 18,
    color: '#e8a04a',
    steps: [
      { item: 'noodles', label: 'Noodles' },
      { item: 'broth', label: 'Broth' },
      { item: 'beef', label: 'Beef' },
      { item: 'herbs', label: 'Herbs' },
    ],
    extras: [
      { item: 'lime', label: 'Lime' },
      { item: 'chili', label: 'Chili' },
    ],
  },
  banhmi: {
    id: 'banhmi',
    name: 'Banh Mi',
    short: 'Banh Mi',
    price: 16,
    color: '#e8b45e',
    steps: [
      { item: 'baguette', label: 'Baguette' },
      { item: 'pork', label: 'Pork' },
      { item: 'pickle', label: 'Pickle' },
      { item: 'herbs', label: 'Herbs' },
      { item: 'chili', label: 'Chili' },
    ],
    extras: [],
  },
  goicuon: {
    id: 'goicuon',
    name: 'Goi Cuon',
    short: 'Goi Cuon',
    price: 14,
    color: '#7dcea0',
    steps: [
      { item: 'ricepaper', label: 'Paper' },
      { item: 'shrimp', label: 'Shrimp' },
      { item: 'herbs', label: 'Herbs' },
      { item: 'noodles', label: 'Noodles' },
    ],
    extras: [],
  },
  coffee: {
    id: 'coffee',
    name: 'Iced Coffee',
    short: 'Ca Phe',
    price: 12,
    color: '#c4a574',
    steps: [
      { item: 'coffee', label: 'Coffee' },
      { item: 'milk', label: 'Milk' },
      { item: 'ice', label: 'Ice' },
    ],
    extras: [],
  },
};

const STARTERS = { noodles: 'pho', baguette: 'banhmi', ricepaper: 'goicuon', coffee: 'coffee' };

export function recipeById(id) {
  return RECIPES[id] || null;
}

export function starterRecipe(itemId) {
  return STARTERS[itemId] || null;
}

export function recipeList() {
  return [RECIPES.pho, RECIPES.banhmi, RECIPES.goicuon, RECIPES.coffee];
}

/** Steps a ticket actually demands, extras included when the order asked for them. */
export function orderSteps(order) {
  const recipe = RECIPES[order.recipeId];
  if (!recipe) return [];
  const steps = recipe.steps.slice();
  for (let i = 0; i < recipe.extras.length; i += 1) {
    const extra = recipe.extras[i];
    if (order.extras.includes(extra.item)) steps.push(extra);
  }
  return steps;
}

export function stepMet(items, step) {
  const spec = INGREDIENTS[step.item];
  return items.some((it) => it.item === step.item && it.prep === spec.prep);
}

export function plateMatches(plate, order) {
  if (!plate || plate.recipeId !== order.recipeId) return false;
  const steps = orderSteps(order);
  for (let i = 0; i < steps.length; i += 1) {
    if (!stepMet(plate.items, steps[i])) return false;
  }
  return true;
}

export function orderTitle(order) {
  const recipe = RECIPES[order.recipeId];
  if (!recipe) return 'Order';
  if (!order.extras.length) return recipe.short;
  if (order.vip) return `${recipe.short} VIP`;
  return `${recipe.short} +${order.extras.join('+')}`;
}
