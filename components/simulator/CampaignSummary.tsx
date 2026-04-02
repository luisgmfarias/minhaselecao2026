"use client";

import { useMemo } from "react";
import { useSimulatorStore } from "@/lib/store/simulatorStore";
import { computeCampaignStats } from "@/lib/utils/simulationUtils";
import { ALL_BRAZIL_MATCHES } from "@/data/matches";
import { Trophy, Target, TrendingUp, TrendingDown } from "lucide-react";

export function CampaignSummary() {
  const { results } = useSimulatorStore();

  const stats = useMemo(() => computeCampaignStats(results), [results]);
  const simulated = Object.keys(results).filter((id) =>
    ALL_BRAZIL_MATCHES.some((m) => m.id === id)
  ).length;
  const total = ALL_BRAZIL_MATCHES.length;

  if (simulated === 0) return null;

  const gamesPlayed = stats.wins + stats.draws + stats.losses;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h2 className="font-bold text-neutral-900 dark:text-white">
          Campanha do Brasil
        </h2>
        <span className="ml-auto text-xs text-neutral-500">
          {simulated}/{total} jogos simulados
        </span>
      </div>

      {/* Win/draw/loss bar */}
      {gamesPlayed > 0 && (
        <div className="mb-4">
          <div className="flex h-4 overflow-hidden rounded-full">
            <div
              className="bg-green-500 transition-all"
              style={{ width: `${(stats.wins / gamesPlayed) * 100}%` }}
              title={`${stats.wins} vitória(s)`}
            />
            <div
              className="bg-yellow-400 transition-all"
              style={{ width: `${(stats.draws / gamesPlayed) * 100}%` }}
              title={`${stats.draws} empate(s)`}
            />
            <div
              className="bg-red-400 transition-all"
              style={{ width: `${(stats.losses / gamesPlayed) * 100}%` }}
              title={`${stats.losses} derrota(s)`}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              {stats.wins}V
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" />
              {stats.draws}E
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
              {stats.losses}D
            </span>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
          label="Pontos"
          value={stats.points}
          color="text-green-600 dark:text-green-400"
        />
        <StatBox
          icon={<Target className="h-4 w-4 text-blue-500" />}
          label="Gols pró"
          value={stats.goalsFor}
          color="text-blue-600 dark:text-blue-400"
        />
        <StatBox
          icon={
            stats.goalDiff >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )
          }
          label="Saldo"
          value={stats.goalDiff >= 0 ? `+${stats.goalDiff}` : String(stats.goalDiff)}
          color={stats.goalDiff >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
        />
      </div>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800">
      {icon}
      <span className={`mt-1 text-xl font-black ${color}`}>{value}</span>
      <span className="text-xs text-neutral-500">{label}</span>
    </div>
  );
}
