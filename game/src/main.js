// Boot, screens, and the fixed-step loop. ?shot= stages a scene and paints it.

import { STEP } from './config.js';
import { createInput } from './input.js';
import { createState, stepGame, applyScreenAction } from './game.js';
import { stageShot } from './shots.js';
import { drawKitchen } from './render-kitchen.js';
import { drawFood } from './render-food.js';
import { drawHud } from './render-hud.js';
import { drawTitleScreen, drawShopScreen, drawResultsScreen, drawPauseOverlay, screenClick } from './render-screens.js';
import { drawParticles } from './particles.js';

const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);

const canvas = document.getElementById('game');
const status = document.getElementById('status');
canvas.width = 1024;
canvas.height = 640;
const ctx = canvas.getContext('2d');

function fitCanvas() {
  const iw = window.innerWidth;
  const ih = window.innerHeight;
  if (!iw || !ih) return;
  const target = 1024 / 640;
  const close = Math.abs(iw / ih - target) < 0.02;
  const scale = close ? 1 : Math.min(iw / 1024, ih / 640);
  const w = close ? iw : Math.floor(1024 * scale);
  const h = close ? ih : Math.floor(640 * scale);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  canvas.style.position = 'absolute';
  canvas.style.left = `${Math.floor((iw - w) / 2)}px`;
  canvas.style.top = `${Math.floor((ih - h) / 2)}px`;
}

fitCanvas();
window.addEventListener('resize', fitCanvas);

function announce(text) {
  status.textContent = text;
}

function drawFrame(state) {
  try {
    drawFrameInner(state);
  } catch (error) {
    ctx.fillStyle = '#3a1020';
    ctx.fillRect(0, 0, 1024, 640);
    ctx.fillStyle = '#fff6e4';
    ctx.font = '16px sans-serif';
    ctx.fillText(String(error && error.stack || error), 24, 40);
  }
}

function drawFrameInner(state) {
  ctx.clearRect(0, 0, 1024, 640);
  if (state.screen === 'title') {
    drawTitleScreen(ctx, state);
    return;
  }
  if (state.screen === 'shop') {
    drawShopScreen(ctx, state);
    return;
  }
  if (state.screen === 'results') {
    drawResultsScreen(ctx, state);
    return;
  }
  drawKitchen(ctx, state);
  drawFood(ctx, state);
  drawHud(ctx, state);
  drawParticles(ctx, state);
  if (state.screen === 'pause') drawPauseOverlay(ctx);
}

function runShot(name) {
  const state = stageShot(name, seed);
  drawFrame(state);
  requestAnimationFrame(() => {
    drawFrame(state);
    window.__shotReady = true;
  });
  window.__shotReady = true;
  announce(`Lantern Lane scene ${name}.`);
}

function runGame() {
  const state = createState(seed);
  const input = createInput(canvas);
  let acc = 0;
  let last = performance.now();
  announce('Lantern Lane. Press Enter to open the stall.');

  function edges(withEdges) {
    if (withEdges) return input;
    return {
      ...input,
      pressedInteract: false,
      pressedPause: false,
      pressedMute: false,
      pressedConfirm: false,
      clicked: false,
      dragEnded: null,
    };
  }

  function frame(now) {
    const dt = Math.min(MAX_FRAME, (now - last) / 1000);
    last = now;
    acc += dt;
    let first = true;
    while (acc >= STEP) {
      stepGame(state, STEP, edges(first));
      first = false;
      acc -= STEP;
    }
    if (input.clicked && state.screen !== 'play') {
      applyScreenAction(state, screenClick(state, input.clickX, input.clickY));
    }
    drawFrame(state);
    input.endFrame();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if (shotName) runShot(shotName);
else runGame();
