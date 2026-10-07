/* Pixel Rounds — 32x32 pixel doctor renderer.
 * Draws onto a 32x32 canvas; CSS scales it up with image-rendering: pixelated. */
(function () {
  'use strict';
  const PR = (window.PR = window.PR || {});

  PR.SKINS = ['#f7d9bb', '#ebbc92', '#cf9363', '#a56b43', '#734829', '#4b2d1b'];
  PR.HAIR_COLORS = ['#2a1f17', '#6b4226', '#d9b25f', '#b14a2b', '#b9b7c6', '#e9e5f2'];
  PR.HAIR_STYLES = [
    { id: 'short', name: 'Short' }, { id: 'long', name: 'Long' }, { id: 'bun', name: 'Bun' },
    { id: 'curly', name: 'Curly' }, { id: 'buzz', name: 'Buzz' }, { id: 'bald', name: 'Bald' }
  ];

  const SCRUBS = {
    ceil: '#86b4dd', navy: '#2e477a', burgundy: '#7c2b3d', hunter: '#2d6a4a',
    black: '#2b2a33', galaxy: '#4f348c', gold: '#d6a530'
  };

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const c = (v) => Math.max(0, Math.min(255, v + amt));
    const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  PR.shade = shade;

  // ---------- Backdrops ----------
  const BG = {
    hall(p) {
      p(0, 0, 32, 32, '#cfe5dc');
      p(0, 13, 32, 2, '#86c3b2');
      p(2, 5, 6, 17, '#e8f2ee'); p(2, 5, 6, 1, '#9fb8b0'); p(2, 5, 1, 17, '#9fb8b0'); p(7, 5, 1, 17, '#9fb8b0');
      p(6, 13, 1, 2, '#6c7e78');
      p(25, 3, 5, 3, '#ec5464'); p(27, 3, 1, 3, '#ffffff'); p(26, 4, 3, 1, '#ffffff');
      p(0, 22, 32, 10, '#aaa6bf'); p(0, 26, 32, 1, '#9692ad'); p(0, 23, 32, 1, '#5fd1c4');
    },
    library(p) {
      p(0, 0, 32, 32, '#4a3328');
      const cols = ['#c0504d', '#4f81bd', '#9bbb59', '#e3c16f', '#8064a2', '#f79646', '#d8d4c4'];
      [2, 10, 18].forEach((y, row) => {
        let x = 0, k = row * 3;
        while (x < 32) {
          const w = 1 + ((k * 7) % 2), h = 6 - (k % 3 === 0 ? 1 : 0);
          p(x, y + (6 - h), w, h, cols[k % cols.length]);
          x += w + (k % 5 === 0 ? 1 : 0); k++;
        }
        p(0, y + 6, 32, 1, '#2d1e17');
      });
      p(0, 26, 32, 6, '#3a281f');
    },
    or(p) {
      p(0, 0, 32, 32, '#2c5c58');
      p(0, 0, 32, 1, '#1f4542');
      p(9, 1, 14, 3, '#cfd6cf'); p(11, 2, 10, 1, '#fffbe0'); p(15, 0, 2, 1, '#8aa39f');
      p(0, 18, 32, 1, '#3d7a75');
      p(0, 24, 32, 8, '#24484b'); p(0, 28, 32, 1, '#1f3f42');
      p(1, 8, 4, 5, '#1b1b24'); p(2, 9, 2, 2, '#78d98c'); p(2, 11, 2, 1, '#ec5464');
    },
    night(p) {
      p(0, 0, 32, 32, '#161433');
      [[3, 3], [9, 6], [5, 12], [28, 10], [20, 2], [13, 1], [29, 17], [2, 19]].forEach(([x, y]) => p(x, y, 1, 1, '#f3ead3'));
      p(24, 3, 4, 4, '#f3ead3'); p(26, 3, 2, 2, '#161433'); p(27, 5, 1, 1, '#161433');
      p(0, 24, 32, 8, '#232046'); p(0, 24, 32, 1, '#3a3668');
    },
    beach(p) {
      p(0, 0, 32, 32, '#8fd3f5');
      p(3, 3, 4, 4, '#ffcd57'); p(2, 4, 6, 2, '#ffcd57'); p(4, 2, 2, 6, '#ffcd57');
      p(20, 4, 6, 1, '#ffffff'); p(18, 5, 10, 1, '#ffffff');
      p(0, 17, 32, 5, '#3a8fd1'); p(0, 17, 32, 1, '#a6e1f7'); p(5, 19, 3, 1, '#a6e1f7'); p(22, 20, 4, 1, '#a6e1f7');
      p(0, 22, 32, 10, '#f2d38a'); p(0, 22, 32, 1, '#fff1c4'); p(27, 27, 2, 1, '#d8b366'); p(4, 29, 2, 1, '#d8b366');
    },
    match(p) {
      p(0, 0, 32, 32, '#3b2363');
      const conf = ['#ffcd57', '#ff7a93', '#5fd1c4', '#5aa9ff', '#78d98c'];
      [[2, 2], [6, 7], [3, 14], [27, 3], [29, 9], [24, 15], [12, 1], [19, 2], [28, 20], [1, 21], [8, 18], [23, 8]].forEach(([x, y], i) => {
        p(x, y, 1 + (i % 2), 1 + ((i + 1) % 2), conf[i % conf.length]);
      });
      p(0, 26, 32, 6, '#2a1849'); p(0, 26, 32, 1, '#ffcd57');
    }
  };

  // ---------- Hair (top layer) ----------
  const HAIR = {
    short(p, c) { p(11, 5, 10, 2, c); p(10, 6, 1, 3, c); p(21, 6, 1, 3, c); p(11, 7, 4, 1, c); p(19, 7, 2, 1, c); },
    long(p, c) { p(11, 5, 10, 2, c); p(10, 6, 1, 4, c); p(21, 6, 1, 4, c); p(11, 7, 3, 1, c); p(18, 7, 3, 1, c); },
    bun(p, c) { HAIR.short(p, c); p(14, 2, 4, 3, c); p(15, 1, 2, 1, c); },
    curly(p, c) {
      p(10, 4, 12, 4, c); p(9, 5, 1, 4, c); p(22, 5, 1, 4, c);
      p(11, 3, 2, 1, c); p(15, 3, 2, 1, c); p(19, 3, 2, 1, c);
      p(11, 8, 2, 1, c); p(14, 8, 1, 1, c); p(17, 8, 2, 1, c); p(20, 8, 1, 1, c);
      p(12, 5, 1, 1, shade(c, 30)); p(17, 4, 1, 1, shade(c, 30));
    },
    buzz(p, c) { p(11, 5, 10, 2, shade(c, 20)); p(10, 6, 1, 2, shade(c, 20)); p(21, 6, 1, 2, shade(c, 20)); },
    bald(p, c, skin) { p(17, 7, 2, 1, shade(skin, 25)); }
  };

  // ---------- Headwear ----------
  function cap(p, base, light) {
    p(11, 4, 10, 1, base); p(10, 5, 12, 3, base); p(13, 4, 5, 1, light);
    p(22, 6, 2, 1, base); p(23, 7, 1, 2, base);
  }
  const HEAD = {
    cap_ceil(p) { cap(p, '#86b4dd', '#a9cdea'); },
    cap_floral(p) {
      cap(p, '#ff9fb4', '#ffc4d1');
      [[11, 6], [14, 5], [17, 7], [20, 5], [12, 4]].forEach(([x, y], i) => p(x, y, 1, 1, i % 2 ? '#ffcd57' : '#ffffff'));
    },
    bouffant(p) {
      p(11, 2, 10, 1, '#a9d8ee'); p(9, 3, 14, 5, '#a9d8ee'); p(10, 8, 12, 1, '#7fbcd8');
      p(12, 4, 1, 2, '#7fbcd8'); p(16, 3, 1, 2, '#7fbcd8'); p(20, 5, 1, 2, '#7fbcd8');
    },
    headlamp(p) {
      p(10, 7, 12, 1, '#3a3550');
      p(14, 4, 4, 3, '#c9c6d8'); p(14, 4, 4, 1, '#e6e4ef'); p(15, 5, 2, 1, '#fff7a8');
    },
    mirror(p) {
      p(10, 6, 12, 1, '#3a3550');
      p(13, 2, 6, 4, '#d8dbe6'); p(12, 3, 1, 2, '#b5b8c8'); p(19, 3, 1, 2, '#b5b8c8');
      p(14, 2, 4, 1, '#f3f4fa'); p(15, 3, 2, 2, '#2a2a3a');
    },
    gradcap(p) {
      p(11, 4, 10, 3, '#25223a');
      p(7, 3, 18, 2, '#25223a'); p(7, 3, 18, 1, '#3c3858');
      p(15, 2, 2, 1, '#ffcd57'); p(16, 3, 7, 1, '#ffcd57'); p(23, 4, 1, 5, '#ffcd57'); p(22, 8, 3, 1, '#ffcd57');
    },
    crown(p) {
      p(11, 3, 10, 3, '#ffcd57'); p(11, 5, 10, 1, '#d99a2b');
      p(11, 1, 2, 2, '#ffcd57'); p(15, 0, 2, 3, '#ffcd57'); p(19, 1, 2, 2, '#ffcd57');
      p(12, 4, 1, 1, '#ec5464'); p(15, 4, 2, 1, '#5aa9ff'); p(19, 4, 1, 1, '#78d98c');
    }
  };

  // ---------- Face ----------
  const FACE = {
    glasses(p) {
      const k = '#2a2440';
      p(12, 9, 3, 1, k); p(17, 9, 3, 1, k); p(12, 12, 3, 1, k); p(17, 12, 3, 1, k);
      p(12, 10, 1, 2, k); p(14, 10, 1, 2, k); p(17, 10, 1, 2, k); p(19, 10, 1, 2, k);
      p(15, 10, 2, 1, k); p(11, 10, 1, 1, k); p(20, 10, 1, 1, k);
    },
    mask(p) {
      p(12, 12, 8, 4, '#9fd8e8'); p(12, 13, 8, 1, '#83c2d6'); p(12, 15, 8, 1, '#83c2d6');
      p(11, 12, 1, 1, '#e6e4ef'); p(20, 12, 1, 1, '#e6e4ef');
    },
    aviators(p) {
      p(12, 9, 8, 1, '#d9a92e'); p(15, 10, 2, 1, '#d9a92e');
      p(12, 10, 3, 2, '#3b2f22'); p(17, 10, 3, 2, '#3b2f22'); p(13, 12, 1, 1, '#3b2f22'); p(18, 12, 1, 1, '#3b2f22');
      p(12, 10, 1, 1, '#8a7350'); p(17, 10, 1, 1, '#8a7350');
    },
    loupes(p) {
      p(11, 9, 10, 1, '#2a2440');
      p(12, 10, 3, 3, '#4a4660'); p(17, 10, 3, 3, '#4a4660');
      p(13, 11, 1, 1, '#7fd6ff'); p(18, 11, 1, 1, '#7fd6ff');
    },
    monocle(p) {
      const g = '#ffcd57';
      p(17, 9, 3, 1, g); p(17, 12, 3, 1, g); p(16, 10, 1, 2, g); p(20, 10, 1, 2, g);
      p(20, 13, 1, 1, g); p(21, 14, 1, 2, g); p(21, 17, 1, 2, g);
    }
  };

  // ---------- Coats ----------
  const W = '#f4f2fb', WS = '#cfcbe0';
  function whiteCoat(p, long, base, edge) {
    const c = base || W, s = edge || WS;
    const h = long ? 13 : 10;
    p(9, 17, 5, h, c); p(18, 17, 5, h, c);
    p(13, 17, 1, 3, c); p(18, 17, 1, 3, c);
    p(13, 20, 1, 1, s); p(18, 20, 1, 1, s);
    p(9, 16 + h, 5, 1, s); p(18, 16 + h, 5, 1, s);
    p(19, 22, 3, 1, s);
    return c;
  }
  const COAT = {
    short(p) { const c = whiteCoat(p, false); p(20, 21, 1, 1, '#5aa9ff'); return c; },
    long(p) { const c = whiteCoat(p, true); p(20, 21, 1, 1, '#ec5464'); return c; },
    pins(p) {
      const c = whiteCoat(p, false);
      p(10, 19, 1, 1, '#ff7a93'); p(11, 21, 1, 1, '#ffcd57'); p(10, 23, 1, 1, '#78d98c'); p(12, 19, 1, 1, '#5aa9ff'); p(12, 23, 1, 1, '#c77dff');
      return c;
    },
    goldcoat(p) {
      const c = whiteCoat(p, true, '#fff2c2', '#e3a92b');
      p(13, 17, 1, 13, '#e3a92b'); p(18, 17, 1, 13, '#e3a92b');
      return c;
    },
    vest(p, sc) {
      p(9, 17, 4, 10, '#5c6b8a'); p(19, 17, 4, 10, '#5c6b8a');
      p(12, 17, 1, 3, '#5c6b8a'); p(19, 17, 1, 3, '#5c6b8a');
      p(9, 26, 4, 1, '#4a5774'); p(19, 26, 4, 1, '#4a5774');
      return sc;
    }
  };

  // ---------- Held items (drawn last) ----------
  const HELD = {
    steth(p) {
      p(12, 17, 1, 6, '#2b2a33'); p(19, 17, 1, 4, '#2b2a33'); p(18, 21, 1, 1, '#2b2a33');
      p(11, 23, 3, 2, '#c9c6d8'); p(12, 23, 1, 1, '#8a87a3');
    },
    clipboard(p, skin) {
      p(22, 21, 5, 7, '#a0703c'); p(23, 23, 3, 4, '#f4f2fb');
      p(23, 24, 3, 1, '#9a96b5'); p(23, 26, 2, 1, '#9a96b5'); p(23, 21, 3, 2, '#b9b7c6');
      p(23, 25, 1, 2, skin);
    },
    hammer(p, skin) {
      p(24, 19, 1, 8, '#b9b7c6'); p(22, 18, 5, 2, '#ff7a93'); p(22, 18, 1, 1, '#d65572'); p(26, 19, 1, 1, '#d65572');
      p(23, 25, 2, 2, skin);
    },
    coffee(p) {
      p(23, 23, 3, 4, '#f4f2fb'); p(23, 24, 3, 2, '#8b5a2b'); p(22, 22, 5, 1, '#4a4660');
      p(24, 20, 1, 1, '#d8d5e6'); p(25, 19, 1, 1, '#d8d5e6');
    },
    kit(p) {
      p(21, 24, 6, 5, '#ec5464'); p(23, 23, 2, 1, '#4a4660');
      p(23, 25, 2, 3, '#ffffff'); p(22, 26, 4, 1, '#ffffff');
    },
    pager(p) {
      p(23, 23, 3, 4, '#2b2a33'); p(23, 24, 3, 1, '#78d98c'); p(24, 26, 1, 1, '#ec5464'); p(26, 23, 1, 1, '#ec5464');
    },
    scalpel(p, skin) {
      p(24, 20, 1, 7, '#ffcd57'); p(24, 17, 1, 3, '#e8eaf2'); p(25, 18, 1, 1, '#e8eaf2'); p(26, 16, 1, 1, '#ffffff');
      p(23, 25, 2, 2, skin);
    }
  };

  PR.drawAvatar = function (canvas, look, opts) {
    opts = opts || {};
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 32, 32);
    const p = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };

    const skin = PR.SKINS[look.skin] || PR.SKINS[1];
    const hc = PR.HAIR_COLORS[look.hairColor] || PR.HAIR_COLORS[0];
    const sc = SCRUBS[look.scrubs] || SCRUBS.ceil;

    if (!opts.noBg) (BG[look.bg] || BG.hall)(p);

    // back hair
    if (look.hair === 'long') { p(9, 7, 3, 13, hc); p(20, 7, 3, 13, hc); }

    // legs + shoes
    p(11, 27, 4, 3, shade(sc, -25)); p(17, 27, 4, 3, shade(sc, -25));
    p(10, 30, 5, 2, '#e9e6f2'); p(17, 30, 5, 2, '#e9e6f2'); p(10, 31, 5, 1, '#7c7896'); p(17, 31, 5, 1, '#7c7896');

    // torso
    p(9, 17, 14, 10, sc);
    p(14, 17, 4, 1, skin); p(15, 18, 2, 1, skin);
    p(9, 26, 14, 1, shade(sc, -18));
    if (look.scrubs === 'galaxy') { p(15, 21, 1, 1, '#ffffff'); p(16, 24, 1, 1, '#ffcd57'); p(14, 23, 1, 1, '#c77dff'); p(10, 19, 1, 1, '#ffffff'); }
    if (look.scrubs === 'gold') { p(14, 20, 1, 1, '#fff1b0'); p(17, 23, 1, 1, '#fff1b0'); }

    // coat
    let sleeve = sc;
    if (look.coat && COAT[look.coat]) sleeve = COAT[look.coat](p, sc);

    // arms + hands
    p(7, 18, 2, 7, sleeve); p(23, 18, 2, 7, sleeve);
    p(7, 25, 2, 2, skin); p(23, 25, 2, 2, skin);

    // neck + head
    p(14, 16, 4, 1, shade(skin, -22));
    p(11, 6, 10, 10, skin);
    p(10, 9, 1, 4, skin); p(21, 9, 1, 4, skin);
    p(11, 15, 1, 1, shade(skin, -12)); p(20, 15, 1, 1, shade(skin, -12));

    // face
    p(13, 10, 1, 2, '#1a1424'); p(18, 10, 1, 2, '#1a1424');
    p(12, 12, 1, 1, '#f19aa0'); p(19, 12, 1, 1, '#f19aa0');
    p(15, 13, 2, 1, shade(skin, -60));

    (HAIR[look.hair] || HAIR.short)(p, hc, skin);
    if (look.face && FACE[look.face]) FACE[look.face](p);
    if (look.head && HEAD[look.head]) HEAD[look.head](p);
    if (look.held && HELD[look.held]) HELD[look.held](p, skin);
  };
})();
