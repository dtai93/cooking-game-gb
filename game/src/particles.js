// Short-lived bits: herb confetti, steam, sparks, and floating combat-text style pops.

export function burstParticles(state, x, y, color, count, kind) {
  const rng = state.rng;
  for (let i = 0; i < count; i += 1) {
    state.particles.push({
      x: x + (rng() - 0.5) * 16,
      y: y + (rng() - 0.5) * 10,
      vx: (rng() - 0.5) * 90,
      vy: -30 - rng() * 70,
      life: 0.35 + rng() * 0.45,
      age: 0,
      color,
      kind: kind || 'spark',
      size: 2.5 + rng() * 3.5,
    });
  }
}

export function pushFloater(state, x, y, text, color) {
  state.floaters.push({
    x, y, text, color: color || '#fff6e4', age: 0, life: 1.7,
  });
}

export function puffSteam(state, x, y) {
  state.particles.push({
    x: x + (state.rng() - 0.5) * 14,
    y,
    vx: (state.rng() - 0.5) * 10,
    vy: -18 - state.rng() * 14,
    life: 0.8 + state.rng() * 0.4,
    age: 0,
    color: 'rgba(255,248,236,0.85)',
    kind: 'steam',
    size: 5 + state.rng() * 6,
  });
}

export function updateParticles(state, dt) {
  const next = [];
  for (let i = 0; i < state.particles.length; i += 1) {
    const p = state.particles[i];
    p.age += dt;
    if (p.age >= p.life) continue;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.kind !== 'steam') p.vy += 40 * dt;
    next.push(p);
  }
  state.particles = next;
  const texts = [];
  for (let i = 0; i < state.floaters.length; i += 1) {
    const f = state.floaters[i];
    f.age += dt;
    if (f.age >= f.life) continue;
    f.y -= 18 * dt;
    texts.push(f);
  }
  state.floaters = texts;
}

export function drawParticles(ctx, state) {
  for (let i = 0; i < state.particles.length; i += 1) {
    const p = state.particles[i];
    const t = p.age / p.life;
    ctx.globalAlpha = 1 - t;
    ctx.fillStyle = p.color;
    if (p.kind === 'steam') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.6 + t), 0, Math.PI * 2);
      ctx.fill();
    } else if (p.kind === 'herb') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(t * 4);
      ctx.fillRect(-p.size, -p.size * 0.4, p.size * 2, p.size * 0.8);
      ctx.restore();
    } else {
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }
  ctx.save();
  ctx.font = 'bold 18px "Trebuchet MS", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.lineWidth = 4;
  for (let i = 0; i < state.floaters.length; i += 1) {
    const f = state.floaters[i];
    const a = 1 - f.age / f.life;
    ctx.globalAlpha = a;
    ctx.strokeStyle = '#2a140c';
    ctx.strokeText(f.text, f.x, f.y);
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, f.x, f.y);
  }
  ctx.restore();
}
