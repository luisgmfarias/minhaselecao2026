import type { MatchResult } from "@/types";
import { computeGroupStandings, getBestThirdPlaceTeams } from "./standingsUtils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TeamSlotSource =
  | { kind: "group_rank"; group: string; rank: 1 | 2 }
  | { kind: "best_third"; rank: number }
  | { kind: "match_winner"; matchId: string }
  | { kind: "match_loser"; matchId: string };

export interface KnockoutMatchDef {
  id: string;
  phaseLabel: string;
  slot1: TeamSlotSource;
  slot2: TeamSlotSource;
  bracketHalf: "top" | "bottom";
  bracketColumn: number;
  bracketRow: number;
  isKnockout: true;
}

// ─── Bracket definition ───────────────────────────────────────────────────────

export const KNOCKOUT_MATCHES: KnockoutMatchDef[] = [
  // ── R32 top half (bracketColumn=0) ──────────────────────────────────────────
  {
    id: "r32-1",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "group_rank", group: "A", rank: 1 },
    slot2: { kind: "group_rank", group: "B", rank: 2 },
    bracketHalf: "top",
    bracketColumn: 0,
    bracketRow: 0,
    isKnockout: true,
  },
  {
    id: "r32-2",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "group_rank", group: "C", rank: 1 },
    slot2: { kind: "group_rank", group: "D", rank: 2 },
    bracketHalf: "top",
    bracketColumn: 0,
    bracketRow: 1,
    isKnockout: true,
  },
  {
    id: "r32-3",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "group_rank", group: "E", rank: 1 },
    slot2: { kind: "group_rank", group: "F", rank: 2 },
    bracketHalf: "top",
    bracketColumn: 0,
    bracketRow: 2,
    isKnockout: true,
  },
  {
    id: "r32-4",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "group_rank", group: "G", rank: 1 },
    slot2: { kind: "group_rank", group: "H", rank: 2 },
    bracketHalf: "top",
    bracketColumn: 0,
    bracketRow: 3,
    isKnockout: true,
  },
  {
    id: "r32-5",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "group_rank", group: "B", rank: 1 },
    slot2: { kind: "group_rank", group: "A", rank: 2 },
    bracketHalf: "top",
    bracketColumn: 0,
    bracketRow: 4,
    isKnockout: true,
  },
  {
    id: "r32-6",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "group_rank", group: "D", rank: 1 },
    slot2: { kind: "group_rank", group: "C", rank: 2 },
    bracketHalf: "top",
    bracketColumn: 0,
    bracketRow: 5,
    isKnockout: true,
  },
  {
    id: "r32-7",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "group_rank", group: "F", rank: 1 },
    slot2: { kind: "group_rank", group: "E", rank: 2 },
    bracketHalf: "top",
    bracketColumn: 0,
    bracketRow: 6,
    isKnockout: true,
  },
  {
    id: "r32-8",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "group_rank", group: "H", rank: 1 },
    slot2: { kind: "group_rank", group: "G", rank: 2 },
    bracketHalf: "top",
    bracketColumn: 0,
    bracketRow: 7,
    isKnockout: true,
  },
  // ── R32 bottom half ──────────────────────────────────────────────────────────
  {
    id: "r32-9",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "group_rank", group: "I", rank: 1 },
    slot2: { kind: "group_rank", group: "J", rank: 2 },
    bracketHalf: "bottom",
    bracketColumn: 0,
    bracketRow: 0,
    isKnockout: true,
  },
  {
    id: "r32-10",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "group_rank", group: "K", rank: 1 },
    slot2: { kind: "group_rank", group: "L", rank: 2 },
    bracketHalf: "bottom",
    bracketColumn: 0,
    bracketRow: 1,
    isKnockout: true,
  },
  {
    id: "r32-11",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "group_rank", group: "J", rank: 1 },
    slot2: { kind: "group_rank", group: "I", rank: 2 },
    bracketHalf: "bottom",
    bracketColumn: 0,
    bracketRow: 2,
    isKnockout: true,
  },
  {
    id: "r32-12",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "group_rank", group: "L", rank: 1 },
    slot2: { kind: "group_rank", group: "K", rank: 2 },
    bracketHalf: "bottom",
    bracketColumn: 0,
    bracketRow: 3,
    isKnockout: true,
  },
  {
    id: "r32-13",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "best_third", rank: 1 },
    slot2: { kind: "best_third", rank: 2 },
    bracketHalf: "bottom",
    bracketColumn: 0,
    bracketRow: 4,
    isKnockout: true,
  },
  {
    id: "r32-14",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "best_third", rank: 3 },
    slot2: { kind: "best_third", rank: 4 },
    bracketHalf: "bottom",
    bracketColumn: 0,
    bracketRow: 5,
    isKnockout: true,
  },
  {
    id: "r32-15",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "best_third", rank: 5 },
    slot2: { kind: "best_third", rank: 6 },
    bracketHalf: "bottom",
    bracketColumn: 0,
    bracketRow: 6,
    isKnockout: true,
  },
  {
    id: "r32-16",
    phaseLabel: "Oitavas de Final (R32)",
    slot1: { kind: "best_third", rank: 7 },
    slot2: { kind: "best_third", rank: 8 },
    bracketHalf: "bottom",
    bracketColumn: 0,
    bracketRow: 7,
    isKnockout: true,
  },
  // ── R16 top half (bracketColumn=1) ──────────────────────────────────────────
  {
    id: "r16-1",
    phaseLabel: "Oitavas de Final",
    slot1: { kind: "match_winner", matchId: "r32-1" },
    slot2: { kind: "match_winner", matchId: "r32-2" },
    bracketHalf: "top",
    bracketColumn: 1,
    bracketRow: 0,
    isKnockout: true,
  },
  {
    id: "r16-2",
    phaseLabel: "Oitavas de Final",
    slot1: { kind: "match_winner", matchId: "r32-3" },
    slot2: { kind: "match_winner", matchId: "r32-4" },
    bracketHalf: "top",
    bracketColumn: 1,
    bracketRow: 1,
    isKnockout: true,
  },
  {
    id: "r16-3",
    phaseLabel: "Oitavas de Final",
    slot1: { kind: "match_winner", matchId: "r32-5" },
    slot2: { kind: "match_winner", matchId: "r32-6" },
    bracketHalf: "top",
    bracketColumn: 1,
    bracketRow: 2,
    isKnockout: true,
  },
  {
    id: "r16-4",
    phaseLabel: "Oitavas de Final",
    slot1: { kind: "match_winner", matchId: "r32-7" },
    slot2: { kind: "match_winner", matchId: "r32-8" },
    bracketHalf: "top",
    bracketColumn: 1,
    bracketRow: 3,
    isKnockout: true,
  },
  // ── R16 bottom half ──────────────────────────────────────────────────────────
  {
    id: "r16-5",
    phaseLabel: "Oitavas de Final",
    slot1: { kind: "match_winner", matchId: "r32-9" },
    slot2: { kind: "match_winner", matchId: "r32-10" },
    bracketHalf: "bottom",
    bracketColumn: 1,
    bracketRow: 0,
    isKnockout: true,
  },
  {
    id: "r16-6",
    phaseLabel: "Oitavas de Final",
    slot1: { kind: "match_winner", matchId: "r32-11" },
    slot2: { kind: "match_winner", matchId: "r32-12" },
    bracketHalf: "bottom",
    bracketColumn: 1,
    bracketRow: 1,
    isKnockout: true,
  },
  {
    id: "r16-7",
    phaseLabel: "Oitavas de Final",
    slot1: { kind: "match_winner", matchId: "r32-13" },
    slot2: { kind: "match_winner", matchId: "r32-14" },
    bracketHalf: "bottom",
    bracketColumn: 1,
    bracketRow: 2,
    isKnockout: true,
  },
  {
    id: "r16-8",
    phaseLabel: "Oitavas de Final",
    slot1: { kind: "match_winner", matchId: "r32-15" },
    slot2: { kind: "match_winner", matchId: "r32-16" },
    bracketHalf: "bottom",
    bracketColumn: 1,
    bracketRow: 3,
    isKnockout: true,
  },
  // ── QF top half (bracketColumn=2) ───────────────────────────────────────────
  {
    id: "qf-1",
    phaseLabel: "Quartas de Final",
    slot1: { kind: "match_winner", matchId: "r16-1" },
    slot2: { kind: "match_winner", matchId: "r16-2" },
    bracketHalf: "top",
    bracketColumn: 2,
    bracketRow: 0,
    isKnockout: true,
  },
  {
    id: "qf-2",
    phaseLabel: "Quartas de Final",
    slot1: { kind: "match_winner", matchId: "r16-3" },
    slot2: { kind: "match_winner", matchId: "r16-4" },
    bracketHalf: "top",
    bracketColumn: 2,
    bracketRow: 1,
    isKnockout: true,
  },
  // ── QF bottom half ───────────────────────────────────────────────────────────
  {
    id: "qf-3",
    phaseLabel: "Quartas de Final",
    slot1: { kind: "match_winner", matchId: "r16-5" },
    slot2: { kind: "match_winner", matchId: "r16-6" },
    bracketHalf: "bottom",
    bracketColumn: 2,
    bracketRow: 0,
    isKnockout: true,
  },
  {
    id: "qf-4",
    phaseLabel: "Quartas de Final",
    slot1: { kind: "match_winner", matchId: "r16-7" },
    slot2: { kind: "match_winner", matchId: "r16-8" },
    bracketHalf: "bottom",
    bracketColumn: 2,
    bracketRow: 1,
    isKnockout: true,
  },
  // ── SF (bracketColumn=3) ─────────────────────────────────────────────────────
  {
    id: "sf-1",
    phaseLabel: "Semifinal",
    slot1: { kind: "match_winner", matchId: "qf-1" },
    slot2: { kind: "match_winner", matchId: "qf-2" },
    bracketHalf: "top",
    bracketColumn: 3,
    bracketRow: 0,
    isKnockout: true,
  },
  {
    id: "sf-2",
    phaseLabel: "Semifinal",
    slot1: { kind: "match_winner", matchId: "qf-3" },
    slot2: { kind: "match_winner", matchId: "qf-4" },
    bracketHalf: "bottom",
    bracketColumn: 3,
    bracketRow: 0,
    isKnockout: true,
  },
  // ── 3rd place ────────────────────────────────────────────────────────────────
  {
    id: "ko-3rd",
    phaseLabel: "Disputa de 3º lugar",
    slot1: { kind: "match_loser", matchId: "sf-1" },
    slot2: { kind: "match_loser", matchId: "sf-2" },
    bracketHalf: "bottom",
    bracketColumn: 4,
    bracketRow: 1,
    isKnockout: true,
  },
  // ── Final (bracketColumn=4) ──────────────────────────────────────────────────
  {
    id: "ko-final",
    phaseLabel: "Final",
    slot1: { kind: "match_winner", matchId: "sf-1" },
    slot2: { kind: "match_winner", matchId: "sf-2" },
    bracketHalf: "top",
    bracketColumn: 4,
    bracketRow: 0,
    isKnockout: true,
  },
];

// ─── Resolve team ─────────────────────────────────────────────────────────────

export function resolveTeam(
  source: TeamSlotSource,
  results: Record<string, MatchResult>
): { name: string; flag: string } | null {
  if (source.kind === "group_rank") {
    const standings = computeGroupStandings(source.group, results);
    const team = standings[source.rank - 1];
    if (!team) return null;
    return { name: team.teamName, flag: team.teamFlag };
  }

  if (source.kind === "best_third") {
    const best = getBestThirdPlaceTeams(results);
    const team = best[source.rank - 1];
    if (!team) return null;
    return { name: team.teamName, flag: team.teamFlag };
  }

  if (source.kind === "match_winner") {
    const winner = getMatchWinner(source.matchId, results);
    if (!winner) return null;
    return { name: winner.name, flag: winner.flag };
  }

  if (source.kind === "match_loser") {
    const loser = getMatchLoser(source.matchId, results);
    if (!loser) return null;
    return { name: loser.name, flag: loser.flag };
  }

  return null;
}

// ─── Get match winner ─────────────────────────────────────────────────────────

export function getMatchWinner(
  matchId: string,
  results: Record<string, MatchResult>
): { name: string; flag: string; isHome: boolean } | null {
  const result = results[matchId];
  if (!result) return null;

  const matchDef = KNOCKOUT_MATCHES.find((m) => m.id === matchId);
  if (!matchDef) return null;

  const homeTeam = resolveTeam(matchDef.slot1, results);
  const awayTeam = resolveTeam(matchDef.slot2, results);

  if (result.mode === "simple") {
    if (result.outcome === "home") {
      if (!homeTeam) return null;
      return { ...homeTeam, isHome: true };
    }
    if (result.outcome === "away") {
      if (!awayTeam) return null;
      return { ...awayTeam, isHome: false };
    }
    // draw — no winner in knockout
    return null;
  }

  // advanced mode
  if (result.homeScore > result.awayScore) {
    if (!homeTeam) return null;
    return { ...homeTeam, isHome: true };
  }
  if (result.awayScore > result.homeScore) {
    if (!awayTeam) return null;
    return { ...awayTeam, isHome: false };
  }

  // Equal score: use penaltiesWinner
  if (result.penaltiesWinner === "home") {
    if (!homeTeam) return null;
    return { ...homeTeam, isHome: true };
  }
  if (result.penaltiesWinner === "away") {
    if (!awayTeam) return null;
    return { ...awayTeam, isHome: false };
  }

  return null;
}

// ─── Get match loser ──────────────────────────────────────────────────────────

function getMatchLoser(
  matchId: string,
  results: Record<string, MatchResult>
): { name: string; flag: string; isHome: boolean } | null {
  const result = results[matchId];
  if (!result) return null;

  const matchDef = KNOCKOUT_MATCHES.find((m) => m.id === matchId);
  if (!matchDef) return null;

  const homeTeam = resolveTeam(matchDef.slot1, results);
  const awayTeam = resolveTeam(matchDef.slot2, results);

  if (result.mode === "simple") {
    if (result.outcome === "home") {
      if (!awayTeam) return null;
      return { ...awayTeam, isHome: false };
    }
    if (result.outcome === "away") {
      if (!homeTeam) return null;
      return { ...homeTeam, isHome: true };
    }
    return null;
  }

  // advanced mode
  if (result.homeScore > result.awayScore) {
    if (!awayTeam) return null;
    return { ...awayTeam, isHome: false };
  }
  if (result.awayScore > result.homeScore) {
    if (!homeTeam) return null;
    return { ...homeTeam, isHome: true };
  }

  // Equal score: loser is whoever didn't win on penalties
  if (result.penaltiesWinner === "home") {
    if (!awayTeam) return null;
    return { ...awayTeam, isHome: false };
  }
  if (result.penaltiesWinner === "away") {
    if (!homeTeam) return null;
    return { ...homeTeam, isHome: true };
  }

  return null;
}
