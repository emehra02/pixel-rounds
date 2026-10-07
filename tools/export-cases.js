// Regenerates CASES_REVIEW.md from js/cases.js so reviewers see exactly what ships.
// Usage: node tools/export-cases.js
const fs = require('fs');
const path = require('path');

global.window = {};
require(path.join(__dirname, '..', 'js', 'cases.js'));
const PR = window.PR;

const bySystem = {};
PR.CASES.forEach((c, i) => {
  (bySystem[c.system] = bySystem[c.system] || []).push({ c, n: i + 1 });
});

let md = `# Pixel Rounds case review\n\n`;
md += `${PR.CASES.length} cases across ${Object.keys(bySystem).length} systems. Each case shows 6 clues, revealed in order from vague to specific, then the pearl shown after the case ends.\n\n`;
md += `**What to check for each case**\n\n`;
md += `- The answer is correct and is the single best answer for the full set of clues.\n`;
md += `- Clues are medically accurate and get more specific from 1 to 6.\n`;
md += `- Clue 1 or 2 doesn't give the answer away.\n`;
md += `- The pearl is accurate and high-yield.\n\n`;
md += `Mark each case: ✅ OK · ✏️ Edit (write the fix) · ❌ Cut\n\n`;
md += `Case numbers match the order in \`js/cases.js\`. They are not the daily schedule order, which is shuffled.\n\n`;
md += `## Contents\n\n`;
PR.SYSTEMS.forEach((s) => {
  if (bySystem[s]) md += `- ${s} (${bySystem[s].length})\n`;
});
md += `\n`;

PR.SYSTEMS.forEach((s) => {
  const list = bySystem[s];
  if (!list) return;
  md += `---\n\n## ${s}\n\n`;
  list.forEach(({ c, n }) => {
    md += `### ${n}. ${c.answer}\n\n`;
    if (c.aliases && c.aliases.length) md += `*Also accepted:* ${c.aliases.join(', ')}\n\n`;
    c.clues.forEach((cl, i) => { md += `${i + 1}. ${cl}\n`; });
    md += `\n**Pearl:** ${c.pearl}\n\n`;
    md += `**Review:** ☐ ✅ OK  ☐ ✏️ Edit  ☐ ❌ Cut  \nNotes:\n\n`;
  });
});

fs.writeFileSync(path.join(__dirname, '..', 'CASES_REVIEW.md'), md);
console.log(`Wrote CASES_REVIEW.md with ${PR.CASES.length} cases`);
