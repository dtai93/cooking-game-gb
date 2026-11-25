// The assembly counter: a dish builds one ingredient at a time, then leaves as a plate.

import { INGREDIENTS, needsChop, needsGrill, prepReady } from './ingredients.js';
import { recipeById, starterRecipe, orderSteps, stepMet } from './recipes.js';
import { pushFloater } from './particles.js';
import { playThud, playDing } from './audio.js';

export function emptyAssembly() {
  return { recipeId: null, items: [] };
}

export function addToAssembly(state, item) {
  const assembly = state.assembly;
  if (!assembly.recipeId) {
    const id = starterRecipe(item.item);
    if (!id) {
      pushFloater(state, state.chef.x, state.chef.y - 28, 'START WITH A BASE', '#ffd56a');
      return false;
    }
    if (!prepReady(item)) {
      pushFloater(state, state.chef.x, state.chef.y - 28, needsChop(item) ? 'CHOP FIRST' : 'NOT READY', '#ff9a6a');
      return false;
    }
    assembly.recipeId = id;
    assembly.items = [{ item: item.item, prep: item.prep }];
    playThud();
    return true;
  }
  const recipe = recipeById(assembly.recipeId);
  const wanted = recipe.steps.concat(recipe.extras).find((step) => step.item === item.item);
  if (!wanted) {
    pushFloater(state, state.chef.x, state.chef.y - 28, 'WRONG INGREDIENT', '#ff8a78');
    return false;
  }
  if (assembly.items.some((it) => it.item === item.item)) {
    pushFloater(state, state.chef.x, state.chef.y - 28, 'ALREADY IN', '#ffd56a');
    return false;
  }
  if (needsChop(item)) {
    pushFloater(state, state.chef.x, state.chef.y - 28, 'CHOP FIRST', '#ff9a6a');
    return false;
  }
  if (needsGrill(item) || (INGREDIENTS[item.item].prep === 'grilled' && item.prep !== 'grilled')) {
    pushFloater(state, state.chef.x, state.chef.y - 28, 'GRILL IT', '#ff9a6a');
    return false;
  }
  if (!prepReady(item)) {
    pushFloater(state, state.chef.x, state.chef.y - 28, 'NOT READY', '#ff9a6a');
    return false;
  }
  assembly.items.push({ item: item.item, prep: item.prep });
  playThud();
  if (assemblyComplete(state)) playDing();
  return true;
}

export function assemblyComplete(state) {
  const recipe = recipeById(state.assembly.recipeId);
  if (!recipe) return false;
  return recipe.steps.every((step) => stepMet(state.assembly.items, step));
}

export function assemblyRatio(state, order) {
  const recipe = recipeById(state.assembly.recipeId);
  if (!recipe) return { have: 0, need: 0 };
  const steps = order && order.recipeId === recipe.id ? orderSteps(order) : recipe.steps;
  const have = steps.filter((step) => stepMet(state.assembly.items, step)).length;
  return { have, need: steps.length };
}

export function takeFinishedDish(state) {
  if (!assemblyComplete(state)) {
    pushFloater(state, state.chef.x, state.chef.y - 28, 'STILL BUILDING', '#ffd56a');
    return null;
  }
  const recipe = recipeById(state.assembly.recipeId);
  const extras = recipe.extras.filter((step) => stepMet(state.assembly.items, step)).map((step) => step.item);
  const plate = { recipeId: recipe.id, items: state.assembly.items.slice(), extras };
  state.assembly = emptyAssembly();
  playDing();
  return plate;
}

export function clearAssembly(state) {
  state.assembly = emptyAssembly();
}
