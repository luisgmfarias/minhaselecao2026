"use client";

import { cn } from "@/lib/utils/cn";
import type { TeamStanding } from "@/types";

interface GroupStandingsTableProps {
  groupId: string;
  standings: TeamStanding[];
}

export function GroupStandingsTable({
  groupId,
  standings,
}: GroupStandingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" aria-label={`Classificação Grupo ${groupId}`}>
        <thead>
          <tr className="border-b border-neutral-100 dark:border-neutral-800">
            <th className="py-1.5 pr-1 text-left font-semibold text-neutral-400 w-6">#</th>
            <th className="py-1.5 text-left font-semibold text-neutral-400">Equipe</th>
            <th className="py-1.5 px-1 text-center font-semibold text-neutral-400 w-6" title="Jogos">J</th>
            <th className="py-1.5 px-1 text-center font-semibold text-neutral-400 w-6" title="Vitórias">V</th>
            <th className="py-1.5 px-1 text-center font-semibold text-neutral-400 w-6" title="Empates">E</th>
            <th className="py-1.5 px-1 text-center font-semibold text-neutral-400 w-6" title="Derrotas">D</th>
            <th className="py-1.5 px-1 text-center font-semibold text-neutral-400 w-7" title="Gols Pró">GP</th>
            <th className="py-1.5 px-1 text-center font-semibold text-neutral-400 w-7" title="Gols Contra">GC</th>
            <th className="py-1.5 px-1 text-center font-semibold text-neutral-400 w-7" title="Saldo de Gols">SG</th>
            <th className="py-1.5 pl-1 text-center font-bold text-neutral-600 dark:text-neutral-300 w-8" title="Pontos">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, idx) => {
            const position = idx + 1;
            const isQualifier = position <= 2;
            const isThird = position === 3;
            const isBrasil = team.teamName === "Brasil";

            return (
              <tr
                key={team.teamId}
                className={cn(
                  "border-b border-neutral-50 dark:border-neutral-800/50 transition-colors",
                  isBrasil && "bg-green-50/60 dark:bg-green-900/10",
                  !isBrasil && isQualifier && "bg-neutral-50/50 dark:bg-neutral-800/20"
                )}
              >
                <td className="py-1.5 pr-1">
                  <div className="flex items-center">
                    {isQualifier && (
                      <div className="mr-1 h-3.5 w-0.5 rounded-full bg-green-500" />
                    )}
                    {isThird && (
                      <div className="mr-1 h-3.5 w-0.5 rounded-full bg-yellow-400" />
                    )}
                    {!isQualifier && !isThird && (
                      <div className="mr-1 h-3.5 w-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                    )}
                    <span
                      className={cn(
                        "font-bold",
                        isQualifier
                          ? "text-green-600 dark:text-green-400"
                          : isThird
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-neutral-400"
                      )}
                    >
                      {position}
                    </span>
                  </div>
                </td>
                <td className="py-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">{team.teamFlag}</span>
                    <span
                      className={cn(
                        "font-semibold truncate max-w-[90px]",
                        isBrasil
                          ? "text-green-700 dark:text-green-400"
                          : "text-neutral-800 dark:text-neutral-200"
                      )}
                    >
                      {team.teamName}
                    </span>
                  </div>
                </td>
                <td className="py-1.5 px-1 text-center text-neutral-600 dark:text-neutral-400">{team.played}</td>
                <td className="py-1.5 px-1 text-center text-neutral-600 dark:text-neutral-400">{team.won}</td>
                <td className="py-1.5 px-1 text-center text-neutral-600 dark:text-neutral-400">{team.drawn}</td>
                <td className="py-1.5 px-1 text-center text-neutral-600 dark:text-neutral-400">{team.lost}</td>
                <td className="py-1.5 px-1 text-center text-neutral-600 dark:text-neutral-400">{team.goalsFor}</td>
                <td className="py-1.5 px-1 text-center text-neutral-600 dark:text-neutral-400">{team.goalsAgainst}</td>
                <td className="py-1.5 px-1 text-center text-neutral-600 dark:text-neutral-400">
                  {team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}
                </td>
                <td className="py-1.5 pl-1 text-center">
                  <span className="font-black text-neutral-900 dark:text-white">
                    {team.points}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-1 rounded-full bg-green-500" />
          Classifica
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-1 rounded-full bg-yellow-400" />
          Possível 3º
        </span>
      </div>
    </div>
  );
}
