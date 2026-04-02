import type { PositionGroup } from "@/types";

export type SlotRole = "GK" | "DEF" | "MID" | "ATT";

export interface SlotDef {
  id: string;
  label: string;
  role: SlotRole;
  /** Ordered list of position groups that best fit this slot */
  preferredPositions: PositionGroup[];
  /** 0–100, left → right */
  x: number;
  /** 0–100, top (attack end) → bottom (GK end) */
  y: number;
}

export interface FormationDef {
  id: string;
  name: string;
  slots: SlotDef[];
}

// ─── Shared position group aliases ────────────────────────────────────────────
const GK: PositionGroup[] = ["Goleiros"];
const R: PositionGroup[] = ["Laterais Direitos", "Zagueiros"];
const L: PositionGroup[] = ["Laterais Esquerdos", "Zagueiros"];
const CB: PositionGroup[] = ["Zagueiros"];
const WBR: PositionGroup[] = ["Laterais Direitos", "Meio-Campistas", "Zagueiros"];
const WBL: PositionGroup[] = ["Laterais Esquerdos", "Meio-Campistas", "Zagueiros"];
const MC: PositionGroup[] = ["Meio-Campistas"];
const MWR: PositionGroup[] = ["Meio-Campistas", "Atacantes"]; // wide right mid
const MWL: PositionGroup[] = ["Meio-Campistas", "Atacantes"]; // wide left mid
const AT: PositionGroup[] = ["Atacantes", "Meio-Campistas"];

// ─── Formations ───────────────────────────────────────────────────────────────

export const FORMATIONS: FormationDef[] = [
  // ── 4-4-2 ──────────────────────────────────────────────────────────────────
  {
    id: "4-4-2",
    name: "4-4-2",
    slots: [
      { id: "gk",  label: "GK",  role: "GK",  preferredPositions: GK,  x: 50, y: 91 },
      { id: "rb",  label: "LD",  role: "DEF", preferredPositions: R,   x: 83, y: 74 },
      { id: "cb1", label: "ZAG", role: "DEF", preferredPositions: CB,  x: 63, y: 74 },
      { id: "cb2", label: "ZAG", role: "DEF", preferredPositions: CB,  x: 37, y: 74 },
      { id: "lb",  label: "LE",  role: "DEF", preferredPositions: L,   x: 17, y: 74 },
      { id: "rm",  label: "MD",  role: "MID", preferredPositions: MWR, x: 83, y: 50 },
      { id: "cm1", label: "MC",  role: "MID", preferredPositions: MC,  x: 60, y: 50 },
      { id: "cm2", label: "MC",  role: "MID", preferredPositions: MC,  x: 40, y: 50 },
      { id: "lm",  label: "ME",  role: "MID", preferredPositions: MWL, x: 17, y: 50 },
      { id: "st1", label: "CA",  role: "ATT", preferredPositions: AT,  x: 62, y: 22 },
      { id: "st2", label: "CA",  role: "ATT", preferredPositions: AT,  x: 38, y: 22 },
    ],
  },

  // ── 4-3-3 ──────────────────────────────────────────────────────────────────
  {
    id: "4-3-3",
    name: "4-3-3",
    slots: [
      { id: "gk",  label: "GK",  role: "GK",  preferredPositions: GK,  x: 50, y: 91 },
      { id: "rb",  label: "LD",  role: "DEF", preferredPositions: R,   x: 83, y: 74 },
      { id: "cb1", label: "ZAG", role: "DEF", preferredPositions: CB,  x: 63, y: 74 },
      { id: "cb2", label: "ZAG", role: "DEF", preferredPositions: CB,  x: 37, y: 74 },
      { id: "lb",  label: "LE",  role: "DEF", preferredPositions: L,   x: 17, y: 74 },
      { id: "cm1", label: "MC",  role: "MID", preferredPositions: MC,  x: 70, y: 52 },
      { id: "cm2", label: "MC",  role: "MID", preferredPositions: MC,  x: 50, y: 52 },
      { id: "cm3", label: "MC",  role: "MID", preferredPositions: MC,  x: 30, y: 52 },
      { id: "rw",  label: "PD",  role: "ATT", preferredPositions: AT,  x: 80, y: 22 },
      { id: "st",  label: "CA",  role: "ATT", preferredPositions: AT,  x: 50, y: 22 },
      { id: "lw",  label: "PE",  role: "ATT", preferredPositions: AT,  x: 20, y: 22 },
    ],
  },

  // ── 4-2-3-1 ────────────────────────────────────────────────────────────────
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    slots: [
      { id: "gk",   label: "GK",  role: "GK",  preferredPositions: GK,  x: 50, y: 91 },
      { id: "rb",   label: "LD",  role: "DEF", preferredPositions: R,   x: 83, y: 74 },
      { id: "cb1",  label: "ZAG", role: "DEF", preferredPositions: CB,  x: 63, y: 74 },
      { id: "cb2",  label: "ZAG", role: "DEF", preferredPositions: CB,  x: 37, y: 74 },
      { id: "lb",   label: "LE",  role: "DEF", preferredPositions: L,   x: 17, y: 74 },
      { id: "cdm1", label: "VOL", role: "MID", preferredPositions: MC,  x: 62, y: 60 },
      { id: "cdm2", label: "VOL", role: "MID", preferredPositions: MC,  x: 38, y: 60 },
      { id: "ram",  label: "PD",  role: "MID", preferredPositions: AT,  x: 78, y: 40 },
      { id: "cam",  label: "MEI", role: "MID", preferredPositions: MC,  x: 50, y: 40 },
      { id: "lam",  label: "PE",  role: "MID", preferredPositions: AT,  x: 22, y: 40 },
      { id: "st",   label: "CA",  role: "ATT", preferredPositions: AT,  x: 50, y: 18 },
    ],
  },

  // ── 4-1-4-1 ────────────────────────────────────────────────────────────────
  {
    id: "4-1-4-1",
    name: "4-1-4-1",
    slots: [
      { id: "gk",  label: "GK",  role: "GK",  preferredPositions: GK,  x: 50, y: 91 },
      { id: "rb",  label: "LD",  role: "DEF", preferredPositions: R,   x: 83, y: 74 },
      { id: "cb1", label: "ZAG", role: "DEF", preferredPositions: CB,  x: 63, y: 74 },
      { id: "cb2", label: "ZAG", role: "DEF", preferredPositions: CB,  x: 37, y: 74 },
      { id: "lb",  label: "LE",  role: "DEF", preferredPositions: L,   x: 17, y: 74 },
      { id: "cdm", label: "VOL", role: "MID", preferredPositions: MC,  x: 50, y: 62 },
      { id: "rm",  label: "MD",  role: "MID", preferredPositions: MWR, x: 80, y: 46 },
      { id: "cm1", label: "MC",  role: "MID", preferredPositions: MC,  x: 60, y: 46 },
      { id: "cm2", label: "MC",  role: "MID", preferredPositions: MC,  x: 40, y: 46 },
      { id: "lm",  label: "ME",  role: "MID", preferredPositions: MWL, x: 20, y: 46 },
      { id: "st",  label: "CA",  role: "ATT", preferredPositions: AT,  x: 50, y: 20 },
    ],
  },

  // ── 3-5-2 ──────────────────────────────────────────────────────────────────
  {
    id: "3-5-2",
    name: "3-5-2",
    slots: [
      { id: "gk",  label: "GK",  role: "GK",  preferredPositions: GK,   x: 50, y: 91 },
      { id: "cb1", label: "ZAG", role: "DEF", preferredPositions: CB,   x: 72, y: 74 },
      { id: "cb2", label: "ZAG", role: "DEF", preferredPositions: CB,   x: 50, y: 74 },
      { id: "cb3", label: "ZAG", role: "DEF", preferredPositions: CB,   x: 28, y: 74 },
      { id: "rwb", label: "LD",  role: "DEF", preferredPositions: WBR,  x: 90, y: 54 },
      { id: "cm1", label: "MC",  role: "MID", preferredPositions: MC,   x: 67, y: 54 },
      { id: "cm2", label: "MC",  role: "MID", preferredPositions: MC,   x: 50, y: 54 },
      { id: "cm3", label: "MC",  role: "MID", preferredPositions: MC,   x: 33, y: 54 },
      { id: "lwb", label: "LE",  role: "DEF", preferredPositions: WBL,  x: 10, y: 54 },
      { id: "st1", label: "CA",  role: "ATT", preferredPositions: AT,   x: 62, y: 22 },
      { id: "st2", label: "CA",  role: "ATT", preferredPositions: AT,   x: 38, y: 22 },
    ],
  },

  // ── 3-4-3 ──────────────────────────────────────────────────────────────────
  {
    id: "3-4-3",
    name: "3-4-3",
    slots: [
      { id: "gk",  label: "GK",  role: "GK",  preferredPositions: GK,  x: 50, y: 91 },
      { id: "cb1", label: "ZAG", role: "DEF", preferredPositions: CB,  x: 72, y: 74 },
      { id: "cb2", label: "ZAG", role: "DEF", preferredPositions: CB,  x: 50, y: 74 },
      { id: "cb3", label: "ZAG", role: "DEF", preferredPositions: CB,  x: 28, y: 74 },
      { id: "rm",  label: "MD",  role: "MID", preferredPositions: MWR, x: 82, y: 52 },
      { id: "cm1", label: "MC",  role: "MID", preferredPositions: MC,  x: 60, y: 52 },
      { id: "cm2", label: "MC",  role: "MID", preferredPositions: MC,  x: 40, y: 52 },
      { id: "lm",  label: "ME",  role: "MID", preferredPositions: MWL, x: 18, y: 52 },
      { id: "rw",  label: "PD",  role: "ATT", preferredPositions: AT,  x: 75, y: 22 },
      { id: "st",  label: "CA",  role: "ATT", preferredPositions: AT,  x: 50, y: 22 },
      { id: "lw",  label: "PE",  role: "ATT", preferredPositions: AT,  x: 25, y: 22 },
    ],
  },

  // ── 5-3-2 ──────────────────────────────────────────────────────────────────
  {
    id: "5-3-2",
    name: "5-3-2",
    slots: [
      { id: "gk",  label: "GK",  role: "GK",  preferredPositions: GK,   x: 50, y: 91 },
      { id: "rwb", label: "LD",  role: "DEF", preferredPositions: WBR,  x: 90, y: 72 },
      { id: "cb1", label: "ZAG", role: "DEF", preferredPositions: CB,   x: 71, y: 72 },
      { id: "cb2", label: "ZAG", role: "DEF", preferredPositions: CB,   x: 50, y: 72 },
      { id: "cb3", label: "ZAG", role: "DEF", preferredPositions: CB,   x: 29, y: 72 },
      { id: "lwb", label: "LE",  role: "DEF", preferredPositions: WBL,  x: 10, y: 72 },
      { id: "cm1", label: "MC",  role: "MID", preferredPositions: MC,   x: 65, y: 50 },
      { id: "cm2", label: "MC",  role: "MID", preferredPositions: MC,   x: 50, y: 50 },
      { id: "cm3", label: "MC",  role: "MID", preferredPositions: MC,   x: 35, y: 50 },
      { id: "st1", label: "CA",  role: "ATT", preferredPositions: AT,   x: 62, y: 22 },
      { id: "st2", label: "CA",  role: "ATT", preferredPositions: AT,   x: 38, y: 22 },
    ],
  },

  // ── 5-4-1 ──────────────────────────────────────────────────────────────────
  {
    id: "5-4-1",
    name: "5-4-1",
    slots: [
      { id: "gk",  label: "GK",  role: "GK",  preferredPositions: GK,   x: 50, y: 91 },
      { id: "rwb", label: "LD",  role: "DEF", preferredPositions: WBR,  x: 90, y: 72 },
      { id: "cb1", label: "ZAG", role: "DEF", preferredPositions: CB,   x: 71, y: 72 },
      { id: "cb2", label: "ZAG", role: "DEF", preferredPositions: CB,   x: 50, y: 72 },
      { id: "cb3", label: "ZAG", role: "DEF", preferredPositions: CB,   x: 29, y: 72 },
      { id: "lwb", label: "LE",  role: "DEF", preferredPositions: WBL,  x: 10, y: 72 },
      { id: "rm",  label: "MD",  role: "MID", preferredPositions: MWR,  x: 80, y: 50 },
      { id: "cm1", label: "MC",  role: "MID", preferredPositions: MC,   x: 60, y: 50 },
      { id: "cm2", label: "MC",  role: "MID", preferredPositions: MC,   x: 40, y: 50 },
      { id: "lm",  label: "ME",  role: "MID", preferredPositions: MWL,  x: 20, y: 50 },
      { id: "st",  label: "CA",  role: "ATT", preferredPositions: AT,   x: 50, y: 22 },
    ],
  },
];

export const DEFAULT_FORMATION = "4-3-3";

export function getFormation(id: string): FormationDef {
  return FORMATIONS.find((f) => f.id === id) ?? FORMATIONS[0];
}
