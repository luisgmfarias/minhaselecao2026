import { GROUPS, generateGroupMatches } from "@/data/groups";
import type { MatchResult, TeamStanding } from "@/types";

// ─── Compute group standings ───────────────────────────────────────────────────

export function computeGroupStandings(
  groupId: string,
  results: Record<string, MatchResult>
): TeamStanding[] {
  const group = GROUPS.find((g) => g.id === groupId);
  if (!group) return [];

  const allGroupMatches = generateGroupMatches().filter(
    (m) => m.group === groupId
  );

  // Initialize standings for each team
  const standingMap: Record<string, TeamStanding> = {};
  for (const team of group.teams) {
    standingMap[team.id] = {
      teamId: team.id,
      teamName: team.name,
      teamFlag: team.flag,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    };
  }

  for (const match of allGroupMatches) {
    const result = results[match.id];
    if (!result) continue;

    // Find the team objects
    const homeTeamDef = group.teams.find((t) => t.name === match.homeTeam);
    const awayTeamDef = group.teams.find((t) => t.name === match.awayTeam);
    if (!homeTeamDef || !awayTeamDef) continue;

    const homeStanding = standingMap[homeTeamDef.id];
    const awayStanding = standingMap[awayTeamDef.id];
    if (!homeStanding || !awayStanding) continue;

    homeStanding.played++;
    awayStanding.played++;

    if (result.mode === "advanced") {
      const hg = result.homeScore;
      const ag = result.awayScore;
      homeStanding.goalsFor += hg;
      homeStanding.goalsAgainst += ag;
      awayStanding.goalsFor += ag;
      awayStanding.goalsAgainst += hg;
    }

    const outcome = result.outcome;
    if (outcome === "home") {
      homeStanding.won++;
      homeStanding.points += 3;
      awayStanding.lost++;
    } else if (outcome === "away") {
      awayStanding.won++;
      awayStanding.points += 3;
      homeStanding.lost++;
    } else {
      homeStanding.drawn++;
      homeStanding.points += 1;
      awayStanding.drawn++;
      awayStanding.points += 1;
    }
  }

  // Compute goal diffs
  const standings = Object.values(standingMap).map((s) => ({
    ...s,
    goalDiff: s.goalsFor - s.goalsAgainst,
  }));

  // Sort: pts desc → goalDiff desc → goalsFor desc → name asc
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName, "pt-BR");
  });

  return standings;
}

// ─── Get group qualifiers ──────────────────────────────────────────────────────

export function getGroupQualifiers(
  groupId: string,
  results: Record<string, MatchResult>,
  n: number
): TeamStanding[] {
  const standings = computeGroupStandings(groupId, results);
  return standings.slice(0, n);
}

// ─── Get best 3rd-place teams ──────────────────────────────────────────────────

export function getBestThirdPlaceTeams(
  results: Record<string, MatchResult>
): TeamStanding[] {
  const thirdPlaceTeams: TeamStanding[] = [];

  for (const group of GROUPS) {
    const standings = computeGroupStandings(group.id, results);
    if (standings.length >= 3) {
      thirdPlaceTeams.push(standings[2]);
    }
  }

  // Sort best third-place teams: pts desc → goalDiff desc → goalsFor desc → name asc
  thirdPlaceTeams.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName, "pt-BR");
  });

  return thirdPlaceTeams.slice(0, 8);
}
