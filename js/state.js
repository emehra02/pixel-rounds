/* Pixel Rounds — save data, progression math, and perks. */
(function () {
  'use strict';
  const PR = (window.PR = window.PR || {});
  const KEY = 'pixelrounds.save.v1';

  // Case #1 falls on CONFIG.launchDate. Days are counted in the player's local time zone.
  PR.EPOCH = (function () {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((PR.CONFIG && PR.CONFIG.launchDate) || '');
    return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : Date.UTC(2026, 9, 6);
  })();
  PR.dateForDay = function (day) {
    const d = new Date(PR.EPOCH + day * 86400000);
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  };
  PR.todayIndex = function (d) {
    d = d || new Date();
    return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - PR.EPOCH) / 86400000);
  };

  PR.BASE_GUESSES = 6;
  PR.CLUES = 6;

  PR.PERKS = [
    { id: 'triage', name: 'Triage Nurse', max: 1, cost: [1],
      desc: () => 'Shows the organ system from the first clue.' },
    { id: 'consult', name: 'Curbside Consult', max: 2, cost: [1, 2],
      desc: (l) => `Reveal the next clue without spending a guess. ${Math.max(1, l)}× per case${l ? '' : ' at level 1'}.` },
    { id: 'second', name: 'Second Opinion', max: 2, cost: [2, 3],
      desc: (l) => `+1 guess per case. You have ${PR.BASE_GUESSES + l} now.` },
    { id: 'mnemonic', name: 'Mnemonic', max: 1, cost: [2],
      desc: () => 'Once per case, see the first letter and word count of the answer.' },
    { id: 'board', name: 'Board Review', max: 3, cost: [1, 1, 2],
      desc: (l) => `+10% XP per level. Currently +${l * 10}%.` },
    { id: 'moon', name: 'Moonlighting', max: 3, cost: [1, 1, 2],
      desc: (l) => `+15% RVUs per level. Currently +${l * 15}%.` },
    { id: 'supply', name: 'Supply Chain', max: 2, cost: [2, 3],
      desc: (l) => `Better odds in the Supply Closet. Legendary chance is ${PR.ODDS[l].L}% now.` },
    { id: 'cover', name: 'Call Coverage', consumable: true, hold: 2, cost: [1],
      desc: () => 'Covers one missed day so your streak survives. Used automatically.' }
  ];
  PR.PERK = {};
  PR.PERKS.forEach((p) => { PR.PERK[p.id] = p; });

  // Career ladder. Each new title grants a guaranteed cosmetic (duplicates refund RVUs).
  PR.TITLES = [
    { level: 1, title: 'Pre-Med', reward: null },
    { level: 2, title: 'MS1', reward: 'glasses' },
    { level: 4, title: 'MS2', reward: 'clipboard' },
    { level: 6, title: 'MS3', reward: 'cap_ceil' },
    { level: 8, title: 'MS4', reward: 'hammer' },
    { level: 10, title: 'Intern', reward: 'long' },
    { level: 13, title: 'Junior Resident', reward: 'coffee' },
    { level: 16, title: 'Senior Resident', reward: 'pager' },
    { level: 20, title: 'Chief Resident', reward: 'crown' },
    { level: 25, title: 'Fellow', reward: 'loupes' },
    { level: 30, title: 'Attending', reward: 'monocle' },
    { level: 40, title: 'Program Director', reward: 'goldcoat' },
    { level: 50, title: 'Department Chair', reward: 'gold' }
  ];
  PR.DR_LEVEL = 10; // "Dr." is added to the name from Intern onward

  PR.titleFor = function (level) {
    let t = PR.TITLES[0];
    PR.TITLES.forEach((x) => { if (level >= x.level) t = x; });
    return t;
  };
  PR.nextTitle = function (level) {
    return PR.TITLES.find((x) => x.level > level) || null;
  };
  PR.cleanName = function (name) {
    const n = String(name || '').replace(/^\s*dr\.?\s+/i, '').trim().slice(0, 18);
    return n || 'Rookie';
  };
  PR.displayName = function (s) {
    return (s.level >= PR.DR_LEVEL ? 'Dr. ' : '') + s.name;
  };

  PR.defaultState = function () {
    return {
      v: 1,
      name: 'Rookie',
      level: 1, xp: 0, rvu: 50, cme: 0,
      streak: 0, bestStreak: 0, lastSolved: null,
      played: 0, wins: 0, dist: [0, 0, 0, 0, 0, 0, 0, 0],
      look: { skin: 1, hair: 'short', hairColor: 0, head: null, face: null, scrubs: 'ceil', coat: 'short', held: 'steth', bg: 'hall' },
      owned: {},
      perks: { triage: 0, consult: 0, second: 0, mnemonic: 0, board: 0, moon: 0, supply: 0 },
      freezes: 0,
      daily: null,
      history: {},   // day -> { won, n } for daily cases
      archive: {},   // day -> { won, n } for past cases replayed from the archive
      sys: {},       // organ system -> { n, w } across every finished case
      pulls: 0,
      seenIntro: false
    };
  };

  PR.load = function () {
    const base = PR.defaultState();
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return base;
      const s = JSON.parse(raw);
      s.name = PR.cleanName(s.name);
      // Drop any corrupted numbers so defaults fill them in.
      ['level', 'xp', 'rvu', 'cme', 'streak', 'bestStreak', 'played', 'wins', 'freezes', 'pulls'].forEach((k) => {
        if (typeof s[k] !== 'number' || !isFinite(s[k])) delete s[k];
      });
      return Object.assign(base, s, {
        look: Object.assign(base.look, s.look || {}),
        perks: Object.assign(base.perks, s.perks || {}),
        owned: s.owned || {},
        history: s.history || {},
        archive: s.archive || {},
        sys: s.sys || {},
        dist: (s.dist && s.dist.length === 8) ? s.dist : base.dist
      });
    } catch (e) {
      return base;
    }
  };

  PR.save = function (s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage blocked: play continues in memory */ }
  };

  PR.wipe = function () {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  };

  PR.xpToNext = (level) => 80 + 40 * level;

  PR.owns = (s, id) => !!(PR.ITEM[id] && (PR.ITEM[id].starter || s.owned[id]));

  // Adds XP and returns the list of levels reached. +1 CME per level, +2 on every 5th.
  PR.addXp = function (s, amount) {
    s.xp += amount;
    const gained = [];
    while (s.xp >= PR.xpToNext(s.level)) {
      s.xp -= PR.xpToNext(s.level);
      s.level += 1;
      const cme = s.level % 5 === 0 ? 2 : 1;
      s.cme += cme;
      const step = { level: s.level, cme };
      const promo = PR.TITLES.find((t) => t.level === s.level);
      if (promo) {
        step.title = promo.title;
        if (promo.reward) {
          step.reward = promo.reward;
          if (s.owned[promo.reward]) {
            step.refund = PR.RARITY[PR.ITEM[promo.reward].rarity].refund;
            s.rvu += step.refund;
          } else {
            s.owned[promo.reward] = true;
          }
        }
      }
      gained.push(step);
    }
    return gained;
  };

  // Rewards for finishing the daily case. Call after the streak is updated.
  PR.computeRewards = function (s, won, guessCount) {
    const baseXp = won ? Math.max(45, 130 - 15 * (guessCount - 1)) : 20;
    const baseRvu = won ? Math.max(10, 35 - 5 * (guessCount - 1)) : 5;
    const streakXp = won ? Math.min(50, 5 * s.streak) : 0;
    const xp = Math.round((baseXp + streakXp) * (1 + 0.1 * (s.perks.board || 0)));
    const rvu = Math.round(baseRvu * (1 + 0.15 * (s.perks.moon || 0)));
    return { xp, rvu, baseXp, streakXp };
  };

  // Streak upkeep on app open. Spends Call Coverage to bridge missed days.
  PR.upkeepStreak = function (s, today) {
    if (!s.streak || s.lastSolved == null) return null;
    const missed = today - s.lastSolved - 1;
    if (missed <= 0) return null;
    if (s.freezes >= missed) {
      s.freezes -= missed;
      s.lastSolved = today - 1;
      return { covered: missed };
    }
    const lost = s.streak;
    s.streak = 0;
    return { lost };
  };
})();
