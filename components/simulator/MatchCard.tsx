"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { Match, MatchOutcome, SimulationMode } from "@/types";
import { useSimulatorStore } from "@/lib/store/simulatorStore";
import { MapPin, Calendar } from "lucide-react";

interface MatchCardProps {
  match: Match;
  mode: SimulationMode;
}

function formatDate(iso?: string): string {
  if (!iso) return "Data a confirmar";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ─── Simple mode ───────────────────────────────────────────────────────────────

interface SimpleResultSelectorProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  current?: MatchOutcome;
}

function SimpleResultSelector({
  matchId,
  homeTeam,
  awayTeam,
  current,
}: SimpleResultSelectorProps) {
  const { setSimpleResult, clearResult } = useSimulatorStore();

  const options: { value: MatchOutcome; label: string }[] = [
    { value: "home", label: homeTeam },
    { value: "draw", label: "Empate" },
    { value: "away", label: awayTeam },
  ];

  return (
    <div className="flex w-full gap-1" role="group" aria-label="Resultado do jogo">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() =>
            current === opt.value
              ? clearResult(matchId)
              : setSimpleResult(matchId, opt.value)
          }
          className={cn(
            "flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500",
            current === opt.value
              ? "bg-green-600 text-white shadow-sm"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
          )}
          aria-pressed={current === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Advanced mode ─────────────────────────────────────────────────────────────

interface AdvancedResultSelectorProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
}

function AdvancedResultSelector({
  matchId,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
}: AdvancedResultSelectorProps) {
  const { setAdvancedResult } = useSimulatorStore();
  const [home, setHome] = useState(homeScore?.toString() ?? "");
  const [away, setAway] = useState(awayScore?.toString() ?? "");

  const commit = (h: string, a: string) => {
    const hNum = parseInt(h, 10);
    const aNum = parseInt(a, 10);
    if (!isNaN(hNum) && !isNaN(aNum) && hNum >= 0 && aNum >= 0) {
      setAdvancedResult(matchId, hNum, aNum);
    }
  };

  const inputClass = cn(
    "w-14 rounded-lg border border-neutral-200 bg-white p-2 text-center text-lg font-bold",
    "focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20",
    "dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
  );

  return (
    <div className="flex items-center justify-center gap-3">
      <label className="flex flex-col items-center gap-1">
        <span className="text-xs text-neutral-500">{homeTeam}</span>
        <input
          type="number"
          min={0}
          max={99}
          value={home}
          onChange={(e) => setHome(e.target.value)}
          onBlur={() => commit(home, away)}
          className={inputClass}
          aria-label={`Gols do ${homeTeam}`}
        />
      </label>
      <span className="text-xl font-bold text-neutral-400">x</span>
      <label className="flex flex-col items-center gap-1">
        <span className="text-xs text-neutral-500">{awayTeam}</span>
        <input
          type="number"
          min={0}
          max={99}
          value={away}
          onChange={(e) => setAway(e.target.value)}
          onBlur={() => commit(home, away)}
          className={inputClass}
          aria-label={`Gols do ${awayTeam}`}
        />
      </label>
    </div>
  );
}

// ─── Match card ────────────────────────────────────────────────────────────────

export function MatchCard({ match, mode }: MatchCardProps) {
  const { results } = useSimulatorStore();
  const result = results[match.id];

  const simpleOutcome =
    result?.mode === "simple" ? result.outcome : undefined;
  const advancedHome =
    result?.mode === "advanced" ? result.homeScore : undefined;
  const advancedAway =
    result?.mode === "advanced" ? result.awayScore : undefined;

  const hasResult = !!result;
  const isBrazilHome = match.homeTeam === "Brasil";
  const brazilWon =
    hasResult &&
    ((isBrazilHome && result.outcome === "home") ||
      (!isBrazilHome && result.outcome === "away"));
  const isDraw = hasResult && result.outcome === "draw";
  const brazilLost = hasResult && !brazilWon && !isDraw;

  return (
    <article
      className={cn(
        "rounded-2xl border bg-white transition-all dark:bg-neutral-900",
        hasResult && brazilWon && "border-green-400 dark:border-green-700",
        hasResult && isDraw && "border-yellow-400 dark:border-yellow-700",
        hasResult && brazilLost && "border-red-300 dark:border-red-800",
        !hasResult && "border-neutral-200 dark:border-neutral-800"
      )}
    >
      {/* Phase badge */}
      <div className="border-b border-neutral-100 px-4 py-2 dark:border-neutral-800">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span className="font-semibold uppercase tracking-wider">{match.phase}</span>
          {match.group && <span>Grupo {match.group}</span>}
        </div>
      </div>

      <div className="p-4">
        {/* Teams */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex flex-1 flex-col items-center gap-1 text-center">
            <span className="text-2xl">{match.homeFlag ?? "🏳️"}</span>
            <span className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
              {match.homeTeam}
            </span>
          </div>
          <div className="flex flex-col items-center">
            {hasResult && result.mode === "advanced" ? (
              <span className="text-2xl font-black text-neutral-900 dark:text-white">
                {result.homeScore} – {result.awayScore}
              </span>
            ) : hasResult && result.mode === "simple" ? (
              <span className={cn(
                "rounded-lg px-2 py-1 text-xs font-bold",
                brazilWon ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                isDraw ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              )}>
                {isDraw ? "Empate" : brazilWon ? "Brasil venceu" : "Derrota"}
              </span>
            ) : (
              <span className="text-lg font-bold text-neutral-300 dark:text-neutral-700">vs</span>
            )}
          </div>
          <div className="flex flex-1 flex-col items-center gap-1 text-center">
            <span className="text-2xl">{match.awayFlag ?? "🏳️"}</span>
            <span className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
              {match.awayTeam}
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(match.kickoff)}
          </span>
          {match.stadium && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {match.stadium}, {match.city}
            </span>
          )}
        </div>

        {/* Result selector */}
        {mode === "simple" ? (
          <SimpleResultSelector
            matchId={match.id}
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            current={simpleOutcome}
          />
        ) : (
          <AdvancedResultSelector
            matchId={match.id}
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            homeScore={advancedHome}
            awayScore={advancedAway}
          />
        )}
      </div>
    </article>
  );
}
