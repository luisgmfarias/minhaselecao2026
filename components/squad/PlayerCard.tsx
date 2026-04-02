"use client";

import { useState } from "react";
import { Check, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/Badge";
import { POSITION_ABBREVIATIONS, POSITION_COLORS } from "@/data/config";
import type { Player } from "@/types";

interface PlayerCardProps {
  player: Player;
  isSelected: boolean;
  canAdd: boolean;
  onToggle: () => void;
}

function PlayerAvatar({ player }: { player: Player }) {
  const [imgError, setImgError] = useState(false);

  const colors = [
    "from-green-500 to-green-700",
    "from-yellow-400 to-yellow-600",
    "from-blue-500 to-blue-700",
    "from-emerald-500 to-emerald-700",
    "from-teal-500 to-teal-700",
  ];
  const idx = player.name.charCodeAt(0) % colors.length;
  const initials = player.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  if (player.image && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={player.image}
        alt={player.name}
        onError={() => setImgError(true)}
        className="h-12 w-12 shrink-0 rounded-full object-cover object-top"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white text-sm font-bold",
        colors[idx]
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export function PlayerCard({ player, isSelected, canAdd, onToggle }: PlayerCardProps) {
  const isDisabled = !isSelected && !canAdd;

  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1",
        isSelected
          ? "border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/20"
          : isDisabled
          ? "cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-50 dark:border-neutral-800 dark:bg-neutral-900/50"
          : "border-neutral-200 bg-white hover:border-green-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-green-700"
      )}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? "Remover" : "Adicionar"} ${player.name}`}
    >
      <PlayerAvatar player={player} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
            {player.name}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            {player.tags?.includes("titular") && (
              <span className="hidden text-xs text-yellow-600 sm:inline">⭐</span>
            )}
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border transition-all",
                isSelected
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-neutral-300 text-neutral-400 group-hover:border-green-400 dark:border-neutral-700"
              )}
            >
              {isSelected ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "border text-[10px] font-bold leading-none",
              POSITION_COLORS[player.position]
            )}
          >
            {POSITION_ABBREVIATIONS[player.position]}
          </Badge>
          <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
            {player.club}
            {player.countryClub && ` · ${player.countryClub}`}
          </span>
          {player.age && (
            <span className="ml-auto shrink-0 text-xs text-neutral-400">
              {player.age} anos
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Compact selected player chip ─────────────────────────────────────────────

interface SelectedPlayerChipProps {
  player: Player;
  onRemove: () => void;
}

export function SelectedPlayerChip({ player, onRemove }: SelectedPlayerChipProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-800/50 dark:bg-green-900/20">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
          {player.name}
        </p>
        <p className="text-xs text-neutral-500">{player.club}</p>
      </div>
      <button
        onClick={onRemove}
        className="ml-2 shrink-0 rounded-full p-1 text-neutral-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
        aria-label={`Remover ${player.name}`}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
