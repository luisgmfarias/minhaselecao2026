import type { Match } from "@/types";

// 2026 FIFA World Cup — Brazil matches
// Brazil is in Group E: Brazil, Serbia, Colombia, Egypt (plausible draw scenario)

export const BRAZIL_GROUP_MATCHES: Match[] = [
  {
    id: "group-e-1",
    homeTeam: "Brasil",
    awayTeam: "Sérvia",
    homeFlag: "🇧🇷",
    awayFlag: "🇷🇸",
    phase: "Fase de Grupos",
    group: "E",
    kickoff: "2026-06-11T19:00:00-05:00",
    stadium: "MetLife Stadium",
    city: "Nova Jersey",
    country: "EUA",
    isBrazilMatch: true,
  },
  {
    id: "group-e-2",
    homeTeam: "Brasil",
    awayTeam: "Colômbia",
    homeFlag: "🇧🇷",
    awayFlag: "🇨🇴",
    phase: "Fase de Grupos",
    group: "E",
    kickoff: "2026-06-15T19:00:00-06:00",
    stadium: "SoFi Stadium",
    city: "Los Angeles",
    country: "EUA",
    isBrazilMatch: true,
  },
  {
    id: "group-e-3",
    homeTeam: "Brasil",
    awayTeam: "Egito",
    homeFlag: "🇧🇷",
    awayFlag: "🇪🇬",
    phase: "Fase de Grupos",
    group: "E",
    kickoff: "2026-06-20T16:00:00-05:00",
    stadium: "AT&T Stadium",
    city: "Dallas",
    country: "EUA",
    isBrazilMatch: true,
  },
];

export const BRAZIL_KNOCKOUT_MATCHES: Match[] = [
  {
    id: "r16-brazil",
    homeTeam: "Brasil",
    awayTeam: "2º do Grupo F",
    homeFlag: "🇧🇷",
    awayFlag: "🏳️",
    phase: "Oitavas de Final",
    kickoff: "2026-07-02T16:00:00-05:00",
    stadium: "Estadio Azteca",
    city: "Cidade do México",
    country: "México",
    isBrazilMatch: true,
  },
  {
    id: "qf-brazil",
    homeTeam: "Brasil",
    awayTeam: "Vencedor R16",
    homeFlag: "🇧🇷",
    awayFlag: "🏳️",
    phase: "Quartas de Final",
    kickoff: "2026-07-10T16:00:00-05:00",
    stadium: "Estadio Azteca",
    city: "Cidade do México",
    country: "México",
    isBrazilMatch: true,
  },
  {
    id: "sf-brazil",
    homeTeam: "Brasil",
    awayTeam: "Vencedor QF",
    homeFlag: "🇧🇷",
    awayFlag: "🏳️",
    phase: "Semifinal",
    kickoff: "2026-07-14T20:00:00-05:00",
    stadium: "MetLife Stadium",
    city: "Nova Jersey",
    country: "EUA",
    isBrazilMatch: true,
  },
  {
    id: "final-brazil",
    homeTeam: "Brasil",
    awayTeam: "Vencedor SF",
    homeFlag: "🇧🇷",
    awayFlag: "🏳️",
    phase: "Final",
    kickoff: "2026-07-19T17:00:00-05:00",
    stadium: "MetLife Stadium",
    city: "Nova Jersey",
    country: "EUA",
    isBrazilMatch: true,
  },
];

export const ALL_BRAZIL_MATCHES: Match[] = [
  ...BRAZIL_GROUP_MATCHES,
  ...BRAZIL_KNOCKOUT_MATCHES,
];

// ─── Phase display order ───────────────────────────────────────────────────────

export const PHASE_ORDER = [
  "Fase de Grupos",
  "Oitavas de Final",
  "Quartas de Final",
  "Semifinal",
  "Disputa de 3º lugar",
  "Final",
] as const;
