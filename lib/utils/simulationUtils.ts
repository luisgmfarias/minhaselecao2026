import type { MatchResult, MatchOutcome, CampaignStats } from "@/types";
import { ALL_BRAZIL_MATCHES } from "@/data/matches";

export function outcomeFromScores(home: number, away: number): MatchOutcome {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

export function getBrazilOutcome(
  matchId: string,
  result: MatchResult
): "win" | "draw" | "loss" | null {
  const match = ALL_BRAZIL_MATCHES.find((m) => m.id === matchId);
  if (!match) return null;
  const isBrazilHome = match.homeTeam === "Brasil";
  const { outcome } = result;
  if (outcome === "draw") return "draw";
  if (isBrazilHome && outcome === "home") return "win";
  if (!isBrazilHome && outcome === "away") return "win";
  return "loss";
}

export function computeCampaignStats(
  results: Record<string, MatchResult>
): CampaignStats {
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  for (const match of ALL_BRAZIL_MATCHES) {
    const result = results[match.id];
    if (!result) continue;

    const brazilResult = getBrazilOutcome(match.id, result);
    if (brazilResult === "win") wins++;
    else if (brazilResult === "draw") draws++;
    else if (brazilResult === "loss") losses++;

    if (result.mode === "advanced") {
      const isBrazilHome = match.homeTeam === "Brasil";
      goalsFor += isBrazilHome ? result.homeScore : result.awayScore;
      goalsAgainst += isBrazilHome ? result.awayScore : result.homeScore;
    }
  }

  return {
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDiff: goalsFor - goalsAgainst,
    points: wins * 3 + draws,
  };
}

export function formatScore(result: MatchResult, homeTeam: string): string {
  if (result.mode === "advanced") {
    return `${result.homeScore} x ${result.awayScore}`;
  }
  if (result.outcome === "draw") return "Empate";
  if (result.outcome === "home") return `${homeTeam} venceu`;
  return "Adversário venceu";
}
