import LZString from "lz-string";
import { PLAYERS } from "@/data/players";
import { ALL_BRAZIL_MATCHES } from "@/data/matches";
import type { SharePayload, MatchResult, MatchOutcome, SimulationMode, SerializedResult } from "@/types";

const PARAM_KEY = "s";

// ─── Index helpers ──────────────────────────────────────────────────────────────

function playerIndex(id: string): number {
  return PLAYERS.findIndex((p) => p.id === id);
}

function matchIndex(id: string): number {
  return ALL_BRAZIL_MATCHES.findIndex((m) => m.id === id);
}

// ─── Serialize ─────────────────────────────────────────────────────────────────

function serializeResult(result: MatchResult): SerializedResult {
  if (result.mode === "simple") {
    return { o: result.outcome };
  }
  return { h: result.homeScore, a: result.awayScore };
}

export function encodeSharePayload(payload: SharePayload): string {
  // Encode player IDs as indices → much shorter than full slug strings
  const sq = (payload.squad ?? [])
    .map(playerIndex)
    .filter((i) => i >= 0);

  // Encode match IDs as indices
  const r: Record<string, SerializedResult> = {};
  if (payload.results) {
    for (const [id, res] of Object.entries(payload.results)) {
      const idx = matchIndex(id);
      if (idx >= 0) r[idx] = serializeResult(res);
    }
  }

  // Encode lineup slot player values as indices
  let li: { f: string; s: Record<string, number> } | undefined;
  if (payload.lineup) {
    const encodedSlots: Record<string, number> = {};
    for (const [slotId, pid] of Object.entries(payload.lineup.slots)) {
      const idx = playerIndex(pid);
      if (idx >= 0) encodedSlots[slotId] = idx;
    }
    li = { f: payload.lineup.formation, s: encodedSlots };
  }

  const serialized = JSON.stringify({
    sq,
    r,
    m: payload.mode ?? "simple",
    li,
  });
  return LZString.compressToEncodedURIComponent(serialized);
}

// ─── Deserialize ───────────────────────────────────────────────────────────────

function outcomeFromScores(home: number, away: number): MatchOutcome {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

function deserializeResult(raw: SerializedResult): MatchResult {
  if (raw.h !== undefined && raw.a !== undefined) {
    return {
      mode: "advanced",
      homeScore: raw.h,
      awayScore: raw.a,
      outcome: outcomeFromScores(raw.h, raw.a),
    };
  }
  return {
    mode: "simple",
    outcome: (raw.o as MatchOutcome) ?? "draw",
  };
}

export function decodeSharePayload(encoded: string): SharePayload | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const data = JSON.parse(json) as {
      sq?: unknown;
      r?: Record<string, SerializedResult>;
      m?: string;
      li?: { f?: string; s?: Record<string, number> };
    };

    // Decode player indices back to IDs
    const squad = Array.isArray(data.sq)
      ? (data.sq as number[]).map((i) => PLAYERS[i]?.id).filter(Boolean) as string[]
      : [];

    // Decode match indices back to IDs
    const results: Record<string, MatchResult> = {};
    if (data.r) {
      for (const [idxStr, raw] of Object.entries(data.r)) {
        const match = ALL_BRAZIL_MATCHES[Number(idxStr)];
        if (match) results[match.id] = deserializeResult(raw);
      }
    }

    // Decode lineup slot player indices back to IDs
    let lineup: SharePayload["lineup"];
    if (data.li?.f) {
      const slots: Record<string, string> = {};
      for (const [slotId, idx] of Object.entries(data.li.s ?? {})) {
        const player = PLAYERS[idx as number];
        if (player) slots[slotId] = player.id;
      }
      lineup = { formation: data.li.f, slots };
    }

    return { squad, results, mode: (data.m as SimulationMode) ?? "simple", lineup };
  } catch {
    return null;
  }
}

// ─── URL helpers ───────────────────────────────────────────────────────────────

export function buildShareUrl(payload: SharePayload, baseUrl?: string): string {
  const base = baseUrl ?? (typeof window !== "undefined" ? window.location.origin : "");
  const encoded = encodeSharePayload(payload);
  return `${base}/compartilhar?${PARAM_KEY}=${encoded}`;
}

export function parseShareUrl(search: string): SharePayload | null {
  const params = new URLSearchParams(search);
  const encoded = params.get(PARAM_KEY);
  if (!encoded) return null;
  return decodeSharePayload(encoded);
}
