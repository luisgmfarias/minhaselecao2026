"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MatchResult, SimulationMode, MatchOutcome } from "@/types";
import { outcomeFromScores } from "@/lib/utils/simulationUtils";

interface SimulatorStore {
  mode: SimulationMode;
  results: Record<string, MatchResult>;

  // actions
  setMode: (mode: SimulationMode) => void;
  setSimpleResult: (matchId: string, outcome: MatchOutcome) => void;
  setAdvancedResult: (matchId: string, homeScore: number, awayScore: number) => void;
  clearResult: (matchId: string) => void;
  resetAll: () => void;
  loadResults: (results: Record<string, MatchResult>, mode?: SimulationMode) => void;
}

export const useSimulatorStore = create<SimulatorStore>()(
  persist(
    (set) => ({
      mode: "simple",
      results: {},

      setMode(mode) {
        set({ mode });
      },

      setSimpleResult(matchId, outcome) {
        set((state) => ({
          results: {
            ...state.results,
            [matchId]: { mode: "simple", outcome },
          },
        }));
      },

      setAdvancedResult(matchId, homeScore, awayScore) {
        set((state) => ({
          results: {
            ...state.results,
            [matchId]: {
              mode: "advanced",
              homeScore,
              awayScore,
              outcome: outcomeFromScores(homeScore, awayScore),
            },
          },
        }));
      },

      clearResult(matchId) {
        set((state) => {
          const next = { ...state.results };
          delete next[matchId];
          return { results: next };
        });
      },

      resetAll() {
        set({ results: {} });
      },

      loadResults(results, mode) {
        set((state) => ({
          results,
          mode: mode ?? state.mode,
        }));
      },
    }),
    {
      name: "simulator-storage",
      partialize: (state) => ({ mode: state.mode, results: state.results }),
    }
  )
);
