"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { SimulationMode } from "@/types";
import { useSimulatorStore } from "@/lib/store/simulatorStore";
import { GROUPS, generateGroupMatches } from "@/data/groups";
import { computeGroupStandings } from "@/lib/utils/standingsUtils";
import { GroupStandingsTable } from "./GroupStandingsTable";
import { MatchSimCard } from "./MatchSimCard";

interface GroupCardProps {
  groupId: string;
  mode: SimulationMode;
}

export function GroupCard({ groupId, mode }: GroupCardProps) {
  const { results } = useSimulatorStore();
  const [matchesOpen, setMatchesOpen] = useState(false);

  const group = GROUPS.find((g) => g.id === groupId);
  const hasBrazil = group?.teams.some((t) => t.name === "Brasil") ?? false;

  const groupMatches = useMemo(
    () => generateGroupMatches().filter((m) => m.group === groupId),
    [groupId]
  );

  const standings = useMemo(
    () => computeGroupStandings(groupId, results),
    [groupId, results]
  );

  const simulatedCount = groupMatches.filter((m) => !!results[m.id]).length;
  const allSimulated = simulatedCount === groupMatches.length;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white dark:bg-neutral-900 overflow-hidden transition-all",
        hasBrazil
          ? "border-green-400 dark:border-green-700 shadow-sm shadow-green-100 dark:shadow-green-900/20"
          : "border-neutral-200 dark:border-neutral-800"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "px-4 py-3 flex items-center justify-between",
          hasBrazil
            ? "bg-green-50 dark:bg-green-900/10 border-b border-green-100 dark:border-green-900/30"
            : "border-b border-neutral-100 dark:border-neutral-800"
        )}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm">
            Grupo {groupId}
          </h3>
          {hasBrazil && (
            <span className="text-sm" title="Grupo do Brasil">🇧🇷</span>
          )}
          {allSimulated && (
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Simulado
            </span>
          )}
        </div>
        <span className="text-xs text-neutral-500">
          {simulatedCount}/{groupMatches.length} jogos
        </span>
      </div>

      {/* Standings */}
      <div className="px-4 py-3">
        <GroupStandingsTable groupId={groupId} standings={standings} />
      </div>

      {/* Matches toggle */}
      <div className="border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={() => setMatchesOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
          aria-expanded={matchesOpen}
        >
          <span>6 Jogos</span>
          {matchesOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {matchesOpen && (
          <div className="grid gap-2 px-4 pb-4 sm:grid-cols-2">
            {groupMatches.map((match) => {
              const homeTeamDef = group?.teams.find((t) => t.name === match.homeTeam);
              const awayTeamDef = group?.teams.find((t) => t.name === match.awayTeam);

              return (
                <MatchSimCard
                  key={match.id}
                  matchId={match.id}
                  homeTeam={
                    homeTeamDef
                      ? { name: homeTeamDef.name, flag: homeTeamDef.flag }
                      : { name: match.homeTeam, flag: match.homeFlag ?? "🏳️" }
                  }
                  awayTeam={
                    awayTeamDef
                      ? { name: awayTeamDef.name, flag: awayTeamDef.flag }
                      : { name: match.awayTeam, flag: match.awayFlag ?? "🏳️" }
                  }
                  mode={mode}
                  isKnockout={false}
                  isBrazilMatch={match.isBrazilMatch}
                  phase={`Grupo ${groupId}`}
                  compact
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
