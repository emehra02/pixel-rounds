/* Pixel Rounds — UI and game flow. */
(function () {
  'use strict';
  const PR = window.PR;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let S = PR.load();
  const TODAY = PR.todayIndex();
  let mode = 'daily';       // 'daily' | 'practice' | 'archive'
  let side = null;          // practice or archive session
  let view = 'rounds';
  let lastRevealed = -1;
  let suggIndex = -1;
  let resetArmed = false;
  let installEvent = null;

  const DISCLAIMER = 'Pixel Rounds is an independent study game. It is not affiliated with or endorsed by the USMLE®, the NBME®, or the FSMB®. Content is for education only and is not medical advice.';

  // ---------- Pixel icons ----------
  const ICONS = {
    coin: { c: { 1: '#b9781a', 2: '#ffcd57', 3: '#fff1b0' }, m: ['..1111..', '.122221.', '12322221', '12322221', '12222221', '12222221', '.122221.', '..1111..'] },
    heart: { c: { 1: '#ff7a93', 2: '#ffd0da' }, m: ['.11..11.', '12111111', '11111111', '11111111', '.111111.', '..1111..', '...11...', '........'] },
    cme: { c: { 1: '#ff7a93' }, m: ['...11...', '...11...', '...11...', '11111111', '11111111', '...11...', '...11...', '...11...'] },
    flame: { c: { 1: '#ec5464', 2: '#ff9b4a', 3: '#ffcd57' }, m: ['...1....', '...11...', '..121...', '..1221.1', '.122211.', '12233221', '12233221', '.122221.'] },
    star: { c: { 1: '#5fd1c4' }, m: ['...11...', '...11...', '11111111', '.111111.', '..1111..', '.11..11.', '11....11', '........'] }
  };
  function icon(name, dim) {
    const ic = ICONS[name];
    let rects = '';
    ic.m.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === '.') continue;
        rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${dim ? '#3e3a6a' : ic.c[ch]}"/>`;
      }
    });
    return `<svg class="ico" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
  }

  // ---------- Sprites ----------
  function spriteHTML(look, cls, label) {
    return `<canvas class="sprite ${cls || ''}" width="32" height="32" data-look='${esc(JSON.stringify(look))}' role="img" aria-label="${esc(label || 'Your doctor avatar')}"></canvas>`;
  }
  function paintSprites(root) {
    $$('canvas[data-look]', root).forEach((c) => {
      try { PR.drawAvatar(c, JSON.parse(c.dataset.look)); } catch (e) { /* skip bad sprite */ }
    });
  }
  const withItem = (item) => Object.assign({}, S.look, { [item.slot]: item.id });

  // ---------- Toast + modal ----------
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  const modalQueue = [];
  function queueModal(html, onMount) {
    modalQueue.push({ html, onMount });
    if ($('#modal').hidden) nextModal();
  }
  function nextModal() {
    const m = modalQueue.shift();
    const wrap = $('#modal');
    if (!m) { wrap.hidden = true; $('#modal-card').innerHTML = ''; return; }
    const card = $('#modal-card');
    card.innerHTML = m.html;
    wrap.hidden = false;
    card.scrollTop = 0;
    paintSprites(card);
    if (m.onMount) m.onMount(card);
    const f = card.querySelector('[data-autofocus]') || card.querySelector('button');
    if (f) f.focus();
  }
  function closeModal() { nextModal(); }

  // ---------- Dates ----------
  const fmtDay = (day, opts) => PR.dateForDay(day).toLocaleDateString(undefined, opts || { weekday: 'short', month: 'short', day: 'numeric' });

  // ---------- Sessions ----------
  function newSession(caseIdx, day) {
    return { day, caseIdx, guesses: [], consults: 0, mnemonic: false, done: false, won: false, rewards: null };
  }
  function dailySession() {
    if (!S.daily || S.daily.day !== TODAY) {
      S.daily = newSession(PR.caseIndexForDay(TODAY), TODAY);
      PR.save(S);
    }
    return S.daily;
  }
  const cur = () => (mode === 'daily' ? dailySession() : side);
  const caseOf = (sess) => PR.CASES[sess.caseIdx];
  const maxGuesses = () => PR.BASE_GUESSES + (S.perks.second || 0);
  const wrongCount = (sess) => sess.guesses.filter((g) => g.r !== 'hit').length;
  const revealedCount = (sess) => (sess.done ? PR.CLUES : Math.min(PR.CLUES, 1 + wrongCount(sess) + sess.consults));
  function persist() { PR.save(S); }

  // ---------- HUD ----------
  function perkCost(p) {
    if (p.consumable) return S.freezes >= p.hold ? null : p.cost[0];
    const lvl = S.perks[p.id] || 0;
    return lvl >= p.max ? null : p.cost[lvl];
  }
  function renderHUD() {
    const need = PR.xpToNext(S.level);
    const pct = Math.min(100, Math.round((S.xp / need) * 100));
    $('#hud').innerHTML = `
      <div class="hud-inner">
        <button class="hud-avatar pix" data-act="goto" data-view="locker" aria-label="Open locker">${spriteHTML(S.look, '', 'Your doctor')}</button>
        <div class="hud-body">
          <div class="hud-top">
            <span class="hud-name">${esc(PR.displayName(S))}</span>
            <span class="lv">LV ${S.level}</span>
          </div>
          <div class="hud-title">${esc(PR.titleFor(S.level).title)}</div>
          <div class="xpbar" role="progressbar" aria-label="Experience" aria-valuemin="0" aria-valuemax="${need}" aria-valuenow="${S.xp}"><i style="width:${pct}%"></i></div>
          <div class="wallet">
            <span class="chip" title="RVUs: spend in the Supply Closet">${icon('coin')}<b>${S.rvu}</b><small>RVU</small></span>
            <span class="chip" title="CME: spend in Training">${icon('cme')}<b>${S.cme}</b><small>CME</small></span>
            <span class="chip" title="Daily streak">${icon('flame', !S.streak)}<b>${S.streak}</b><small>day${S.streak === 1 ? '' : 's'}</small></span>
            <span class="xptext">${S.xp}/${need} XP</span>
          </div>
        </div>
      </div>`;
    paintSprites($('#hud'));
    const canPull = S.rvu >= PR.PULL_COST;
    const canTrain = PR.PERKS.some((p) => perkCost(p) != null && S.cme >= perkCost(p));
    $('[data-view="closet"]', $('#tabs')).classList.toggle('badge', canPull);
    $('[data-view="training"]', $('#tabs')).classList.toggle('badge', canTrain);
    $('[data-view="rounds"]', $('#tabs')).classList.toggle('badge', !dailySession().done);
  }

  // ---------- Rounds ----------
  function renderRounds() {
    const sess = cur();
    const c = caseOf(sess);
    const rev = revealedCount(sess);
    const max = maxGuesses();
    const left = Math.max(0, max - sess.guesses.length);
    const showSystem = sess.done || S.perks.triage > 0;
    const freshIdx = rev - 1 > lastRevealed && lastRevealed >= 0 ? rev - 1 : -1;
    lastRevealed = rev - 1;

    let h = '';
    if (mode === 'practice') {
      h += `<div class="banner"><span>Practice case. No rewards.</span><button class="btn small dark" data-act="back-daily">Today's case</button></div>`;
    } else if (mode === 'archive') {
      h += `<div class="banner"><span>Past case. No rewards.</span><button class="btn small dark" data-act="goto" data-view="archive">All past cases</button></div>`;
    }
    const label = mode === 'daily' ? `Case #${TODAY + 1} · ${esc(fmtDay(TODAY))}`
      : mode === 'archive' ? `Case #${sess.day + 1} · ${esc(fmtDay(sess.day))}` : 'Practice ward';
    h += `
      <div class="case-head">
        <div class="case-id">
          <span class="eyebrow">${label}</span>
          <h1 class="case-title">${sess.done ? esc(c.answer) : 'Unknown diagnosis'}</h1>
        </div>
        <span class="sys ${showSystem ? '' : 'locked'}" title="${showSystem ? 'Organ system' : 'Unlock with Triage Nurse'}">${showSystem ? esc(c.system) : 'System ???'}</span>
      </div>
      <div class="lives" aria-label="${left} guesses left">${Array.from({ length: max }, (_, i) => icon('heart', i >= left)).join('')}<span>${left} guess${left === 1 ? '' : 'es'} left</span></div>`;

    if (sess.mnemonic && !sess.done) {
      const words = c.answer.split(/\s+/).length;
      h += `<p class="hint">${icon('star')} Starts with <b>${esc(c.answer[0])}</b> · ${words} word${words === 1 ? '' : 's'}</p>`;
    }

    h += '<ol class="clues">';
    for (let i = 0; i < PR.CLUES; i++) {
      if (i < rev) {
        h += `<li class="clue pix ${i === freshIdx ? 'fresh' : ''}"><span class="num">${i + 1}</span><p>${esc(c.clues[i])}</p></li>`;
      } else {
        h += `<li class="clue locked"><span class="num">${i + 1}</span><p>Locked. A miss reveals it.</p></li>`;
      }
    }
    h += '</ol>';

    if (sess.guesses.length) {
      h += '<ul class="guesses" aria-label="Your differential">';
      sess.guesses.forEach((g) => {
        const tag = g.r === 'hit' ? 'Correct' : g.r === 'near' ? 'Right system' : 'Wrong system';
        h += `<li class="g ${g.r}"><i aria-hidden="true"></i><span>${esc(g.n)}</span><small>${tag}</small></li>`;
      });
      h += '</ul>';
    }

    if (!sess.done) {
      const consultLeft = (S.perks.consult || 0) - sess.consults;
      const tools = [];
      if (S.perks.consult) tools.push(`<button class="btn small dark" data-act="consult" ${consultLeft > 0 && rev < PR.CLUES ? '' : 'disabled'}>Consult · ${Math.max(0, consultLeft)}</button>`);
      if (S.perks.mnemonic) tools.push(`<button class="btn small dark" data-act="mnemonic" ${sess.mnemonic ? 'disabled' : ''}>Mnemonic</button>`);
      h += `
        <form class="entry" id="guess-form" autocomplete="off">
          <label for="guess" class="eyebrow">Your diagnosis</label>
          <div class="entry-row">
            <div class="combo">
              <input id="guess" class="pix" type="text" placeholder="Type a letter to see options" aria-autocomplete="list" aria-controls="sugg" spellcheck="false" autocapitalize="off">
              <ul id="sugg" class="sugg pix" role="listbox" hidden></ul>
            </div>
            <button class="btn" type="submit">Diagnose</button>
          </div>
          ${tools.length ? `<div class="tools">${tools.join('')}</div>` : ''}
        </form>`;
    } else {
      h += resultHTML(sess, c);
    }

    const el = $('#view-rounds');
    el.innerHTML = h;
    paintSprites(el);
    bindEntry();
    tickCountdown();
  }

  function resultHTML(sess, c) {
    const n = sess.guesses.length;
    let r = `<section class="result ${sess.won ? 'win' : 'loss'} pix">
      <div class="result-band">${sess.won ? `Diagnosed in ${n}` : 'Missed this one'}</div>
      <div class="result-body">
        <p class="answer">${esc(c.answer)}</p>
        <p class="pearl"><span class="label">High yield</span>${esc(c.pearl)}</p>`;
    if (mode === 'daily' && sess.rewards) {
      const rw = sess.rewards;
      r += `<div class="rewards">
          <span class="chip">${icon('star')}<b>+${rw.xp}</b><small>XP${rw.streakXp ? ` incl. streak +${rw.streakXp}` : ''}</small></span>
          <span class="chip">${icon('coin')}<b>+${rw.rvu}</b><small>RVU</small></span>
          ${rw.levels && rw.levels.length ? `<span class="chip">${icon('cme')}<b>+${rw.levels.reduce((a, l) => a + l.cme, 0)}</b><small>CME</small></span>` : ''}
        </div>`;
    }
    if (mode === 'daily') {
      r += `<div class="row">
          <button class="btn" data-act="share">Copy result</button>
          <button class="btn dark" data-act="goto" data-view="archive">Past cases</button>
          <button class="btn dark" data-act="practice">Practice</button>
        </div>
        <p class="next">Next case in <b id="countdown">--:--:--</b></p>`;
    } else if (mode === 'archive') {
      r += `<div class="row">
          <button class="btn" data-act="goto" data-view="archive">More past cases</button>
          <button class="btn dark" data-act="back-daily">Today's case</button>
        </div>`;
    } else {
      r += `<div class="row">
          <button class="btn" data-act="practice">Another case</button>
          <button class="btn dark" data-act="back-daily">Today's case</button>
        </div>`;
    }
    r += `<button class="linkbtn" data-act="report">Report a problem with this case</button>
      </div>
    </section>`;
    return r;
  }

  function bindEntry() {
    const form = $('#guess-form');
    if (!form) return;
    const input = $('#guess');
    const list = $('#sugg');

    const showSugg = () => {
      const sess = cur();
      const items = PR.suggest(input.value, sess.guesses.map((g) => g.n));
      suggIndex = -1;
      if (!items.length) { list.hidden = true; list.innerHTML = ''; input.setAttribute('aria-expanded', 'false'); return; }
      list.innerHTML = items.map((e, i) =>
        `<li role="option" id="opt-${i}" data-name="${esc(e.name)}"><span>${esc(e.name)}</span><small>${esc(e.system)}</small></li>`).join('');
      list.hidden = false;
      list.scrollTop = 0;
      input.setAttribute('aria-expanded', 'true');
    };
    const highlight = () => {
      $$('li', list).forEach((li, i) => {
        li.classList.toggle('active', i === suggIndex);
        if (i === suggIndex) li.scrollIntoView({ block: 'nearest' });
      });
      if (suggIndex >= 0) input.setAttribute('aria-activedescendant', 'opt-' + suggIndex);
    };

    input.addEventListener('input', showSugg);
    input.addEventListener('keydown', (e) => {
      const n = $$('li', list).length;
      if (e.key === 'ArrowDown' && n) { e.preventDefault(); suggIndex = (suggIndex + 1) % n; highlight(); }
      else if (e.key === 'ArrowUp' && n) { e.preventDefault(); suggIndex = (suggIndex - 1 + n) % n; highlight(); }
      else if (e.key === 'Enter' && suggIndex >= 0 && !list.hidden) {
        e.preventDefault();
        input.value = $$('li', list)[suggIndex].dataset.name;
        list.hidden = true;
        submitGuess(input.value);
      } else if (e.key === 'Escape') { list.hidden = true; }
    });
    list.addEventListener('pointerdown', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      e.preventDefault();
      input.value = li.dataset.name;
      list.hidden = true;
      submitGuess(input.value);
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const items = $$('li', list);
      if (!PR.findEntry(input.value) && items.length === 1) input.value = items[0].dataset.name;
      submitGuess(input.value);
    });
  }

  function submitGuess(text) {
    const sess = cur();
    if (sess.done) return;
    const entry = PR.findEntry(text);
    if (!entry) { toast('Pick a diagnosis from the list'); return; }
    if (sess.guesses.some((g) => g.n === entry.name)) { toast('Already on your differential'); return; }
    const c = caseOf(sess);
    const r = entry.name === c.answer ? 'hit' : entry.system === c.system ? 'near' : 'miss';
    sess.guesses.push({ n: entry.name, r });
    if (r === 'hit') finish(sess, true);
    else if (sess.guesses.length >= maxGuesses()) finish(sess, false);
    else toast(r === 'near' ? 'Right system. Next clue unlocked.' : 'Not it. Next clue unlocked.');
    persist();
    renderRounds();
    renderHUD();
    if (!sess.done) { const i = $('#guess'); if (i) i.focus(); }
    else { const r2 = $('.result'); if (r2 && r2.scrollIntoView) r2.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }
  }

  function finish(sess, won) {
    sess.done = true;
    sess.won = won;
    const n = sess.guesses.length;
    const c = caseOf(sess);
    const st = S.sys[c.system] || (S.sys[c.system] = { n: 0, w: 0 });
    st.n += 1;
    if (won) st.w += 1;

    if (mode === 'archive') {
      if (!S.archive[sess.day] && !S.history[sess.day]) S.archive[sess.day] = { won, n };
      return;
    }
    if (mode !== 'daily') return;

    S.played += 1;
    S.history[TODAY] = { won, n };
    if (won) {
      S.wins += 1;
      S.dist[Math.min(n, 8) - 1] += 1;
      S.streak = S.lastSolved === TODAY - 1 ? S.streak + 1 : 1;
      S.lastSolved = TODAY;
      S.bestStreak = Math.max(S.bestStreak, S.streak);
    } else {
      S.streak = 0;
    }
    const rw = PR.computeRewards(S, won, n);
    S.rvu += rw.rvu;
    rw.levels = PR.addXp(S, rw.xp);
    sess.rewards = rw;
    persist();
    rw.levels.forEach((l) => queueModal(levelUpHTML(l)));
  }

  function levelUpHTML(l) {
    if (l.title) return promotionHTML(l);
    return `<div class="levelup">
      <p class="eyebrow">Level up</p>
      <h2 class="big gold flash">Level ${l.level}</h2>
      ${spriteHTML(S.look, 'xl pix', 'Your doctor')}
      <p class="chip center">${icon('cme')}<b>+${l.cme}</b><small>CME credit${l.cme > 1 ? 's' : ''}</small></p>
      <p class="muted">Spend CME in Training to unlock perks that change how you play.</p>
      <div class="row center">
        <button class="btn" data-act="goto" data-view="training" data-close>Go to Training</button>
        <button class="btn dark" data-close>Later</button>
      </div>
    </div>`;
  }

  function promotionHTML(l) {
    const item = l.reward ? PR.ITEM[l.reward] : null;
    const look = item ? withItem(item) : S.look;
    return `<div class="levelup promo">
      <p class="eyebrow">Promotion · Level ${l.level}</p>
      <h2 class="big gold flash">${esc(l.title)}</h2>
      ${spriteHTML(look, 'xl pix', 'Your doctor')}
      ${item ? `<p class="reward-line r-${item.rarity}"><span class="rar-tag">${PR.RARITY[item.rarity].name}</span> ${esc(item.name)}</p>` : ''}
      ${l.refund ? `<p class="chip center">${icon('coin')}<b>+${l.refund}</b><small>RVU, you already had it</small></p>` : ''}
      <p class="chip center">${icon('cme')}<b>+${l.cme}</b><small>CME credit${l.cme > 1 ? 's' : ''}</small></p>
      ${l.level === PR.DR_LEVEL ? `<p class="muted">You're a doctor now. Your badge reads ${esc('Dr. ' + S.name)}.</p>` : ''}
      <div class="row center">
        ${item ? `<button class="btn" data-act="equip" data-slot="${item.slot}" data-id="${item.id}" data-close data-autofocus>Equip</button>` : ''}
        <button class="btn dark" data-close>${item ? 'Later' : 'Nice'}</button>
      </div>
    </div>`;
  }

  function useConsult() {
    const sess = cur();
    if (sess.done || sess.consults >= (S.perks.consult || 0) || revealedCount(sess) >= PR.CLUES) return;
    sess.consults += 1;
    persist();
    renderRounds();
    toast('Consult answered. New clue revealed.');
  }
  function useMnemonic() {
    const sess = cur();
    if (sess.done || sess.mnemonic || !S.perks.mnemonic) return;
    sess.mnemonic = true;
    persist();
    renderRounds();
  }

  function startPractice() {
    const todayIdx = dailySession().caseIdx;
    let idx;
    do { idx = Math.floor(Math.random() * PR.CASES.length); } while (idx === todayIdx && PR.CASES.length > 1);
    side = newSession(idx, null);
    mode = 'practice';
    lastRevealed = -1;
    go('rounds');
  }
  function startArchive(day) {
    if (day < 0 || day >= TODAY) return;
    side = newSession(PR.caseIndexForDay(day), day);
    mode = 'archive';
    lastRevealed = -1;
    go('rounds');
  }
  function backToDaily() {
    mode = 'daily';
    side = null;
    lastRevealed = -1;
    go('rounds');
  }

  function shareResult() {
    const sess = dailySession();
    const sq = sess.guesses.map((g) => (g.r === 'hit' ? '🟩' : g.r === 'near' ? '🟨' : '🟥')).join('');
    const score = sess.won ? sess.guesses.length : 'X';
    let text = `Pixel Rounds #${TODAY + 1} ${score}/${maxGuesses()} · ${PR.titleFor(S.level).title}\n${sq}\n🔥 ${S.streak} · LV ${S.level}`;
    if (/^https?:/.test(location.protocol) && !/claude/.test(location.host)) text += `\n${location.origin}`;
    copyText(text, 'Result copied');
  }
  function copyText(text, okMsg) {
    const fallback = () => queueModal(`<div><p class="eyebrow">Copy this</p><textarea class="copybox pix" id="copybox" readonly rows="5">${esc(text)}</textarea><div class="row center"><button class="btn" data-close>Done</button></div></div>`,
      (card) => { const t = $('#copybox', card); t.focus(); t.select(); });
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast(okMsg), fallback);
    } else fallback();
  }

  // ---------- Report a problem ----------
  const ISSUES = ['Wrong answer', 'Inaccurate clue', 'Inaccurate pearl', 'Gives it away too early', 'Typo or wording', 'Other'];
  function openReport() {
    const sess = cur();
    const c = caseOf(sess);
    queueModal(`<div class="report">
      <p class="eyebrow">Report a problem</p>
      <h2 class="big">${esc(c.answer)}</h2>
      <fieldset class="issues">
        <legend class="eyebrow">What's wrong?</legend>
        ${ISSUES.map((t, i) => `<label class="issue"><input type="radio" name="issue" value="${esc(t)}" ${i === 0 ? 'checked' : ''}><span>${esc(t)}</span></label>`).join('')}
      </fieldset>
      <label class="eyebrow" for="report-notes">Details (which clue, what's correct)</label>
      <textarea id="report-notes" class="copybox pix" rows="4" maxlength="800" placeholder="Clue 3 should say…"></textarea>
      <div class="row center">
        <button class="btn" data-act="send-report" data-case="${sess.caseIdx}">Send report</button>
        <button class="btn dark" data-close>Cancel</button>
      </div>
    </div>`);
  }
  function sendReport(caseIdx) {
    const c = PR.CASES[caseIdx];
    const issue = ($('input[name="issue"]:checked') || {}).value || 'Other';
    const notes = ($('#report-notes') || {}).value || '';
    const body = `Case: ${c.answer} (bank #${caseIdx + 1}, ${c.system})\nIssue: ${issue}\nDetails: ${notes.trim() || '(none)'}\nApp version: ${PR.CONFIG.version}`;
    const cfg = PR.CONFIG;
    closeModal();
    if (cfg.reportFormUrl) {
      window.open(cfg.reportFormUrl, '_blank', 'noopener');
      copyText(body, 'Report copied. Paste it into the form.');
    } else if (cfg.reportEmail) {
      location.href = `mailto:${cfg.reportEmail}?subject=${encodeURIComponent('Pixel Rounds case report: ' + c.answer)}&body=${encodeURIComponent(body)}`;
      toast('Opening your email app');
    } else {
      copyText(body, 'Report copied. Thanks!');
    }
  }

  // ---------- Countdown ----------
  function msToMidnight() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return next - now;
  }
  function fmtCountdown() {
    const ms = msToMidnight();
    const hh = String(Math.floor(ms / 3600000)).padStart(2, '0');
    const mm = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
    const ss = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  function tickCountdown() {
    $$('.js-countdown, #countdown').forEach((el) => { el.textContent = fmtCountdown(); });
  }

  // ---------- Stats ----------
  function renderStats() {
    const max = maxGuesses();
    const losses = S.played - S.wins;
    const rows = [];
    for (let i = 1; i <= max; i++) rows.push({ k: String(i), v: S.dist[i - 1] || 0 });
    rows.push({ k: 'X', v: losses });
    const top = Math.max(1, ...rows.map((r) => r.v));
    const todayRes = S.history[TODAY];

    const sysRows = PR.SYSTEMS.map((s) => {
      const st = S.sys[s] || { n: 0, w: 0 };
      return { s, n: st.n, w: st.w, pct: st.n ? Math.round((st.w / st.n) * 100) : null };
    });
    const tried = sysRows.filter((r) => r.n > 0).sort((a, b) => a.pct - b.pct || b.n - a.n);
    const untried = sysRows.filter((r) => r.n === 0);
    const weak = tried.filter((r) => r.n >= 3)[0];
    const totalCases = Object.values(S.sys).reduce((a, x) => a + x.n, 0);

    let h = `
      <div class="section-head"><h1 class="title">Stats</h1><span class="muted">${totalCases} case${totalCases === 1 ? '' : 's'} studied</span></div>
      <dl class="stat-tiles">
        <div class="pix"><dt>Played</dt><dd>${S.played}</dd></div>
        <div class="pix"><dt>Win rate</dt><dd>${S.played ? Math.round((S.wins / S.played) * 100) : 0}%</dd></div>
        <div class="pix"><dt>Streak</dt><dd>${S.streak}</dd></div>
        <div class="pix"><dt>Best</dt><dd>${S.bestStreak}</dd></div>
      </dl>
      <h2 class="sub">Daily guess distribution</h2>
      ${S.played ? `<div class="dist" role="list">${rows.map((r) => {
        const isToday = todayRes && ((todayRes.won && String(todayRes.n) === r.k) || (!todayRes.won && r.k === 'X'));
        const w = r.v ? Math.max(8, Math.round((r.v / top) * 100)) : 0;
        return `<div class="dist-row" role="listitem"><span class="dk">${r.k}</span><span class="dbar ${isToday ? 'today' : ''} ${r.k === 'X' ? 'x' : ''}" style="--w:${w}%"><b>${r.v}</b></span></div>`;
      }).join('')}</div>` : '<p class="empty pix">Solve your first daily case to start your distribution.</p>'}
      <h2 class="sub">Accuracy by system</h2>
      <p class="muted small-t">Counts every case you finish: daily, past, and practice.</p>
      ${weak ? `<p class="focus pix">${icon('star')} <span>Focus area: <b>${esc(weak.s)}</b> at ${weak.pct}% over ${weak.n} cases</span></p>` : ''}
      <div class="sys-list">
        ${tried.concat(untried).map((r) => `
          <div class="sys-row ${r.n ? '' : 'none'}">
            <span class="sys-name">${esc(r.s)}</span>
            <span class="sys-bar"><i style="--w:${r.pct == null ? 0 : r.pct}%" class="${r.pct == null ? '' : r.pct < 50 ? 'low' : r.pct < 75 ? 'mid' : 'high'}"></i></span>
            <span class="sys-pct">${r.pct == null ? '—' : r.pct + '%'}</span>
            <span class="sys-n">${r.w}/${r.n}</span>
          </div>`).join('')}
      </div>
      <div class="row">
        <button class="btn" data-act="goto" data-view="archive">Past cases</button>
        <button class="btn dark" data-act="practice">Practice ward</button>
      </div>`;
    $('#view-stats').innerHTML = h;
  }

  // ---------- Archive ----------
  function renderArchive() {
    let h = `<div class="section-head"><h1 class="title">Past cases</h1><button class="btn small dark" data-act="back-daily">Today's case</button></div>
      <p class="muted lede">Missed a day? Replay any earlier case. Past cases don't give XP or RVUs, but they count toward your system accuracy.</p>`;
    if (TODAY <= 0) {
      h += `<p class="empty pix">Past cases show up here starting tomorrow. Case #1 is today.</p>`;
    } else {
      h += '<ul class="archive">';
      for (let d = TODAY - 1; d >= 0; d--) {
        const daily = S.history[d];
        const arch = S.archive[d];
        const res = daily || arch;
        const status = res ? (res.won ? `Solved in ${res.n}` : 'Missed') : 'Not played';
        const cls = res ? (res.won ? 'won' : 'lost') : 'open';
        h += `<li><button class="arch-row ${cls}" data-act="archive-play" data-day="${d}">
          <span class="arch-num">#${d + 1}</span>
          <span class="arch-date">${esc(fmtDay(d))}</span>
          <span class="arch-status">${status}${arch && !daily ? ' · past' : ''}</span>
        </button></li>`;
      }
      h += '</ul>';
    }
    $('#view-archive').innerHTML = h;
  }

  // ---------- Locker ----------
  function renderLocker() {
    const owned = PR.COLLECTIBLES.filter((c) => S.owned[c.id]).length;
    let h = `
      <div class="section-head"><h1 class="title">Locker</h1><span class="muted">${owned}/${PR.COLLECTIBLES.length} collected</span></div>
      <div class="locker-top">
        ${spriteHTML(S.look, 'xl pix', 'Your doctor')}
        <div class="locker-id">
          <label class="eyebrow" for="docname">Name on badge</label>
          <input id="docname" class="pix" type="text" maxlength="18" value="${esc(S.name)}" autocomplete="off">
          <p class="muted small-t">${S.level >= PR.DR_LEVEL ? `Shown as ${esc(PR.displayName(S))}.` : `"Dr." is added when you make Intern (Lv ${PR.DR_LEVEL}).`}</p>
        </div>
      </div>
      ${careerHTML()}
      <h2 class="sub">Skin tone</h2>
      <div class="swatches">${PR.SKINS.map((c, i) => `<button class="swatch ${S.look.skin === i ? 'on' : ''}" style="--sw:${c}" data-act="look" data-k="skin" data-v="${i}" aria-label="Skin tone ${i + 1}"></button>`).join('')}</div>
      <h2 class="sub">Hair</h2>
      <div class="opts">${PR.HAIR_STYLES.map((s) => `<button class="opt ${S.look.hair === s.id ? 'on' : ''}" data-act="look" data-k="hair" data-v="${s.id}">${s.name}</button>`).join('')}</div>
      <div class="swatches">${PR.HAIR_COLORS.map((c, i) => `<button class="swatch ${S.look.hairColor === i ? 'on' : ''}" style="--sw:${c}" data-act="look" data-k="hairColor" data-v="${i}" aria-label="Hair color ${i + 1}"></button>`).join('')}</div>`;

    PR.SLOTS.forEach((slot) => {
      const items = PR.COSMETICS.filter((c) => c.slot === slot.id && PR.owns(S, c.id));
      h += `<h2 class="sub">${slot.name}</h2><div class="items">`;
      if (slot.none) {
        h += `<button class="item ${!S.look[slot.id] ? 'on' : ''}" data-act="equip" data-slot="${slot.id}" data-id=""><span class="none-box">—</span><span class="iname">None</span></button>`;
      }
      items.forEach((it) => {
        h += `<button class="item r-${it.rarity} ${S.look[slot.id] === it.id ? 'on' : ''}" data-act="equip" data-slot="${slot.id}" data-id="${it.id}" title="${esc(it.flavor)}">
          ${spriteHTML(withItem(it), '', it.name)}<span class="iname">${esc(it.name)}</span></button>`;
      });
      const missing = PR.COSMETICS.filter((c) => c.slot === slot.id && !PR.owns(S, c.id)).length;
      if (missing) h += `<button class="item ghost" data-act="goto" data-view="closet"><span class="none-box">?</span><span class="iname">${missing} more in the closet</span></button>`;
      h += '</div>';
    });

    h += `<div class="danger row">
      <button class="btn small dark" data-act="about">About & disclaimer</button>
      <button class="btn small dark" data-act="reset">${resetArmed ? 'Tap again to erase all progress' : 'Reset progress'}</button>
    </div>`;

    const el = $('#view-locker');
    el.innerHTML = h;
    paintSprites(el);
    $('#docname').addEventListener('change', (e) => {
      S.name = PR.cleanName(e.target.value);
      persist(); renderHUD(); renderLocker();
    });
  }

  function careerHTML() {
    const curT = PR.titleFor(S.level);
    const next = PR.nextTitle(S.level);
    let h = `<h2 class="sub">Career</h2>
      <p class="career-now"><b>${esc(curT.title)}</b>${next ? ` <span class="muted">· ${esc(next.title)} at Lv ${next.level}</span>` : ' <span class="muted">· Top of the ladder</span>'}</p>
      <ol class="ladder">`;
    PR.TITLES.forEach((t) => {
      const st = t === curT ? 'current' : S.level >= t.level ? 'done' : 'locked';
      const item = t.reward ? PR.ITEM[t.reward] : null;
      h += `<li class="${st}">
        <span class="lvl">Lv ${t.level}</span>
        <span class="t">${esc(t.title)}</span>
        <span class="rw ${item ? 'r-' + item.rarity : ''}">${item ? esc(item.name) : '—'}</span>
      </li>`;
    });
    return h + '</ol>';
  }

  // ---------- Supply Closet ----------
  function renderCloset() {
    const odds = PR.ODDS[Math.min(S.perks.supply || 0, PR.ODDS.length - 1)];
    const can = S.rvu >= PR.PULL_COST;
    let h = `
      <div class="section-head"><h1 class="title">Supply Closet</h1><span class="chip">${icon('coin')}<b>${S.rvu}</b><small>RVU</small></span></div>
      <div class="closet pix">
        <div class="crate" aria-hidden="true"><span>?</span></div>
        <div class="closet-copy">
          <p>Swipe your badge for one random cosmetic. Duplicates refund RVUs.</p>
          <button class="btn gold" data-act="pull" ${can ? '' : 'disabled'}>Open · ${PR.PULL_COST} RVU</button>
          ${can ? '' : `<p class="muted small-t">Solve the daily case to earn RVUs.</p>`}
        </div>
      </div>
      <table class="odds">
        <caption class="eyebrow">Drop rates</caption>
        <tr>${['C', 'R', 'E', 'L'].map((k) => `<th class="r-${k}">${PR.RARITY[k].name}</th>`).join('')}</tr>
        <tr>${['C', 'R', 'E', 'L'].map((k) => `<td>${odds[k]}%</td>`).join('')}</tr>
      </table>`;

    PR.SLOTS.forEach((slot) => {
      const items = PR.COLLECTIBLES.filter((c) => c.slot === slot.id);
      h += `<h2 class="sub">${slot.name}</h2><div class="grid">`;
      items.forEach((it) => {
        const own = !!S.owned[it.id];
        h += `<div class="tile r-${it.rarity} ${own ? '' : 'unowned'}" title="${own ? esc(it.flavor) : 'Not found yet'}">
          ${own ? spriteHTML(withItem(it), '', it.name) : '<span class="q">?</span>'}
          <span class="iname">${own ? esc(it.name) : '???'}</span>
          <span class="rar">${PR.RARITY[it.rarity].name}</span>
        </div>`;
      });
      h += '</div>';
    });

    const el = $('#view-closet');
    el.innerHTML = h;
    paintSprites(el);
  }

  function pull() {
    if (S.rvu < PR.PULL_COST) { toast(`You need ${PR.PULL_COST} RVUs`); return; }
    S.rvu -= PR.PULL_COST;
    S.pulls += 1;
    const item = PR.rollItem(S.perks.supply || 0);
    const dup = !!S.owned[item.id];
    let refund = 0;
    if (dup) { refund = PR.RARITY[item.rarity].refund; S.rvu += refund; } else { S.owned[item.id] = true; }
    persist();
    renderHUD();
    renderCloset();

    const reveal = `
      <div class="gacha r-${item.rarity}">
        <p class="eyebrow rar-label">${PR.RARITY[item.rarity].name}</p>
        ${spriteHTML(withItem(item), 'xl pix glow', item.name)}
        <h2 class="big">${esc(item.name)}</h2>
        <p class="muted">${esc(item.flavor)}</p>
        ${dup ? `<p class="chip center">${icon('coin')}<b>+${refund}</b><small>RVU refund for a duplicate</small></p>` : '<p class="new-tag">New!</p>'}
        <div class="row center">
          <button class="btn" data-act="equip" data-slot="${item.slot}" data-id="${item.id}" data-close data-autofocus>${S.look[item.slot] === item.id ? 'Equipped' : 'Equip'}</button>
          <button class="btn dark" data-close>Keep</button>
        </div>
      </div>`;

    queueModal(`<div class="gacha-shake"><div class="crate big-crate shaking r-${item.rarity}"><span>?</span></div><p class="eyebrow">Unlocking…</p></div>`, (card) => {
      setTimeout(() => { card.innerHTML = reveal; paintSprites(card); const b = card.querySelector('[data-autofocus]'); if (b) b.focus(); }, reduceMotion ? 150 : 1100);
    });
  }

  // ---------- Training ----------
  function renderTraining() {
    let h = `
      <div class="section-head"><h1 class="title">Training</h1><span class="chip">${icon('cme')}<b>${S.cme}</b><small>CME</small></span></div>
      <p class="muted lede">Every level-up earns CME credit (2 on every fifth level). Perks change how the daily case plays.</p>
      <div class="perks">`;
    PR.PERKS.forEach((p) => {
      const lvl = p.consumable ? S.freezes : S.perks[p.id] || 0;
      const cap = p.consumable ? p.hold : p.max;
      const cost = perkCost(p);
      const pips = Array.from({ length: cap }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('');
      const label = cost == null ? (p.consumable ? 'Full' : 'Maxed') : `${p.consumable ? 'Buy' : 'Train'} · ${cost} CME`;
      h += `<div class="perk pix">
        <div class="perk-main">
          <div class="perk-top"><h2 class="perk-name">${p.name}</h2><span class="pips" aria-label="${lvl} of ${cap}">${pips}</span></div>
          <p>${esc(p.desc(lvl))}</p>
          ${p.consumable ? `<p class="muted small-t">Holding ${S.freezes} of ${p.hold}</p>` : ''}
        </div>
        <button class="btn small" data-act="train" data-id="${p.id}" ${cost != null && S.cme >= cost ? '' : 'disabled'}>${label}</button>
      </div>`;
    });
    h += '</div>';
    $('#view-training').innerHTML = h;
  }

  function train(id) {
    const p = PR.PERK[id];
    const cost = perkCost(p);
    if (cost == null || S.cme < cost) return;
    S.cme -= cost;
    if (p.consumable) S.freezes += 1;
    else S.perks[id] = (S.perks[id] || 0) + 1;
    persist();
    renderTraining();
    renderHUD();
    toast(`${p.name} ${p.consumable ? 'added' : 'upgraded'}`);
  }

  // ---------- About ----------
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  function installHint() {
    if (isStandalone()) return '';
    if (installEvent) return '<button class="btn small" data-act="install">Install app</button>';
    if (isIOS) return '<p class="muted small-t">To install on iPhone: tap Share, then Add to Home Screen.</p>';
    return '<p class="muted small-t">To install: open your browser menu and choose Install app or Add to Home Screen.</p>';
  }
  function openAbout() {
    queueModal(`<div class="about">
      <p class="eyebrow">About</p>
      <h2 class="big">Pixel Rounds</h2>
      <p>One new Step 1 case every day. Diagnose it in as few clues as you can, level up your doctor, and collect gear along the way.</p>
      <p class="legal pix">${esc(DISCLAIMER)}</p>
      <p class="muted small-t">Your progress is saved in this browser on this device. Clearing site data resets it.</p>
      ${installHint()}
      <p class="muted small-t">Version ${esc(PR.CONFIG.version)} · ${PR.CASES.length} cases</p>
      <div class="row center"><button class="btn" data-close data-autofocus>Close</button></div>
    </div>`);
  }
  async function promptInstall() {
    if (!installEvent) { openAbout(); return; }
    installEvent.prompt();
    try { await installEvent.userChoice; } catch (e) { /* ignore */ }
    installEvent = null;
    closeModal();
    renderTitleFoot();
  }

  // ---------- Navigation ----------
  const VIEWS = ['rounds', 'stats', 'locker', 'closet', 'training', 'archive'];
  function go(v) {
    view = v;
    VIEWS.forEach((k) => { $('#view-' + k).hidden = k !== v; });
    const tabView = v === 'archive' ? 'stats' : v;
    $$('#tabs .tab').forEach((t) => {
      if (t.dataset.view === tabView) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    if (v === 'rounds') renderRounds();
    if (v === 'stats') renderStats();
    if (v === 'archive') renderArchive();
    if (v === 'locker') renderLocker();
    if (v === 'closet') renderCloset();
    if (v === 'training') renderTraining();
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act], [data-close], .tab');
    if (!b) return;
    if (b.classList.contains('tab')) {
      if (b.dataset.view === 'rounds' && view === 'rounds' && mode !== 'daily') { backToDaily(); return; }
      go(b.dataset.view);
      return;
    }
    const act = b.dataset.act;
    if (act !== 'reset' && resetArmed) resetArmed = false;
    switch (act) {
      case 'goto': go(b.dataset.view); break;
      case 'consult': useConsult(); break;
      case 'mnemonic': useMnemonic(); break;
      case 'practice': startPractice(); break;
      case 'archive-play': startArchive(Number(b.dataset.day)); break;
      case 'back-daily': backToDaily(); break;
      case 'share': shareResult(); break;
      case 'report': openReport(); break;
      case 'send-report': sendReport(Number(b.dataset.case)); break;
      case 'about': openAbout(); break;
      case 'install': promptInstall(); break;
      case 'pull': pull(); break;
      case 'train': train(b.dataset.id); break;
      case 'look': {
        const k = b.dataset.k;
        S.look[k] = k === 'hair' ? b.dataset.v : Number(b.dataset.v);
        persist(); renderLocker(); renderHUD();
        break;
      }
      case 'equip': {
        const id = b.dataset.id || null;
        if (id && !PR.owns(S, id)) break;
        S.look[b.dataset.slot] = id;
        persist(); renderHUD();
        if (view === 'locker') renderLocker();
        if (view === 'closet') renderCloset();
        break;
      }
      case 'reset':
        if (!resetArmed) { resetArmed = true; renderLocker(); }
        else {
          PR.wipe(); S = PR.defaultState(); persist();
          resetArmed = false; mode = 'daily'; side = null;
          renderHUD(); go('rounds'); toast('Progress erased');
          showOpening();
        }
        break;
      case 'start': {
        const n = $('#intro-name');
        if (n && n.value.trim()) S.name = PR.cleanName(n.value);
        S.seenIntro = true; persist(); renderHUD();
        break;
      }
    }
    if (b.hasAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#modal').hidden) closeModal();
    if (e.key === 'Enter' && e.target.id === 'intro-name') { e.preventDefault(); $('[data-act="start"]').click(); }
  });

  // ---------- First-run intro ----------
  function intro() {
    queueModal(`<div class="intro">
      <p class="eyebrow">How rounds work</p>
      ${spriteHTML(S.look, 'xl pix', 'Your doctor')}
      <ol class="how">
        <li>One new Step 1 case every day. You start with one clue.</li>
        <li>Each wrong diagnosis reveals the next clue. <span class="y">Yellow</span> means right organ system.</li>
        <li>Solve in fewer guesses for more <b>XP</b> and <b>RVUs</b>.</li>
        <li>Spend RVUs in the <b>Supply Closet</b> on cosmetics. Level up to earn <b>CME</b> for perks and climb from Pre-Med to Department Chair.</li>
      </ol>
      <p class="muted">You start with ${PR.PULL_COST} RVUs, enough for one closet pull.</p>
      <div class="intro-name">
        <label class="eyebrow" for="intro-name">Name on your badge</label>
        <input id="intro-name" class="pix" type="text" maxlength="18" placeholder="Your name" autocomplete="off" data-autofocus>
      </div>
      <div class="row center"><button class="btn" data-act="start" data-close>Start rounds</button></div>
      <p class="legal-mini">Not affiliated with USMLE, NBME, or FSMB. Not medical advice.</p>
    </div>`);
  }

  // ---------- Opening sequence ----------
  const LOGO = 'PIXEL ROUNDS';
  function logoHTML(cls) {
    let i = 0;
    return `<h1 class="logo ${cls || ''}" aria-label="Pixel Rounds">${LOGO.split(' ').map((w) =>
      `<span class="logo-word">${w.split('').map((ch) => `<span class="lt" style="--i:${i++}">${ch}</span>`).join('')}</span>`).join('')}</h1>`;
  }
  let openingTimer = null;
  function showOpening() {
    const el = $('#opening');
    el.hidden = false;
    document.body.classList.add('opening-on');
    if (reduceMotion) { showTitle(); return; }
    el.className = 'opening phase-splash';
    el.innerHTML = `
      <div class="splash">
        <svg class="ecg" viewBox="0 0 320 80" aria-hidden="true" shape-rendering="crispEdges">
          <path d="M0 44 H96 L104 44 L110 34 L116 44 L124 44 L130 8 L138 70 L146 44 L170 44 L178 30 L190 44 H320" />
        </svg>
        ${logoHTML('logo-splash')}
        <p class="splash-sub">A daily Step 1 case</p>
        <p class="skip">Tap to skip</p>
      </div>`;
    clearTimeout(openingTimer);
    openingTimer = setTimeout(showTitle, 3000);
  }
  function showTitle() {
    clearTimeout(openingTimer);
    const el = $('#opening');
    el.className = 'opening phase-title';
    const d = dailySession();
    const status = d.done
      ? `Case #${TODAY + 1} ${d.won ? 'solved' : 'closed'} · next in <span class="js-countdown">${fmtCountdown()}</span>`
      : `Case #${TODAY + 1} is ready`;
    el.innerHTML = `
      <div class="title-screen">
        ${logoHTML('logo-title')}
        <p class="ts-tag">One Step 1 case a day</p>
        <div class="ts-stage">
          ${spriteHTML(S.look, 'xl bob', 'Your doctor')}
          <span class="ts-shadow" aria-hidden="true"></span>
        </div>
        <p class="ts-who">${S.seenIntro ? `${esc(PR.displayName(S))} · ${esc(PR.titleFor(S.level).title)} · LV ${S.level}` : 'New intern on the floor'}</p>
        <p class="ts-status">${status}${S.streak ? ` · ${icon('flame')} ${S.streak}` : ''}</p>
        <button class="press" data-start>Tap to start</button>
        <div class="ts-foot" id="ts-foot"></div>
        <p class="ts-legal">Not affiliated with the USMLE, NBME, or FSMB. For study only, not medical advice.</p>
      </div>`;
    paintSprites(el);
    renderTitleFoot();
    const p = $('.press', el);
    if (p) p.focus({ preventScroll: true });
  }
  function renderTitleFoot() {
    const f = $('#ts-foot');
    if (!f) return;
    f.innerHTML = `<button class="btn small dark" data-act="about">About</button>${installEvent && !isStandalone() ? '<button class="btn small" data-act="install">Install app</button>' : ''}`;
  }
  function dismissOpening() {
    const el = $('#opening');
    if (el.hidden) return;
    el.classList.add('leaving');
    setTimeout(() => {
      el.hidden = true;
      el.innerHTML = '';
      el.className = 'opening';
      document.body.classList.remove('opening-on');
      if (!S.seenIntro) intro();
      else { const g = $('#guess'); if (g && !window.matchMedia('(pointer: coarse)').matches) g.focus(); }
    }, reduceMotion ? 0 : 260);
  }
  $('#opening').addEventListener('click', (e) => {
    if (e.target.closest('[data-act]')) return; // About / Install buttons
    const el = $('#opening');
    if (el.classList.contains('phase-splash')) showTitle();
    else dismissOpening();
  });
  document.addEventListener('keydown', (e) => {
    const el = $('#opening');
    if (el.hidden || !$('#modal').hidden) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (el.classList.contains('phase-splash')) showTitle(); else dismissOpening();
    }
  });

  // ---------- Install + offline ----------
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installEvent = e;
    renderTitleFoot();
  });
  window.addEventListener('appinstalled', () => { installEvent = null; toast('Installed. Find Pixel Rounds on your home screen.'); });
  function registerSW() {
    const secure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (!('serviceWorker' in navigator) || !secure || /claude/.test(location.host)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => { /* offline support is optional */ });
  }

  // ---------- Boot ----------
  function boot() {
    const up = PR.upkeepStreak(S, TODAY);
    persist();
    renderHUD();
    go('rounds');
    showOpening();
    if (up && up.covered) toast(`Call Coverage saved your streak (${up.covered} day${up.covered > 1 ? 's' : ''})`);
    else if (up && up.lost) toast(`Streak of ${up.lost} ended. New day, new case.`);
    setInterval(() => {
      tickCountdown();
      if (PR.todayIndex() !== TODAY) location.reload();
    }, 1000);
    registerSW();
  }

  boot();
})();
