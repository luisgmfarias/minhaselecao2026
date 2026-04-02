"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { POSITION_ORDER } from "@/data/config";
import type { PositionGroup } from "@/types";

interface PlayerFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  activePosition: PositionGroup | "all";
  onPositionChange: (pos: PositionGroup | "all") => void;
}

export function PlayerFilters({
  search,
  onSearchChange,
  activePosition,
  onPositionChange,
}: PlayerFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          placeholder="Buscar jogador..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-9 text-sm",
            "placeholder:text-neutral-400",
            "focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20",
            "dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500"
          )}
          aria-label="Buscar jogador por nome"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-neutral-400 hover:text-neutral-600"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Position filter pills */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por posição">
        <button
          onClick={() => onPositionChange("all")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            activePosition === "all"
              ? "border-green-500 bg-green-500 text-white"
              : "border-neutral-200 bg-white text-neutral-600 hover:border-green-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
          )}
          aria-pressed={activePosition === "all"}
        >
          Todos
        </button>
        {POSITION_ORDER.map((pos) => (
          <button
            key={pos}
            onClick={() => onPositionChange(pos)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              activePosition === pos
                ? "border-green-500 bg-green-500 text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-green-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
            )}
            aria-pressed={activePosition === pos}
          >
            {pos}
          </button>
        ))}
      </div>
    </div>
  );
}
