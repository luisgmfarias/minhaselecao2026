// ─── Position types ───────────────────────────────────────────────────────────

export type PositionGroup =
  | "Goleiros"
  | "Zagueiros"
  | "Laterais Direitos"
  | "Laterais Esquerdos"
  | "Meio-Campistas"
  | "Atacantes";

// ─── Player ───────────────────────────────────────────────────────────────────

export interface Player {
  id: string;
  name: string;
  position: PositionGroup;
  club: string;
  countryClub?: string;
  image?: string;
  isSpeculated?: boolean;
  age?: number;
  caps?: number;
  tags?: string[];
}

// ─── Squad ────────────────────────────────────────────────────────────────────

export interface SquadState {
  selectedIds: string[];
}

export interface SquadValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ─── Match ────────────────────────────────────────────────────────────────────

export type MatchPhase =
  | "Fase de Grupos"
  | "Oitavas de Final"
  | "Quartas de Final"
  | "Semifinal"
  | "Disputa de 3º lugar"
  | "Final";

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag?: string;
  awayFlag?: string;
  phase: MatchPhase;
  group?: string;
  kickoff?: string; // ISO date string
  stadium?: string;
  city?: string;
  country?: string;
  isBrazilMatch: boolean;
  isKnockout?: boolean;
}

// ─── Simulation ───────────────────────────────────────────────────────────────

export type SimulationMode = "simple" | "advanced";

export type MatchOutcome = "home" | "away" | "draw";

export interface SimpleResult {
  mode: "simple";
  outcome: MatchOutcome;
}

export interface AdvancedResult {
  mode: "advanced";
  homeScore: number;
  awayScore: number;
  outcome: MatchOutcome; // derived
  penaltiesWinner?: "home" | "away";
}

export type MatchResult = SimpleResult | AdvancedResult;

export interface SimulatorState {
  mode: SimulationMode;
  results: Record<string, MatchResult>; // matchId -> result
}

// ─── Team standing ────────────────────────────────────────────────────────────

export interface TeamStanding {
  teamId: string;
  teamName: string;
  teamFlag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

// ─── Campaign summary ─────────────────────────────────────────────────────────

export interface CampaignStats {
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  stageReached?: string;
}

// ─── Lineup ───────────────────────────────────────────────────────────────────

export interface LineupAssignment {
  formation: string; // e.g. "4-3-3"
  slots: Record<string, string>; // slotId → playerId (only filled slots)
}

// ─── Share ────────────────────────────────────────────────────────────────────

export interface SharePayload {
  squad?: string[]; // player ids
  results?: Record<string, MatchResult>;
  mode?: SimulationMode;
  lineup?: LineupAssignment;
}

export interface SerializedResult {
  o?: MatchOutcome; // simple
  h?: number; // homeScore advanced
  a?: number; // awayScore advanced
}
