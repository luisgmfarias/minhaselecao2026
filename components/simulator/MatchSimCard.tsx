"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import type { SimulationMode, MatchOutcome } from "@/types";
import { useSimulatorStore } from "@/lib/store/simulatorStore";

// ─── Props ────────────────────────────────────────────────────────────────────

interface MatchSimCardProps {
  matchId: string;
  homeTeam: { name: string; flag: string } | null;
  awayTeam: { name: string; flag: string } | null;
  mode: SimulationMode;
  isKnockout?: boolean;
  isBrazilMatch?: boolean;
  phase?: string;
  compact?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isBrazilTeam(team: { name: string; flag: string } | null): boolean {
  return team?.name === "Brasil";
}

// ─── Simple result selector ───────────────────────────────────────────────────

interface SimpleResultSelectorProps {
  matchId: string;
  homeTeam: { name: string; flag: string } | null;
  awayTeam: { name: string; flag: string } | null;
  isKnockout?: boolean;
  compact?: boolean;
}

function SimpleResultSelector({
  matchId,
  homeTeam,
  awayTeam,
  isKnockout,
  compact,
}: SimpleResultSelectorProps) {
  const { results, setSimpleResult, clearResult } = useSimulatorStore();
  const result = results[matchId];
  const current = result?.mode === "simple" ? result.outcome : undefined;

  const homeName = homeTeam?.name ?? "Casa";
  const awayName = awayTeam?.name ?? "Fora";

  const options: { value: MatchOutcome; label: string }[] = [
    { value: "home", label: compact ? "1" : homeName },
    ...(!isKnockout ? [{ value: "draw" as MatchOutcome, label: "X" }] : []),
    { value: "away", label: compact ? "2" : awayName },
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
          disabled={!homeTeam || !awayTeam}
          className={cn(
            "flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500",
            "disabled:cursor-not-allowed disabled:opacity-40",
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

// ─── Advanced result selector ─────────────────────────────────────────────────

interface AdvancedResultSelectorProps {
  matchId: string;
  homeTeam: { name: string; flag: string } | null;
  awayTeam: { name: string; flag: string } | null;
  isKnockout?: boolean;
  compact?: boolean;
}

function AdvancedResultSelector({
  matchId,
  homeTeam,
  awayTeam,
  isKnockout,
  compact,
}: AdvancedResultSelectorProps) {
  const { results, setAdvancedResult } = useSimulatorStore();
  const result = results[matchId];
  const advResult = result?.mode === "advanced" ? result : undefined;

  const [home, setHome] = useState(advResult?.homeScore?.toString() ?? "");
  const [away, setAway] = useState(advResult?.awayScore?.toString() ?? "");
  const [penWinner, setPenWinner] = useState<"home" | "away" | undefined>(
    advResult?.penaltiesWinner
  );

  // Sync state with store when result changes externally
  useEffect(() => {
    if (advResult) {
      setHome(advResult.homeScore.toString());
      setAway(advResult.awayScore.toString());
      setPenWinner(advResult.penaltiesWinner);
    } else {
      setHome("");
      setAway("");
      setPenWinner(undefined);
    }
  }, [advResult?.homeScore, advResult?.awayScore, advResult?.penaltiesWinner]);

  const commit = (h: string, a: string, pw?: "home" | "away") => {
    const hNum = parseInt(h, 10);
    const aNum = parseInt(a, 10);
    if (!isNaN(hNum) && !isNaN(aNum) && hNum >= 0 && aNum >= 0) {
      const store = useSimulatorStore.getState();
      store.results[matchId]; // touch store
      // We need to update penaltiesWinner too
      store.setAdvancedResult(matchId, hNum, aNum);
      if (isKnockout && hNum === aNum && pw) {
        // Update penaltiesWinner in store directly
        const currentResult = useSimulatorStore.getState().results[matchId];
        if (currentResult?.mode === "advanced") {
          useSimulatorStore.setState((state) => ({
            results: {
              ...state.results,
              [matchId]: { ...currentResult, penaltiesWinner: pw },
            },
          }));
        }
      }
    }
  };

  const handlePenWinner = (pw: "home" | "away") => {
    setPenWinner(pw);
    commit(home, away, pw);
  };

  const isDraw = home !== "" && away !== "" && home === away;
  const showPenalties = isKnockout && isDraw;

  const inputClass = cn(
    "rounded-lg border border-neutral-200 bg-white text-center font-bold",
    "focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20",
    "dark:border-neutral-700 dark:bg-neutral-900 dark:text-white",
    compact ? "w-10 p-1 text-base" : "w-14 p-2 text-lg"
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center gap-2">
        <label className="flex flex-col items-center gap-0.5">
          {!compact && (
            <span className="text-xs text-neutral-500">{homeTeam?.name ?? "Casa"}</span>
          )}
          <input
            type="number"
            min={0}
            max={99}
            value={home}
            onChange={(e) => setHome(e.target.value)}
            onBlur={() => commit(home, away, penWinner)}
            disabled={!homeTeam || !awayTeam}
            className={inputClass}
            aria-label={`Gols do ${homeTeam?.name ?? "Casa"}`}
          />
        </label>
        <span className={cn("font-bold text-neutral-400", compact ? "text-base" : "text-xl")}>
          x
        </span>
        <label className="flex flex-col items-center gap-0.5">
          {!compact && (
            <span className="text-xs text-neutral-500">{awayTeam?.name ?? "Fora"}</span>
          )}
          <input
            type="number"
            min={0}
            max={99}
            value={away}
            onChange={(e) => setAway(e.target.value)}
            onBlur={() => commit(home, away, penWinner)}
            disabled={!homeTeam || !awayTeam}
            className={inputClass}
            aria-label={`Gols do ${awayTeam?.name ?? "Fora"}`}
          />
        </label>
      </div>

      {showPenalties && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-neutral-500">Pênaltis</span>
          <div className="flex gap-1">
            <button
              onClick={() => handlePenWinner("home")}
              className={cn(
                "rounded-lg px-2 py-1 text-xs font-semibold transition-all",
                penWinner === "home"
                  ? "bg-green-600 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
              )}
            >
              {homeTeam?.flag} {compact ? "1" : homeTeam?.name}
            </button>
            <button
              onClick={() => handlePenWinner("away")}
              className={cn(
                "rounded-lg px-2 py-1 text-xs font-semibold transition-all",
                penWinner === "away"
                  ? "bg-green-600 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
              )}
            >
              {awayTeam?.flag} {compact ? "2" : awayTeam?.name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main MatchSimCard ────────────────────────────────────────────────────────

export function MatchSimCard({
  matchId,
  homeTeam,
  awayTeam,
  mode,
  isKnockout,
  isBrazilMatch,
  phase,
  compact,
}: MatchSimCardProps) {
  const { results } = useSimulatorStore();
  const result = results[matchId];
  const hasResult = !!result;

  const brazilIsHome = isBrazilTeam(homeTeam);
  const brazilIsAway = isBrazilTeam(awayTeam);
  const hasBrazil = brazilIsHome || brazilIsAway;

  let brazilWon = false;
  let brazilLost = false;
  let isDraw = false;

  if (hasResult && hasBrazil) {
    const outcome = result.outcome;
    if (outcome === "draw") {
      isDraw = true;
    } else if (
      (brazilIsHome && outcome === "home") ||
      (brazilIsAway && outcome === "away")
    ) {
      brazilWon = true;
    } else {
      brazilLost = true;
    }
  }

  const tbd = !homeTeam || !awayTeam;

  const borderClass = hasBrazil && hasResult
    ? brazilWon
      ? "border-green-400 dark:border-green-700"
      : brazilLost
      ? "border-red-300 dark:border-red-800"
      : isDraw
      ? "border-yellow-400 dark:border-yellow-700"
      : "border-neutral-200 dark:border-neutral-800"
    : "border-neutral-200 dark:border-neutral-800";

  if (compact) {
    return (
      <div
        className={cn(
          "rounded-xl border bg-white dark:bg-neutral-900 p-2 transition-all",
          borderClass
        )}
      >
        {isBrazilMatch && (
          <div className="mb-1 text-center text-xs font-bold text-green-600 dark:text-green-400">
            🇧🇷
          </div>
        )}
        <div className="mb-2 flex items-center justify-between gap-1 text-xs">
          <div className="flex flex-1 flex-col items-center gap-0.5 text-center">
            <span className="text-base">{homeTeam?.flag ?? "❓"}</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 leading-tight line-clamp-1">
              {homeTeam?.name ?? "A definir"}
            </span>
          </div>
          <div className="flex flex-col items-center px-1">
            {hasResult && result.mode === "advanced" ? (
              <span className="font-black text-neutral-900 dark:text-white text-sm">
                {result.homeScore}–{result.awayScore}
              </span>
            ) : hasResult && result.mode === "simple" ? (
              <span className="text-xs font-bold text-neutral-500">
                {result.outcome === "home" ? "1" : result.outcome === "away" ? "2" : "X"}
              </span>
            ) : (
              <span className="text-xs font-bold text-neutral-300 dark:text-neutral-700">vs</span>
            )}
          </div>
          <div className="flex flex-1 flex-col items-center gap-0.5 text-center">
            <span className="text-base">{awayTeam?.flag ?? "❓"}</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 leading-tight line-clamp-1">
              {awayTeam?.name ?? "A definir"}
            </span>
          </div>
        </div>
        {mode === "simple" ? (
          <SimpleResultSelector
            matchId={matchId}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            isKnockout={isKnockout}
            compact
          />
        ) : (
          <AdvancedResultSelector
            matchId={matchId}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            isKnockout={isKnockout}
            compact
          />
        )}
      </div>
    );
  }

  return (
    <article
      className={cn(
        "rounded-2xl border bg-white dark:bg-neutral-900 transition-all",
        borderClass
      )}
    >
      {/* Header */}
      <div className="border-b border-neutral-100 dark:border-neutral-800 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span className="font-semibold uppercase tracking-wider">
            {phase ?? "Jogo"}
          </span>
          {isBrazilMatch && (
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              🇧🇷
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Teams */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex flex-1 flex-col items-center gap-1 text-center">
            {tbd && !homeTeam ? (
              <span className="text-2xl text-neutral-300 dark:text-neutral-700">❓</span>
            ) : (
              <span className="text-2xl">{homeTeam!.flag}</span>
            )}
            <span className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
              {homeTeam?.name ?? (
                <span className="text-neutral-400 italic">A definir</span>
              )}
            </span>
          </div>

          <div className="flex flex-col items-center">
            {hasResult && result.mode === "advanced" ? (
              <span className="text-2xl font-black text-neutral-900 dark:text-white">
                {result.homeScore} – {result.awayScore}
              </span>
            ) : hasResult && result.mode === "simple" ? (
              <span
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-bold",
                  hasBrazil && brazilWon
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : hasBrazil && isDraw
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : hasBrazil && brazilLost
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : result.outcome === "home"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : result.outcome === "away"
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                )}
              >
                {result.outcome === "home"
                  ? homeTeam?.name ?? "Casa"
                  : result.outcome === "away"
                  ? awayTeam?.name ?? "Fora"
                  : "Empate"}
              </span>
            ) : (
              <span className="text-lg font-bold text-neutral-300 dark:text-neutral-700">vs</span>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center gap-1 text-center">
            {tbd && !awayTeam ? (
              <span className="text-2xl text-neutral-300 dark:text-neutral-700">❓</span>
            ) : (
              <span className="text-2xl">{awayTeam!.flag}</span>
            )}
            <span className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
              {awayTeam?.name ?? (
                <span className="text-neutral-400 italic">A definir</span>
              )}
            </span>
          </div>
        </div>

        {/* Result selector */}
        {mode === "simple" ? (
          <SimpleResultSelector
            matchId={matchId}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            isKnockout={isKnockout}
          />
        ) : (
          <AdvancedResultSelector
            matchId={matchId}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            isKnockout={isKnockout}
          />
        )}
      </div>
    </article>
  );
}
