// Keyboard and mouse. Held keys stay; taps and clicks clear at the end of the frame.

const KEY_LEFT = ['arrowleft', 'a'];
const KEY_RIGHT = ['arrowright', 'd'];
const KEY_UP = ['arrowup', 'w'];
const KEY_DOWN = ['arrowdown', 's'];

export function createInput(canvas) {
  const down = new Set();
  const input = {
    left: false, right: false, up: false, down: false, use: false,
    pressedInteract: false, pressedPause: false, pressedMute: false, pressedConfirm: false,
    clicked: false, clickX: 0, clickY: 0, mx: 0, my: 0, pointer: false,
    drag: null, dragEnded: null,
  };

  function localPos(event) {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    return { x: (event.clientX - rect.left) * sx, y: (event.clientY - rect.top) * sy };
  }

  function refreshHeld() {
    input.left = KEY_LEFT.some((k) => down.has(k));
    input.right = KEY_RIGHT.some((k) => down.has(k));
    input.up = KEY_UP.some((k) => down.has(k));
    input.down = KEY_DOWN.some((k) => down.has(k));
    input.use = down.has('e') || down.has(' ') || input.pointer;
  }

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault();
    if (down.has(key)) return;
    down.add(key);
    if (key === 'e' || key === ' ') input.pressedInteract = true;
    if (key === 'p') input.pressedPause = true;
    if (key === 'm') input.pressedMute = true;
    if (key === 'enter') input.pressedConfirm = true;
    refreshHeld();
  });

  window.addEventListener('keyup', (event) => {
    down.delete(event.key.toLowerCase());
    refreshHeld();
  });

  canvas.addEventListener('mousemove', (event) => {
    const p = localPos(event);
    input.mx = p.x;
    input.my = p.y;
  });

  canvas.addEventListener('mousedown', (event) => {
    const p = localPos(event);
    input.mx = p.x;
    input.my = p.y;
    input.pointer = true;
    input.drag = { x: p.x, y: p.y };
    refreshHeld();
  });

  window.addEventListener('mouseup', (event) => {
    const p = localPos(event);
    input.pointer = false;
    if (input.drag) {
      const moved = Math.hypot(p.x - input.drag.x, p.y - input.drag.y);
      if (moved < 8) {
        input.clicked = true;
        input.clickX = p.x;
        input.clickY = p.y;
      } else {
        input.dragEnded = { x: p.x, y: p.y, fromX: input.drag.x, fromY: input.drag.y };
      }
      input.drag = null;
    }
    refreshHeld();
  });

  input.endFrame = () => {
    input.pressedInteract = false;
    input.pressedPause = false;
    input.pressedMute = false;
    input.pressedConfirm = false;
    input.clicked = false;
    input.dragEnded = null;
  };

  return input;
}
