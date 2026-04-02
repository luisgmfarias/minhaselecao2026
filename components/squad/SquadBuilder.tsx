"use client";

import { useState, useMemo, useCallback } from "react";
import { PLAYERS } from "@/data/players";
import { useSquadStore } from "@/lib/store/squadStore";
import { countByPosition, getSelectedPlayers } from "@/lib/utils/squadValidation";
import { PlayerCard } from "./PlayerCard";
import { PlayerFilters } from "./PlayerFilters";
import { SquadSummaryPanel } from "./SquadSummaryPanel";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { addToast } from "@/components/ui/Toast";
import { buildShareUrl } from "@/lib/utils/urlState";
import { copyToClipboard, getWhatsAppUrl, getFacebookUrl } from "@/lib/utils/shareUtils";
import { LineupModal } from "./LineupModal";
import { useLineupStore } from "@/lib/store/lineupStore";
import { SQUAD_TOTAL } from "@/data/config";
import type { PositionGroup } from "@/types";
import { RotateCcw, Wand2, Share2 } from "lucide-react";

export function SquadBuilder() {
  const {
    selectedIds,
    togglePlayer,
    resetSquad,
    fillExample,
    isSelected,
    canAdd,
  } = useSquadStore();

  const [search, setSearch] = useState("");
  const [activePosition, setActivePosition] = useState<PositionGroup | "all">("all");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const { getAssignment } = useLineupStore();

  const selectedPlayers = getSelectedPlayers(selectedIds);
  const counts = countByPosition(selectedPlayers);
  const totalSelected = selectedIds.length;
  const isComplete = totalSelected === SQUAD_TOTAL;

  const filteredPlayers = useMemo(() => {
    return PLAYERS.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.club.toLowerCase().includes(search.toLowerCase());
      const matchesPosition =
        activePosition === "all" || p.position === activePosition;
      return matchesSearch && matchesPosition;
    }).sort((a, b) => {
      // Sort selected first, then alpha
      const aSelected = selectedIds.includes(a.id);
      const bSelected = selectedIds.includes(b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return a.name.localeCompare(b.name, "pt-BR");
    });
  }, [search, activePosition, selectedIds]);

  const handleShare = useCallback(async () => {
    if (!isComplete) return;
    setShowShareModal(true);
  }, [isComplete]);

  const shareUrl = buildShareUrl({ squad: selectedIds, lineup: getAssignment() });

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) addToast("Link copiado! 🔗", "success");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Mobile sticky header */}
      <div className="mb-4 flex items-center justify-between sm:hidden">
        <div>
          <h1 className="text-xl font-black text-neutral-900 dark:text-white">
            Montar Convocação
          </h1>
          <p className="text-sm text-neutral-500">
            {totalSelected}/{SQUAD_TOTAL} selecionados
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowResetModal(true)}
            aria-label="Reiniciar seleção"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={fillExample}
            aria-label="Preencher exemplo"
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: player list */}
        <div className="space-y-4">
          {/* Desktop heading */}
          <div className="hidden sm:flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-neutral-900 dark:text-white">
                Monte sua Convocação 🇧🇷
              </h1>
              <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                Selecione exatamente 26 jogadores para sua convocação ideal do Brasil
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowResetModal(true)}>
                <RotateCcw className="mr-1.5 h-4 w-4" />
                Reiniciar
              </Button>
              <Button variant="outline" size="sm" onClick={fillExample}>
                <Wand2 className="mr-1.5 h-4 w-4" />
                Preencher exemplo
              </Button>
            </div>
          </div>

          {/* Filters */}
          <PlayerFilters
            search={search}
            onSearchChange={setSearch}
            activePosition={activePosition}
            onPositionChange={setActivePosition}
          />

          {/* Player count info */}
          <p className="text-xs text-neutral-500">
            {filteredPlayers.length} jogador{filteredPlayers.length !== 1 ? "es" : ""} encontrado
            {filteredPlayers.length !== 1 ? "s" : ""}
          </p>

          {/* Player grid */}
          {filteredPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-700">
              <p className="text-neutral-500">Nenhum jogador encontrado.</p>
              <button
                onClick={() => { setSearch(""); setActivePosition("all"); }}
                className="mt-2 text-sm text-green-600 hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {filteredPlayers.map((player) => {
                const selected = isSelected(player.id);
                const addable = selected ? true : canAdd(player.position);
                return (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    isSelected={selected}
                    canAdd={addable}
                    onToggle={() => togglePlayer(player.id, player.position)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Right: summary panel (desktop sticky) */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <SquadSummaryPanel
            onLineup={isComplete ? () => setShowLineupModal(true) : undefined}
            onShare={isComplete ? handleShare : undefined}
          />
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      {isComplete && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white/95 backdrop-blur-sm p-3 lg:hidden dark:border-neutral-800 dark:bg-neutral-950/95">
          <div className="flex gap-2">
            <Button variant="outline" size="lg" onClick={() => setShowLineupModal(true)} className="flex-1">
              ⚽ Escalar
            </Button>
            <Button fullWidth size="lg" variant="secondary" onClick={handleShare} className="flex-1">
              <Share2 className="mr-2 h-5 w-5" />
              Compartilhar
            </Button>
          </div>
        </div>
      )}

      {/* Lineup modal */}
      <LineupModal
        open={showLineupModal}
        onClose={() => setShowLineupModal(false)}
        selectedIds={selectedIds}
      />

      {/* Reset confirmation modal */}
      <Modal open={showResetModal} onClose={() => setShowResetModal(false)} title="Reiniciar convocação?">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Todos os jogadores selecionados serão removidos. Essa ação não pode ser desfeita.
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="ghost" fullWidth onClick={() => setShowResetModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => {
              resetSquad();
              setShowResetModal(false);
              addToast("Convocação reiniciada", "info");
            }}
          >
            Reiniciar
          </Button>
        </div>
      </Modal>

      {/* Share modal */}
      <Modal open={showShareModal} onClose={() => setShowShareModal(false)} title="Compartilhar Convocação 🇧🇷">
        <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          Compartilhe sua convocação de {SQUAD_TOTAL} jogadores com amigos!
        </p>

        {/* URL preview */}
        <div className="mb-4 rounded-xl bg-neutral-100 px-3 py-2 dark:bg-neutral-800">
          <p className="truncate text-xs text-neutral-500 font-mono">{shareUrl}</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            onClick={() => {
              window.open(getWhatsAppUrl(shareUrl), "_blank", "noopener");
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1ebe5a] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </button>
          <button
            onClick={() => {
              window.open(getFacebookUrl(shareUrl), "_blank", "noopener");
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] px-4 py-3 text-sm font-semibold text-white hover:bg-[#166fe5] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
        </div>

        <div className="mt-2">
          <Button variant="outline" fullWidth onClick={handleCopyLink}>
            📋 Copiar link
          </Button>
        </div>
      </Modal>
    </div>
  );
}
