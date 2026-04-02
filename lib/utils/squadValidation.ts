import { PLAYERS } from "@/data/players";
import { POSITION_LIMITS, SQUAD_TOTAL } from "@/data/config";
import type { Player, PositionGroup, SquadValidationResult } from "@/types";

export function getSelectedPlayers(selectedIds: string[]): Player[] {
  return selectedIds
    .map((id) => PLAYERS.find((p) => p.id === id))
    .filter((p): p is Player => p !== undefined);
}

export function countByPosition(players: Player[]): Record<PositionGroup, number> {
  const counts = {} as Record<PositionGroup, number>;
  for (const player of players) {
    counts[player.position] = (counts[player.position] ?? 0) + 1;
  }
  return counts;
}

export function validateSquad(selectedIds: string[]): SquadValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const players = getSelectedPlayers(selectedIds);
  const counts = countByPosition(players);

  if (selectedIds.length !== SQUAD_TOTAL) {
    errors.push(
      `A convocação deve ter exatamente ${SQUAD_TOTAL} jogadores (atual: ${selectedIds.length}).`
    );
  }

  for (const [position, limit] of Object.entries(POSITION_LIMITS) as [PositionGroup, number][]) {
    const count = counts[position] ?? 0;
    if (count > limit) {
      errors.push(
        `Máximo de ${limit} ${position} permitido (selecionado: ${count}).`
      );
    }
  }

  // Warn if no goalkeeper
  if (!counts["Goleiros"] || counts["Goleiros"] < 1) {
    warnings.push("Nenhum goleiro selecionado.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function canSelectMore(
  position: PositionGroup,
  currentCount: number,
  totalSelected: number
): { canAdd: boolean; reason?: string } {
  const positionLimit = POSITION_LIMITS[position];
  const remainingTotal = SQUAD_TOTAL - totalSelected;

  if (totalSelected >= SQUAD_TOTAL) {
    return { canAdd: false, reason: "Convocação completa (26 jogadores)" };
  }

  if (currentCount >= positionLimit) {
    return {
      canAdd: false,
      reason: `Limite de ${positionLimit} jogador(es) nesta posição`,
    };
  }

  if (remainingTotal <= 0) {
    return { canAdd: false, reason: "Convocação completa" };
  }

  return { canAdd: true };
}
