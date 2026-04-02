import type { Match } from "@/types";

// ─── Team & Group types ────────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  flag: string;
}

export interface GroupDef {
  id: string;
  teams: [Team, Team, Team, Team];
}

// ─── Groups data ───────────────────────────────────────────────────────────────

export const GROUPS: GroupDef[] = [
  {
    id: "A",
    teams: [
      { id: "mexico", name: "México", flag: "🇲🇽" },
      { id: "africa-do-sul", name: "África do Sul", flag: "🇿🇦" },
      { id: "coreia-do-sul", name: "Coreia do Sul", flag: "🇰🇷" },
      { id: "republica-tcheca", name: "República Tcheca", flag: "🇨🇿" },
    ],
  },
  {
    id: "B",
    teams: [
      { id: "canada", name: "Canadá", flag: "🇨🇦" },
      { id: "suica", name: "Suíça", flag: "🇨🇭" },
      { id: "catar", name: "Catar", flag: "🇶🇦" },
      { id: "bosnia", name: "Bósnia", flag: "🇧🇦" },
    ],
  },
  {
    id: "C",
    teams: [
      { id: "brasil", name: "Brasil", flag: "🇧🇷" },
      { id: "marrocos", name: "Marrocos", flag: "🇲🇦" },
      { id: "haiti", name: "Haiti", flag: "🇭🇹" },
      { id: "escocia", name: "Escócia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
    ],
  },
  {
    id: "D",
    teams: [
      { id: "estados-unidos", name: "Estados Unidos", flag: "🇺🇸" },
      { id: "paraguai", name: "Paraguai", flag: "🇵🇾" },
      { id: "australia", name: "Austrália", flag: "🇦🇺" },
      { id: "turquia", name: "Turquia", flag: "🇹🇷" },
    ],
  },
  {
    id: "E",
    teams: [
      { id: "alemanha", name: "Alemanha", flag: "🇩🇪" },
      { id: "curacao", name: "Curaçao", flag: "🇨🇼" },
      { id: "costa-do-marfim", name: "Costa do Marfim", flag: "🇨🇮" },
      { id: "equador", name: "Equador", flag: "🇪🇨" },
    ],
  },
  {
    id: "F",
    teams: [
      { id: "holanda", name: "Holanda", flag: "🇳🇱" },
      { id: "japao", name: "Japão", flag: "🇯🇵" },
      { id: "tunisia", name: "Tunísia", flag: "🇹🇳" },
      { id: "suecia", name: "Suécia", flag: "🇸🇪" },
    ],
  },
  {
    id: "G",
    teams: [
      { id: "belgica", name: "Bélgica", flag: "🇧🇪" },
      { id: "egito", name: "Egito", flag: "🇪🇬" },
      { id: "ira", name: "Irã", flag: "🇮🇷" },
      { id: "nova-zelandia", name: "Nova Zelândia", flag: "🇳🇿" },
    ],
  },
  {
    id: "H",
    teams: [
      { id: "espanha", name: "Espanha", flag: "🇪🇸" },
      { id: "cabo-verde", name: "Cabo Verde", flag: "🇨🇻" },
      { id: "arabia-saudita", name: "Arábia Saudita", flag: "🇸🇦" },
      { id: "uruguai", name: "Uruguai", flag: "🇺🇾" },
    ],
  },
  {
    id: "I",
    teams: [
      { id: "franca", name: "França", flag: "🇫🇷" },
      { id: "senegal", name: "Senegal", flag: "🇸🇳" },
      { id: "iraque", name: "Iraque", flag: "🇮🇶" },
      { id: "noruega", name: "Noruega", flag: "🇳🇴" },
    ],
  },
  {
    id: "J",
    teams: [
      { id: "argentina", name: "Argentina", flag: "🇦🇷" },
      { id: "austria", name: "Áustria", flag: "🇦🇹" },
      { id: "argelia", name: "Argélia", flag: "🇩🇿" },
      { id: "jordania", name: "Jordânia", flag: "🇯🇴" },
    ],
  },
  {
    id: "K",
    teams: [
      { id: "portugal", name: "Portugal", flag: "🇵🇹" },
      { id: "rep-democratica-congo", name: "Rep. Democrática do Congo", flag: "🇨🇩" },
      { id: "uzbequistao", name: "Uzbequistão", flag: "🇺🇿" },
      { id: "colombia", name: "Colômbia", flag: "🇨🇴" },
    ],
  },
  {
    id: "L",
    teams: [
      { id: "inglaterra", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
      { id: "croacia", name: "Croácia", flag: "🇭🇷" },
      { id: "panama", name: "Panamá", flag: "🇵🇦" },
      { id: "gana", name: "Gana", flag: "🇬🇭" },
    ],
  },
];

// ─── Generate group matches ────────────────────────────────────────────────────

export function generateGroupMatches(): Match[] {
  const matches: Match[] = [];

  for (const group of GROUPS) {
    const [t0, t1, t2, t3] = group.teams;

    const makeMatch = (
      n: number,
      home: Team,
      away: Team
    ): Match => ({
      id: `gs-${group.id}-${n}`,
      homeTeam: home.name,
      awayTeam: away.name,
      homeFlag: home.flag,
      awayFlag: away.flag,
      phase: "Fase de Grupos",
      group: group.id,
      isBrazilMatch: home.name === "Brasil" || away.name === "Brasil",
    });

    // Matchday 1
    matches.push(makeMatch(1, t0, t1));
    matches.push(makeMatch(2, t2, t3));
    // Matchday 2
    matches.push(makeMatch(3, t0, t2));
    matches.push(makeMatch(4, t1, t3));
    // Matchday 3
    matches.push(makeMatch(5, t0, t3));
    matches.push(makeMatch(6, t1, t2));
  }

  return matches;
}
