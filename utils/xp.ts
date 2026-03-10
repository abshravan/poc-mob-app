import { RANKS } from "@/constants";

/**
 * Calculate XP required for a given level.
 * Formula: 100 * level^1.5
 */
export function xpRequiredForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculate total XP needed to reach a level (cumulative).
 */
export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += xpRequiredForLevel(i);
  }
  return total;
}

/**
 * Given current total XP, determine the level.
 */
export function getLevelFromTotalXp(totalXp: number): number {
  let level = 1;
  let accumulated = 0;
  while (true) {
    const needed = xpRequiredForLevel(level);
    if (accumulated + needed > totalXp) break;
    accumulated += needed;
    level++;
  }
  return level;
}

/**
 * Get XP progress within the current level.
 */
export function getXpProgress(totalXp: number): {
  level: number;
  currentXp: number;
  xpNeeded: number;
  percentage: number;
} {
  const level = getLevelFromTotalXp(totalXp);
  let accumulated = 0;
  for (let i = 1; i < level; i++) {
    accumulated += xpRequiredForLevel(i);
  }
  const currentXp = totalXp - accumulated;
  const xpNeeded = xpRequiredForLevel(level);
  const percentage = Math.min((currentXp / xpNeeded) * 100, 100);
  return { level, currentXp, xpNeeded, percentage };
}

/**
 * Get rank title based on level.
 */
export function getRankTitle(level: number): string {
  let rank = RANKS[0].title;
  for (const r of RANKS) {
    if (level >= r.minLevel) rank = r.title;
  }
  return rank;
}

/**
 * Get rank color based on level.
 */
export function getRankColor(level: number): string {
  let color = RANKS[0].color;
  for (const r of RANKS) {
    if (level >= r.minLevel) color = r.color;
  }
  return color;
}
