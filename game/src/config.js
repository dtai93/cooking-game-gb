// Tuning, palette, and the fixed 1024×640 frame. Every other module reads numbers from here.

export const W = 1024;
export const H = 640;
export const STEP = 1 / 60;

export const FONT = '"Trebuchet MS", "Segoe UI", sans-serif';
export const DISPLAY = 'Georgia, "Palatino Linotype", serif';

export const PAL = {
  night: '#160d28',
  night2: '#3a1d4e',
  wood: '#e0a15a',
  woodDark: '#8a4b24',
  tile: '#f0c27a',
  tile2: '#d4924a',
  lacquer: '#8d2430',
  lacquerDark: '#4c1018',
  gold: '#ffd56a',
  goldDeep: '#c9842a',
  cream: '#fff6e4',
  ink: '#2a140c',
  herb: '#3aaa45',
  lime: '#c6e84a',
  chili: '#e23b2f',
  beef: '#9a4034',
  broth: '#e8a04a',
  noodle: '#f6e2b0',
  pork: '#e8926a',
  shrimp: '#ff8d78',
  coffee: '#5c3418',
  milk: '#fff8ea',
  ice: '#d4f6ff',
  baguette: '#e8b45e',
  pickle: '#ef8a3c',
  paper: '#f7f1e6',
  teal: '#1f6f68',
  lantern: '#ff9a2e',
  glow: '#ffd27a',
  panel: 'rgba(28, 16, 10, 0.82)',
  panelEdge: '#e6b14a',
};

export const WALK = { x0: 110, y0: 196, x1: 760, y1: 530 };
export const REACH = 78;
export const CHEF_SPEED = 250;
export const COMBO_TIME = 9;
export const MAX_STRIKES = 3;

export const NIGHTS = [
  { name: 'Quiet Alley', length: 80, patience: 50, spawnEvery: 12, quota: 4, toSpawn: 6, maxTickets: 3, recipes: ['pho', 'coffee'], vip: 0 },
  { name: 'After Work', length: 86, patience: 42, spawnEvery: 10, quota: 5, toSpawn: 8, maxTickets: 3, recipes: ['pho', 'banhmi', 'coffee'], vip: 0.12 },
  { name: 'Weekend Glow', length: 90, patience: 36, spawnEvery: 8, quota: 6, toSpawn: 9, maxTickets: 4, recipes: ['pho', 'banhmi', 'goicuon', 'coffee'], vip: 0.18 },
  { name: 'Festival Rush', length: 92, patience: 30, spawnEvery: 6.5, quota: 7, toSpawn: 11, maxTickets: 5, recipes: ['pho', 'banhmi', 'goicuon', 'coffee'], vip: 0.3 },
  { name: 'Lantern Parade', length: 96, patience: 26, spawnEvery: 5.6, quota: 8, toSpawn: 12, maxTickets: 5, recipes: ['pho', 'banhmi', 'goicuon', 'coffee'], vip: 0.38 },
  { name: 'Full Moon Feast', length: 100, patience: 22, spawnEvery: 5, quota: 9, toSpawn: 14, maxTickets: 5, recipes: ['pho', 'banhmi', 'goicuon', 'coffee'], vip: 0.48 },
];

export const UPGRADES = [
  { id: 'knife', name: 'Keen Knife', blurb: 'Chop forty percent faster', cost: 45 },
  { id: 'pot', name: 'Second Pot', blurb: 'Broth finishes sooner and stays', cost: 60 },
  { id: 'cat', name: 'Helper Cat', blurb: 'Miso slows patience drain', cost: 80 },
  { id: 'jar', name: 'Tip Jar', blurb: 'Every tip pays thirty percent more', cost: 50 },
];

export function makeRng(seed) {
  let a = (seed >>> 0) || 1;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

export function formatClock(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? '0' : ''}${r}`;
}
