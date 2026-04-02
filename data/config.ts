import type { PositionGroup } from "@/types";

// ─── Squad configuration ──────────────────────────────────────────────────────

export const SQUAD_TOTAL = 26;

export const POSITION_LIMITS: Record<PositionGroup, number> = {
  Goleiros: 3,
  Zagueiros: 6,
  "Laterais Direitos": 4,
  "Laterais Esquerdos": 4,
  "Meio-Campistas": 7,
  Atacantes: 9,
};

export const POSITION_ORDER: PositionGroup[] = [
  "Goleiros",
  "Zagueiros",
  "Laterais Direitos",
  "Laterais Esquerdos",
  "Meio-Campistas",
  "Atacantes",
];

export const POSITION_ABBREVIATIONS: Record<PositionGroup, string> = {
  Goleiros: "GOL",
  Zagueiros: "ZAG",
  "Laterais Direitos": "LD",
  "Laterais Esquerdos": "LE",
  "Meio-Campistas": "MC",
  Atacantes: "ATA",
};

export const POSITION_COLORS: Record<PositionGroup, string> = {
  Goleiros: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
  Zagueiros: "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
  "Laterais Direitos": "bg-sky-500/20 text-sky-700 dark:text-sky-400 border-sky-500/30",
  "Laterais Esquerdos": "bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
  "Meio-Campistas": "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
  Atacantes: "bg-brazil-green/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
};

// ─── App metadata ─────────────────────────────────────────────────────────────

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://minhaselecao2026.com.br";

export const SITE_NAME = "Minha Seleção 2026";

export const SITE_DESCRIPTION =
  "Monte sua convocação para a Copa do Mundo 2026, simule os jogos do Brasil e compartilhe com seus amigos no WhatsApp e Facebook.";
