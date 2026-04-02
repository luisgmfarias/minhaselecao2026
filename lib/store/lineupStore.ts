"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PLAYERS } from "@/data/players";
import { FORMATIONS, DEFAULT_FORMATION, getFormation } from "@/data/formations";
import type { FormationDef, SlotDef } from "@/data/formations";
import type { LineupAssignment } from "@/types";

interface LineupStore {
  formation: string;
  slots: Record<string, string | null>; // slotId → playerId | null

  setFormation: (formationId: string, selectedIds: string[]) => void;
  assignPlayer: (slotId: string, playerId: string | null) => void;
  autoFill: (selectedIds: string[]) => void;
  reset: () => void;
  loadFromAssignment: (assignment: LineupAssignment) => void;
  getAssignment: () => LineupAssignment;
}

// ─── Auto-fill algorithm ──────────────────────────────────────────────────────

function buildAutoAssignment(
  formation: FormationDef,
  selectedIds: string[]
): Record<string, string | null> {
  const players = PLAYERS.filter((p) => selectedIds.includes(p.id));
  const used = new Set<string>();
  const result: Record<string, string | null> = {};

  // Process slots in role order: GK → DEF → MID → ATT
  const roleOrder: Record<string, number> = { GK: 0, DEF: 1, MID: 2, ATT: 3 };
  const ordered = [...formation.slots].sort(
    (a, b) => roleOrder[a.role] - roleOrder[b.role]
  );

  for (const slot of ordered) {
    const pick = findBestPlayer(slot, players, used);
    result[slot.id] = pick ?? null;
    if (pick) used.add(pick);
  }

  return result;
}

function findBestPlayer(
  slot: SlotDef,
  players: ReturnType<typeof PLAYERS.filter>,
  used: Set<string>
): string | null {
  const available = players.filter((p) => !used.has(p.id));

  // Score each player: lower = better
  const scored = available.map((p) => {
    const posIndex = slot.preferredPositions.indexOf(p.position);
    const posScore = posIndex === -1 ? 999 : posIndex;
    const titularScore = p.tags?.includes("titular") ? 0 : 1;
    return { id: p.id, score: posScore * 10 + titularScore };
  });

  // Must match a preferred position; fall back to any available if needed
  const preferred = scored.filter(
    (s) => s.score < 990
  );
  const pool = preferred.length > 0 ? preferred : scored;
  if (pool.length === 0) return null;

  pool.sort((a, b) => a.score - b.score);
  return pool[0].id;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useLineupStore = create<LineupStore>()(
  persist(
    (set, get) => ({
      formation: DEFAULT_FORMATION,
      slots: {},

      setFormation(formationId, selectedIds) {
        const def = getFormation(formationId);
        const slots = buildAutoAssignment(def, selectedIds);
        set({ formation: formationId, slots });
      },

      assignPlayer(slotId, playerId) {
        const { slots } = get();
        const newSlots = { ...slots };

        // If the player is already in another slot, swap
        if (playerId) {
          const currentSlot = Object.entries(newSlots).find(
            ([, pid]) => pid === playerId
          );
          if (currentSlot) {
            newSlots[currentSlot[0]] = newSlots[slotId] ?? null;
          }
        }

        newSlots[slotId] = playerId;
        set({ slots: newSlots });
      },

      autoFill(selectedIds) {
        const { formation } = get();
        const def = getFormation(formation);
        set({ slots: buildAutoAssignment(def, selectedIds) });
      },

      reset() {
        set({ formation: DEFAULT_FORMATION, slots: {} });
      },

      loadFromAssignment(assignment) {
        set({ formation: assignment.formation, slots: { ...assignment.slots } });
      },

      getAssignment(): LineupAssignment {
        const { formation, slots } = get();
        const filled: Record<string, string> = {};
        for (const [slotId, playerId] of Object.entries(slots)) {
          if (playerId) filled[slotId] = playerId;
        }
        return { formation, slots: filled };
      },
    }),
    {
      name: "lineup-storage",
      partialize: (state) => ({ formation: state.formation, slots: state.slots }),
    }
  )
);

export { FORMATIONS };
