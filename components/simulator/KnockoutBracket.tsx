"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import type { SimulationMode } from "@/types";
import { useSimulatorStore } from "@/lib/store/simulatorStore";
import {
  KNOCKOUT_MATCHES,
  resolveTeam,
  getMatchWinner,
  type KnockoutMatchDef,
} from "@/lib/utils/bracketUtils";
import { MatchSimCard } from "./MatchSimCard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KnockoutBracketProps {
  mode: SimulationMode;
}

type Phase = "r32" | "r16" | "qf" | "sf-final";

// ─── Bracket Match Box (compact bracket cell) ─────────────────────────────────

interface BracketMatchBoxProps {
  matchDef: KnockoutMatchDef;
  mode: SimulationMode;
  onClick: (matchDef: KnockoutMatchDef) => void;
}

function BracketMatchBox({ matchDef, mode, onClick }: BracketMatchBoxProps) {
  const { results } = useSimulatorStore();
  const result = results[matchDef.id];
  const hasResult = !!result;

  const team1 = resolveTeam(matchDef.slot1, results);
  const team2 = resolveTeam(matchDef.slot2, results);

  const winner = hasResult ? getMatchWinner(matchDef.id, results) : null;

  const isBrazilMatch =
    team1?.name === "Brasil" || team2?.name === "Brasil";

  const team1IsWinner =
    winner && team1 && winner.name === team1.name;
  const team2IsWinner =
    winner && team2 && winner.name === team2.name;

  const scoreLabel = (() => {
    if (!hasResult) return null;
    if (result.mode === "advanced") {
      const pen =
        result.penaltiesWinner
          ? ` (pen)`
          : "";
      return `${result.homeScore}–${result.awayScore}${pen}`;
    }
    if (result.outcome === "home") return team1?.name?.slice(0, 3).toUpperCase() ?? "1";
    if (result.outcome === "away") return team2?.name?.slice(0, 3).toUpperCase() ?? "2";
    return "X";
  })();

  return (
    <button
      onClick={() => onClick(matchDef)}
      className={cn(
        "w-full rounded-xl border bg-white dark:bg-neutral-900 text-left transition-all hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500",
        isBrazilMatch
          ? "border-green-300 dark:border-green-800"
          : hasResult
          ? "border-blue-200 dark:border-blue-900"
          : "border-neutral-200 dark:border-neutral-800"
      )}
      aria-label={`${team1?.name ?? "TBD"} vs ${team2?.name ?? "TBD"}`}
    >
      <div className="px-2 py-1.5 space-y-1">
        {/* Team 1 */}
        <div
          className={cn(
            "flex items-center gap-1.5 rounded px-1 py-0.5",
            team1IsWinner && "bg-green-50 dark:bg-green-900/20"
          )}
        >
          <span className="text-sm leading-none w-5 text-center">
            {team1?.flag ?? "❓"}
          </span>
          <span
            className={cn(
              "text-xs font-semibold truncate flex-1",
              team1
                ? team1IsWinner
                  ? "text-green-700 dark:text-green-400"
                  : "text-neutral-800 dark:text-neutral-200"
                : "text-neutral-400 italic"
            )}
          >
            {team1?.name ?? "A definir"}
          </span>
          {isBrazilMatch && team1?.name === "Brasil" && (
            <span className="text-xs">🇧🇷</span>
          )}
        </div>

        {/* Score */}
        {scoreLabel && (
          <div className="text-center text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {scoreLabel}
          </div>
        )}
        {!scoreLabel && (
          <div className="text-center text-xs text-neutral-300 dark:text-neutral-700">
            —
          </div>
        )}

        {/* Team 2 */}
        <div
          className={cn(
            "flex items-center gap-1.5 rounded px-1 py-0.5",
            team2IsWinner && "bg-green-50 dark:bg-green-900/20"
          )}
        >
          <span className="text-sm leading-none w-5 text-center">
            {team2?.flag ?? "❓"}
          </span>
          <span
            className={cn(
              "text-xs font-semibold truncate flex-1",
              team2
                ? team2IsWinner
                  ? "text-green-700 dark:text-green-400"
                  : "text-neutral-800 dark:text-neutral-200"
                : "text-neutral-400 italic"
            )}
          >
            {team2?.name ?? "A definir"}
          </span>
          {isBrazilMatch && team2?.name === "Brasil" && (
            <span className="text-xs">🇧🇷</span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Desktop bracket column ───────────────────────────────────────────────────

interface BracketColumnProps {
  label: string;
  matches: KnockoutMatchDef[];
  mode: SimulationMode;
  onClick: (m: KnockoutMatchDef) => void;
  matchHeight: number;
  gap: number;
}

function BracketColumn({
  label,
  matches,
  mode,
  onClick,
  matchHeight,
  gap,
}: BracketColumnProps) {
  return (
    <div className="flex flex-col" style={{ minWidth: 160 }}>
      <div className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {label}
      </div>
      <div className="flex flex-col" style={{ gap }}>
        {matches.map((m) => (
          <div key={m.id} style={{ height: matchHeight }}>
            <BracketMatchBox matchDef={m} mode={mode} onClick={onClick} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Phase label mapping ──────────────────────────────────────────────────────

const PHASE_LABELS: Record<string, string> = {
  r32: "R32",
  r16: "Oitavas",
  qf: "Quartas",
  sf: "Semis",
  final: "Final",
  "3rd": "3º lugar",
};

// ─── Mobile phase selector ────────────────────────────────────────────────────

interface MobilePhaseSelectorProps {
  phase: Phase;
  onChange: (p: Phase) => void;
}

function MobilePhaseSelector({ phase, onChange }: MobilePhaseSelectorProps) {
  const phases: { id: Phase; label: string }[] = [
    { id: "r32", label: "R32" },
    { id: "r16", label: "Oitavas" },
    { id: "qf", label: "Quartas" },
    { id: "sf-final", label: "Semis + Final" },
  ];

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {phases.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
            phase === p.id
              ? "bg-green-600 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

// ─── Match modal ──────────────────────────────────────────────────────────────

interface MatchModalProps {
  matchDef: KnockoutMatchDef | null;
  mode: SimulationMode;
  onClose: () => void;
}

function MatchModal({ matchDef, mode, onClose }: MatchModalProps) {
  const { results } = useSimulatorStore();

  if (!matchDef) return null;

  const team1 = resolveTeam(matchDef.slot1, results);
  const team2 = resolveTeam(matchDef.slot2, results);
  const isBrazilMatch = team1?.name === "Brasil" || team2?.name === "Brasil";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 px-4 py-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            {matchDef.phaseLabel}
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <MatchSimCard
            matchId={matchDef.id}
            homeTeam={team1}
            awayTeam={team2}
            mode={mode}
            isKnockout={matchDef.isKnockout}
            isBrazilMatch={isBrazilMatch}
            phase={matchDef.phaseLabel}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function KnockoutBracket({ mode }: KnockoutBracketProps) {
  const { results } = useSimulatorStore();
  const [selectedPhase, setSelectedPhase] = useState<Phase>("r32");
  const [activeMatch, setActiveMatch] = useState<KnockoutMatchDef | null>(null);

  // Group matches by phase
  const r32Matches = KNOCKOUT_MATCHES.filter((m) => m.id.startsWith("r32"));
  const r16Matches = KNOCKOUT_MATCHES.filter((m) => m.id.startsWith("r16"));
  const qfMatches = KNOCKOUT_MATCHES.filter((m) => m.id.startsWith("qf"));
  const sfMatches = KNOCKOUT_MATCHES.filter((m) => m.id.startsWith("sf"));
  const finalMatch = KNOCKOUT_MATCHES.find((m) => m.id === "ko-final");
  const thirdMatch = KNOCKOUT_MATCHES.find((m) => m.id === "ko-3rd");

  // Mobile phase matches
  const mobileMatches = useMemo((): KnockoutMatchDef[] => {
    if (selectedPhase === "r32") return r32Matches;
    if (selectedPhase === "r16") return r16Matches;
    if (selectedPhase === "qf") return qfMatches;
    return [
      ...sfMatches,
      ...(finalMatch ? [finalMatch] : []),
      ...(thirdMatch ? [thirdMatch] : []),
    ];
  }, [selectedPhase, r32Matches, r16Matches, qfMatches, sfMatches, finalMatch, thirdMatch]);

  const handleMatchClick = (matchDef: KnockoutMatchDef) => {
    setActiveMatch(matchDef);
  };

  const handleModalClose = () => setActiveMatch(null);

  return (
    <div>
      {/* Mobile view */}
      <div className="md:hidden">
        <MobilePhaseSelector phase={selectedPhase} onChange={setSelectedPhase} />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {mobileMatches.map((matchDef) => {
            const team1 = resolveTeam(matchDef.slot1, results);
            const team2 = resolveTeam(matchDef.slot2, results);
            const isBrazilMatch =
              team1?.name === "Brasil" || team2?.name === "Brasil";

            return (
              <MatchSimCard
                key={matchDef.id}
                matchId={matchDef.id}
                homeTeam={team1}
                awayTeam={team2}
                mode={mode}
                isKnockout={matchDef.isKnockout}
                isBrazilMatch={isBrazilMatch}
                phase={matchDef.phaseLabel}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop bracket */}
      <div className="hidden md:block">
        <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
          Clique em qualquer partida para simular o resultado.
        </p>
        <div className="overflow-x-auto pb-4">
          {/* Top half */}
          <div className="mb-6">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
              Chave Superior
            </div>
            <div className="flex gap-4 items-start">
              {/* R32 top */}
              <BracketColumn
                label="R32"
                matches={r32Matches.filter((m) => m.bracketHalf === "top")}
                mode={mode}
                onClick={handleMatchClick}
                matchHeight={100}
                gap={8}
              />
              {/* R16 top */}
              <BracketColumn
                label="Oitavas"
                matches={r16Matches.filter((m) => m.bracketHalf === "top")}
                mode={mode}
                onClick={handleMatchClick}
                matchHeight={100}
                gap={112}
              />
              {/* QF top */}
              <BracketColumn
                label="Quartas"
                matches={qfMatches.filter((m) => m.bracketHalf === "top")}
                mode={mode}
                onClick={handleMatchClick}
                matchHeight={100}
                gap={320}
              />
              {/* SF top */}
              <BracketColumn
                label="Semi"
                matches={sfMatches.filter((m) => m.bracketHalf === "top")}
                mode={mode}
                onClick={handleMatchClick}
                matchHeight={100}
                gap={0}
              />
              {/* Final */}
              {finalMatch && (
                <div style={{ minWidth: 160 }}>
                  <div className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                    Final 🏆
                  </div>
                  <div style={{ height: 100 }}>
                    <BracketMatchBox
                      matchDef={finalMatch}
                      mode={mode}
                      onClick={handleMatchClick}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom half */}
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
              Chave Inferior
            </div>
            <div className="flex gap-4 items-start">
              {/* R32 bottom */}
              <BracketColumn
                label="R32"
                matches={r32Matches.filter((m) => m.bracketHalf === "bottom")}
                mode={mode}
                onClick={handleMatchClick}
                matchHeight={100}
                gap={8}
              />
              {/* R16 bottom */}
              <BracketColumn
                label="Oitavas"
                matches={r16Matches.filter((m) => m.bracketHalf === "bottom")}
                mode={mode}
                onClick={handleMatchClick}
                matchHeight={100}
                gap={112}
              />
              {/* QF bottom */}
              <BracketColumn
                label="Quartas"
                matches={qfMatches.filter((m) => m.bracketHalf === "bottom")}
                mode={mode}
                onClick={handleMatchClick}
                matchHeight={100}
                gap={320}
              />
              {/* SF bottom */}
              <BracketColumn
                label="Semi"
                matches={sfMatches.filter((m) => m.bracketHalf === "bottom")}
                mode={mode}
                onClick={handleMatchClick}
                matchHeight={100}
                gap={0}
              />
              {/* 3rd place */}
              {thirdMatch && (
                <div style={{ minWidth: 160 }}>
                  <div className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-neutral-500">
                    3º Lugar
                  </div>
                  <div style={{ height: 100 }}>
                    <BracketMatchBox
                      matchDef={thirdMatch}
                      mode={mode}
                      onClick={handleMatchClick}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Match modal */}
      <MatchModal matchDef={activeMatch} mode={mode} onClose={handleModalClose} />
    </div>
  );
}
