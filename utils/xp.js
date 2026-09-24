function xpForLevel(level) {
  return 5 * (level ** 2) + 50 * level + 100;
}

function calculateLevel(xp) {
  let level = 0;
  let remaining = xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return level;
}

module.exports = { xpForLevel, calculateLevel };
