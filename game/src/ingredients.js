// Ingredient crates: what they are, how they must be prepped, and the colour used to draw them.

export const INGREDIENTS = {
  noodles: { id: 'noodles', name: 'Noodles', short: 'NOODLES', prep: 'raw', color: '#f6e2b0' },
  beef: { id: 'beef', name: 'Beef', short: 'BEEF', prep: 'raw', color: '#9a4034' },
  herbs: { id: 'herbs', name: 'Herbs', short: 'HERBS', prep: 'chopped', color: '#3aaa45', chop: true },
  lime: { id: 'lime', name: 'Lime', short: 'LIME', prep: 'chopped', color: '#c6e84a', chop: true },
  chili: { id: 'chili', name: 'Chili', short: 'CHILI', prep: 'chopped', color: '#e23b2f', chop: true },
  baguette: { id: 'baguette', name: 'Baguette', short: 'BAGUETTE', prep: 'raw', color: '#e8b45e' },
  pork: { id: 'pork', name: 'Pork', short: 'PORK', prep: 'grilled', color: '#e8926a', grill: true },
  pickle: { id: 'pickle', name: 'Pickle', short: 'PICKLE', prep: 'chopped', color: '#ef8a3c', chop: true },
  ricepaper: { id: 'ricepaper', name: 'Rice Paper', short: 'PAPER', prep: 'raw', color: '#f7f1e6' },
  shrimp: { id: 'shrimp', name: 'Shrimp', short: 'SHRIMP', prep: 'raw', color: '#ff8d78' },
  coffee: { id: 'coffee', name: 'Coffee', short: 'COFFEE', prep: 'raw', color: '#5c3418' },
  milk: { id: 'milk', name: 'Milk', short: 'MILK', prep: 'raw', color: '#fff8ea' },
  ice: { id: 'ice', name: 'Ice', short: 'ICE', prep: 'raw', color: '#d4f6ff' },
  broth: { id: 'broth', name: 'Broth', short: 'BROTH', prep: 'ready', color: '#e8a04a' },
};

export function ingredientById(id) {
  return INGREDIENTS[id] || null;
}

export function needsChop(item) {
  const spec = INGREDIENTS[item?.item];
  return Boolean(spec?.chop && item.prep === 'raw');
}

export function needsGrill(item) {
  const spec = INGREDIENTS[item?.item];
  return Boolean(spec?.grill && item.prep === 'raw');
}

export function prepReady(item) {
  const spec = INGREDIENTS[item?.item];
  if (!spec) return false;
  return item.prep === spec.prep;
}

export function freshItem(id) {
  return { item: id, prep: 'raw' };
}
