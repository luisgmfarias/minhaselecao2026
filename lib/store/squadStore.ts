"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SUGGESTED_SQUAD_IDS } from "@/data/players";
import { SQUAD_TOTAL } from "@/data/config";
import {
  canSelectMore,
  countByPosition,
  getSelectedPlayers,
} from "@/lib/utils/squadValidation";
import type { PositionGroup } from "@/types";

interface SquadStore {
  selectedIds: string[];

  // actions
  togglePlayer: (id: string, position: PositionGroup) => void;
  selectPlayer: (id: string) => void;
  removePlayer: (id: string) => void;
  resetSquad: () => void;
  fillExample: () => void;
  loadFromIds: (ids: string[]) => void;

  // derived helpers
  isSelected: (id: string) => boolean;
  canAdd: (position: PositionGroup) => boolean;
}

export const useSquadStore = create<SquadStore>()(
  persist(
    (set, get) => ({
      selectedIds: [],

      togglePlayer(id, position) {
        const { selectedIds } = get();
        if (selectedIds.includes(id)) {
          set({ selectedIds: selectedIds.filter((sid) => sid !== id) });
        } else {
          const players = getSelectedPlayers(selectedIds);
          const counts = countByPosition(players);
          const currentCount = counts[position] ?? 0;
          const { canAdd } = canSelectMore(position, currentCount, selectedIds.length);
          if (canAdd) {
            set({ selectedIds: [...selectedIds, id] });
          }
        }
      },

      selectPlayer(id) {
        const { selectedIds } = get();
        if (!selectedIds.includes(id) && selectedIds.length < SQUAD_TOTAL) {
          set({ selectedIds: [...selectedIds, id] });
        }
      },

      removePlayer(id) {
        set((state) => ({
          selectedIds: state.selectedIds.filter((sid) => sid !== id),
        }));
      },

      resetSquad() {
        set({ selectedIds: [] });
      },

      fillExample() {
        set({ selectedIds: [...SUGGESTED_SQUAD_IDS] });
      },

      loadFromIds(ids) {
        set({ selectedIds: ids.slice(0, SQUAD_TOTAL) });
      },

      isSelected(id) {
        return get().selectedIds.includes(id);
      },

      canAdd(position) {
        const { selectedIds } = get();
        const players = getSelectedPlayers(selectedIds);
        const counts = countByPosition(players);
        const currentCount = counts[position] ?? 0;
        return canSelectMore(position, currentCount, selectedIds.length).canAdd;
      },
    }),
    {
      name: "squad-storage",
      partialize: (state) => ({ selectedIds: state.selectedIds }),
    }
  )
);
