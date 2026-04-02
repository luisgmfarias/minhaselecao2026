import LZString from "lz-string";
import type { SharePayload, MatchResult, MatchOutcome, SimulationMode, SerializedResult } from "@/types";

const PARAM_KEY = "s";

// ─── Serialize ─────────────────────────────────────────────────────────────────

function serializeResult(result: MatchResult): SerializedResult {
  if (result.mode === "simple") {
    return { o: result.outcome };
  }
  return { h: result.homeScore, a: result.awayScore };
}

export function encodeSharePayload(payload: SharePayload): string {
  const serialized = JSON.stringify({
    sq: payload.squad ?? [],
    r: payload.results
      ? Object.fromEntries(
          Object.entries(payload.results).map(([id, res]) => [id, serializeResult(res)])
        )
      : {},
    m: payload.mode ?? "simple",
    li: payload.lineup
      ? { f: payload.lineup.formation, s: payload.lineup.slots }
      : undefined,
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
      li?: { f?: string; s?: Record<string, string> };
    };
    const results: Record<string, MatchResult> = {};
    if (data.r) {
      for (const [id, raw] of Object.entries(data.r)) {
        results[id] = deserializeResult(raw);
      }
    }
    return {
      squad: Array.isArray(data.sq) ? (data.sq as string[]) : [],
      results,
      mode: (data.m as SimulationMode) ?? "simple",
      lineup: data.li?.f
        ? { formation: data.li.f, slots: data.li.s ?? {} }
        : undefined,
    };
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
