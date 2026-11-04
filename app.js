(() => {
  'use strict';
  const board = document.getElementById('board');
  const pieces = [...document.querySelectorAll('.piece')];
  const KEY = 'magical-party-tablero-posiciones-v1';
  const defaults = {
    '1': [8, 91], '2': [15, 91], '3': [22, 91], '4': [29, 91],
    '5': [36, 91], '6': [43, 91], '7': [50, 91], '8': [57, 91],
    'crown': [65, 91]
  };
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (_) {}
  const positions = { ...defaults };
  for (const id of Object.keys(defaults)) {
    if (Array.isArray(saved[id]) && saved[id].length === 2 && saved[id].every(Number.isFinite)) {
      positions[id] = saved[id].map(n => Math.max(2, Math.min(98, n)));
    }
  }
  function place(piece) {
    const [x, y] = positions[piece.dataset.id];
    piece.style.left = x + '%';
    piece.style.top = y + '%';
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(positions)); } catch (_) {}
  }
  pieces.forEach(piece => {
    place(piece);
    let active = null;
    piece.addEventListener('pointerdown', e => {
      if (active !== null) return;
      e.preventDefault();
      active = e.pointerId;
      piece.setPointerCapture(active);
      piece.classList.add('dragging');
    });
    piece.addEventListener('pointermove', e => {
      if (e.pointerId !== active) return;
      const r = board.getBoundingClientRect();
      positions[piece.dataset.id] = [
        Math.max(2, Math.min(98, (e.clientX - r.left) / r.width * 100)),
        Math.max(2, Math.min(98, (e.clientY - r.top) / r.height * 100))
      ];
      place(piece);
    });
    function end(e) {
      if (e.pointerId !== active) return;
      active = null;
      piece.classList.remove('dragging');
      if (piece.hasPointerCapture(e.pointerId)) piece.releasePointerCapture(e.pointerId);
      save();
    }
    piece.addEventListener('pointerup', end);
    piece.addEventListener('pointercancel', end);
  });
})();
