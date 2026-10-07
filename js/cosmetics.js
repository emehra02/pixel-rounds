/* Pixel Rounds — cosmetics catalog, rarities, and Supply Closet odds. */
(function () {
  'use strict';
  const PR = (window.PR = window.PR || {});

  PR.SLOTS = [
    { id: 'head', name: 'Headwear', none: true },
    { id: 'face', name: 'Eyewear & masks', none: true },
    { id: 'scrubs', name: 'Scrubs' },
    { id: 'coat', name: 'Coat', none: true },
    { id: 'held', name: 'In hand', none: true },
    { id: 'bg', name: 'Backdrop' }
  ];

  PR.RARITY = {
    C: { name: 'Common', refund: 10 },
    R: { name: 'Rare', refund: 20 },
    E: { name: 'Epic', refund: 35 },
    L: { name: 'Legendary', refund: 80 }
  };

  PR.PULL_COST = 50;

  // Odds by Supply Chain perk level (percent).
  PR.ODDS = [
    { C: 60, R: 28, E: 10, L: 2 },
    { C: 52, R: 31, E: 13, L: 4 },
    { C: 45, R: 33, E: 16, L: 6 }
  ];

  PR.COSMETICS = [
    // Starter kit (owned by everyone, not in the closet)
    { id: 'ceil', slot: 'scrubs', name: 'Ceil Blue Scrubs', rarity: 'C', starter: true, flavor: 'Standard issue. Smells like the laundry cart.' },
    { id: 'short', slot: 'coat', name: 'Short White Coat', rarity: 'C', starter: true, flavor: 'Pockets full of index cards.' },
    { id: 'steth', slot: 'held', name: 'Stethoscope', rarity: 'C', starter: true, flavor: 'Mostly worn as a necklace.' },
    { id: 'hall', slot: 'bg', name: 'Hospital Hallway', rarity: 'C', starter: true, flavor: 'Follow the colored line on the floor.' },

    // Headwear
    { id: 'cap_ceil', slot: 'head', name: 'Scrub Cap', rarity: 'C', flavor: 'Keeps the hair out of the field.' },
    { id: 'bouffant', slot: 'head', name: 'Bouffant Cap', rarity: 'C', flavor: 'Disposable. Iconic.' },
    { id: 'cap_floral', slot: 'head', name: 'Floral Scrub Cap', rarity: 'R', flavor: 'Hand-sewn by a circulating nurse.' },
    { id: 'headlamp', slot: 'head', name: 'Surgical Headlamp', rarity: 'R', flavor: 'For when the overheads aren\'t enough.' },
    { id: 'mirror', slot: 'head', name: 'ENT Head Mirror', rarity: 'E', flavor: 'Nobody knows how to use it anymore.' },
    { id: 'gradcap', slot: 'head', name: 'Graduation Cap', rarity: 'E', flavor: 'Four years, one tassel.' },
    { id: 'crown', slot: 'head', name: 'Chief Resident Crown', rarity: 'L', flavor: 'Heavy is the head that makes the call schedule.' },

    // Face
    { id: 'glasses', slot: 'face', name: 'Reading Glasses', rarity: 'C', flavor: 'For tiny print in First Aid.' },
    { id: 'mask', slot: 'face', name: 'Surgical Mask', rarity: 'C', flavor: 'Blue side out.' },
    { id: 'aviators', slot: 'face', name: 'Aviators', rarity: 'R', flavor: 'Flight surgeon energy.' },
    { id: 'loupes', slot: 'face', name: 'Surgical Loupes', rarity: 'E', flavor: '3.5x magnification and a sore neck.' },
    { id: 'monocle', slot: 'face', name: 'Attending\'s Monocle', rarity: 'L', flavor: '"And what is the mechanism of action?"' },

    // Scrubs
    { id: 'navy', slot: 'scrubs', name: 'Navy Scrubs', rarity: 'C', flavor: 'Hides coffee stains.' },
    { id: 'burgundy', slot: 'scrubs', name: 'Burgundy Scrubs', rarity: 'C', flavor: 'Hides other stains.' },
    { id: 'hunter', slot: 'scrubs', name: 'Hunter Green Scrubs', rarity: 'R', flavor: 'Surgery-department chic.' },
    { id: 'black', slot: 'scrubs', name: 'Night Float Black', rarity: 'E', flavor: 'For the 7p–7a crowd.' },
    { id: 'galaxy', slot: 'scrubs', name: 'Galaxy Scrubs', rarity: 'E', flavor: 'Peds patients love them.' },
    { id: 'gold', slot: 'scrubs', name: 'Golden Scrubs', rarity: 'L', flavor: 'Step 1 is pass/fail. These are not.' },

    // Coats
    { id: 'vest', slot: 'coat', name: 'Fleece Vest', rarity: 'C', flavor: 'Mandatory on rounds after 2 PM.' },
    { id: 'long', slot: 'coat', name: 'Long White Coat', rarity: 'R', flavor: 'Officially earned.' },
    { id: 'pins', slot: 'coat', name: 'Pin-Collector Coat', rarity: 'E', flavor: 'One pin for every rotation.' },
    { id: 'goldcoat', slot: 'coat', name: 'Gilded Coat', rarity: 'L', flavor: 'Do not wear to the cafeteria.' },

    // Held items
    { id: 'clipboard', slot: 'held', name: 'Clipboard', rarity: 'C', flavor: 'The patient list, printed at 5 AM.' },
    { id: 'hammer', slot: 'held', name: 'Reflex Hammer', rarity: 'C', flavor: 'Taylor model, pink tip.' },
    { id: 'coffee', slot: 'held', name: 'Call Room Coffee', rarity: 'R', flavor: 'Brewed sometime yesterday.' },
    { id: 'kit', slot: 'held', name: 'First Aid Kit', rarity: 'R', flavor: 'Fully stocked for once.' },
    { id: 'pager', slot: 'held', name: 'Vintage Pager', rarity: 'E', flavor: 'It will go off during lunch.' },
    { id: 'scalpel', slot: 'held', name: 'Golden Scalpel', rarity: 'L', flavor: 'Number 10 blade, 24 karat.' },

    // Backdrops
    { id: 'library', slot: 'bg', name: 'Library Carrel', rarity: 'C', flavor: 'Your second apartment during dedicated.' },
    { id: 'or', slot: 'bg', name: 'Operating Room', rarity: 'R', flavor: 'Time out completed.' },
    { id: 'night', slot: 'bg', name: 'Night Shift', rarity: 'E', flavor: 'Quiet. Don\'t say the Q-word.' },
    { id: 'beach', slot: 'bg', name: 'Vacation Block', rarity: 'E', flavor: 'Two whole weeks.' },
    { id: 'match', slot: 'bg', name: 'Match Day', rarity: 'L', flavor: 'Open the envelope.' }
  ];

  PR.ITEM = {};
  PR.COSMETICS.forEach((c) => { PR.ITEM[c.id] = c; });
  PR.COLLECTIBLES = PR.COSMETICS.filter((c) => !c.starter);

  PR.rollRarity = function (supplyLevel, rnd) {
    const o = PR.ODDS[Math.min(supplyLevel || 0, PR.ODDS.length - 1)];
    let x = (rnd || Math.random)() * 100;
    for (const k of ['L', 'E', 'R', 'C']) {
      if (x < o[k]) return k;
      x -= o[k];
    }
    return 'C';
  };

  PR.rollItem = function (supplyLevel, rnd) {
    const r = rnd || Math.random;
    const rarity = PR.rollRarity(supplyLevel, r);
    const pool = PR.COLLECTIBLES.filter((c) => c.rarity === rarity);
    return pool[Math.floor(r() * pool.length)];
  };
})();
