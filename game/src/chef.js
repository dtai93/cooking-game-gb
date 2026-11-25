// The cook: keyboard motion, click-to-walk, and a single held item.

import { WALK, CHEF_SPEED } from './config.js';
import { clamp } from './config.js';
import { stationById, distToStation, useStation } from './stations.js';

export function updateChef(state, dt, input) {
  const chef = state.chef;
  let dx = 0;
  let dy = 0;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  if (input.up) dy -= 1;
  if (input.down) dy += 1;
  if (dx || dy) {
    chef.dest = null;
    const mag = Math.hypot(dx, dy) || 1;
    chef.x += (dx / mag) * CHEF_SPEED * dt;
    chef.y += (dy / mag) * CHEF_SPEED * dt;
    if (Math.abs(dx) > 0.2) chef.facing = dx > 0 ? 1 : -1;
  } else if (chef.dest) {
    const ddx = chef.dest.x - chef.x;
    const ddy = chef.dest.y - chef.y;
    const dist = Math.hypot(ddx, ddy);
    if (dist < 8) {
      const sid = chef.dest.stationId;
      chef.dest = null;
      if (sid) {
        const station = stationById(sid);
        if (station && distToStation(chef, station) < 96) useStation(state, sid);
      }
    } else {
      chef.x += (ddx / dist) * CHEF_SPEED * dt;
      chef.y += (ddy / dist) * CHEF_SPEED * dt;
      if (Math.abs(ddx) > 4) chef.facing = ddx > 0 ? 1 : -1;
    }
  }
  chef.x = clamp(chef.x, WALK.x0, WALK.x1);
  chef.y = clamp(chef.y, WALK.y0, WALK.y1);
  chef.bob += dt * (dx || dy || chef.dest ? 10 : 3);
}

export function walkTargetFor(station) {
  return {
    x: clamp(station.x + station.w / 2, WALK.x0, WALK.x1),
    y: clamp(station.y + station.h * 0.82, WALK.y0, WALK.y1),
    stationId: station.id,
  };
}
