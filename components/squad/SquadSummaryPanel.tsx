"use client";

import { useSquadStore } from "@/lib/store/squadStore";
import { getSelectedPlayers, countByPosition } from "@/lib/utils/squadValidation";
import { POSITION_ORDER, POSITION_ABBREVIATIONS, SQUAD_TOTAL, POSITION_LIMITS } from "@/data/config";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SelectedPlayerChip } from "./PlayerCard";
import { Button } from "@/components/ui/Button";

interface Props {
  onLineup?: () => void;
  onShare?: () => void;
}

export function SquadSummaryPanel({ onLineup, onShare }: Props) {
  const { selectedIds, removePlayer } = useSquadStore();
  const selectedPlayers = getSelectedPlayers(selectedIds);
  const counts = countByPosition(selectedPlayers);
  const totalSelected = selectedIds.length;
  const remaining = SQUAD_TOTAL - totalSelected;
  const isComplete = totalSelected === SQUAD_TOTAL;

  return (
    <aside className="flex flex-col gap-4" aria-label="Resumo da convocação">
      {/* Progress header */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-neutral-900 dark:text-white">
            Sua Convocação
          </h2>
          <span
            className={`text-sm font-bold ${
              isComplete ? "text-yellow-500" : "text-green-600"
            }`}
          >
            {totalSelected}/{SQUAD_TOTAL}
          </span>
        </div>

        <ProgressBar value={totalSelected} max={SQUAD_TOTAL} className="mt-3" />

        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {isComplete
            ? "🏆 Convocação completa!"
            : `Faltam ${remaining} jogador${remaining !== 1 ? "es" : ""}`}
        </p>
      </div>

      {/* Position breakdown */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Por Posição
        </h3>
        <ul className="space-y-2">
          {POSITION_ORDER.map((pos) => {
            const count = counts[pos] ?? 0;
            const limit = POSITION_LIMITS[pos];
            return (
              <li key={pos} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-xs font-bold text-neutral-500">
                  {POSITION_ABBREVIATIONS[pos]}
                </span>
                <ProgressBar
                  value={count}
                  max={limit}
                  className="flex-1"
                  colorClass="bg-green-400"
                />
                <span className="w-10 text-right text-xs text-neutral-600 dark:text-neutral-400">
                  {count}/{limit}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Selected players list */}
      {selectedPlayers.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Convocados ({totalSelected})
          </h3>
          <div className="space-y-1.5 max-h-96 overflow-y-auto">
            {POSITION_ORDER.map((pos) => {
              const posPlayers = selectedPlayers.filter((p) => p.position === pos);
              if (posPlayers.length === 0) return null;
              return (
                <div key={pos}>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {pos}
                  </p>
                  {posPlayers.map((p) => (
                    <div key={p.id} className="mb-1">
                      <SelectedPlayerChip
                        player={p}
                        onRemove={() => removePlayer(p.id)}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      {isComplete && (
        <div className="flex flex-col gap-2">
          {onLineup && (
            <Button onClick={onLineup} variant="outline" fullWidth size="lg">
              ⚽ Escalar minha seleção
            </Button>
          )}
          {onShare && (
            <Button onClick={onShare} variant="secondary" fullWidth size="lg">
              🇧🇷 Compartilhar minha seleção
            </Button>
          )}
        </div>
      )}
    </aside>
  );
}
