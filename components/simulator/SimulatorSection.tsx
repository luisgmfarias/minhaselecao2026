"use client";

import { useState } from "react";
import { useSimulatorStore } from "@/lib/store/simulatorStore";
import { useSquadStore } from "@/lib/store/squadStore";
import { GroupCard } from "./GroupCard";
import { KnockoutBracket } from "./KnockoutBracket";
import { CampaignSummary } from "./CampaignSummary";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { addToast } from "@/components/ui/Toast";
import { buildShareUrl } from "@/lib/utils/urlState";
import { copyToClipboard, getWhatsAppUrl, getFacebookUrl } from "@/lib/utils/shareUtils";
import { GROUPS } from "@/data/groups";
import { KNOCKOUT_MATCHES } from "@/lib/utils/bracketUtils";
import { RotateCcw, Share2, Zap, Settings2, Trophy, Network } from "lucide-react";

// Total matches: 72 group stage + 31 knockout (16 R32 + 8 R16 + 4 QF + 2 SF + 1 3rd + 1 Final) = wait, 16+8+4+2+1+1 = 32 KO => 72+32=104
// Actually: 72 group + KNOCKOUT_MATCHES.length
const TOTAL_MATCHES = 72 + KNOCKOUT_MATCHES.length;

type Tab = "grupos" | "chaveamento";

export function SimulatorSection() {
  const { mode, setMode, resetAll, results } = useSimulatorStore();
  const { selectedIds } = useSquadStore();
  const [activeTab, setActiveTab] = useState<Tab>("grupos");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const simulated = Object.keys(results).length;
  const shareUrl = buildShareUrl({ squad: selectedIds, results, mode });

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) addToast("Link copiado! 🔗", "success");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Simulador da Copa 2026 🏆
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Simule todos os {TOTAL_MATCHES} jogos da Copa do Mundo 2026
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* Progress badge */}
          <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            {simulated}/{TOTAL_MATCHES} simulados
          </span>
          <Button variant="ghost" size="sm" onClick={() => setShowResetModal(true)}>
            <RotateCcw className="mr-1.5 h-4 w-4" />
            Reiniciar
          </Button>
          {simulated > 0 && (
            <Button variant="secondary" size="sm" onClick={() => setShowShareModal(true)}>
              <Share2 className="mr-1.5 h-4 w-4" />
              Compartilhar
            </Button>
          )}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="mb-5 flex rounded-xl border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-900">
        <button
          onClick={() => setMode("simple")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
            mode === "simple"
              ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          }`}
          aria-pressed={mode === "simple"}
        >
          <Zap className="h-4 w-4" />
          Modo Simples
        </button>
        <button
          onClick={() => setMode("advanced")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
            mode === "advanced"
              ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          }`}
          aria-pressed={mode === "advanced"}
        >
          <Settings2 className="h-4 w-4" />
          Modo Avançado
        </button>
      </div>

      <p className="mb-5 text-xs text-neutral-500 dark:text-neutral-400">
        {mode === "simple"
          ? "Escolha o vencedor de cada jogo ou marque empate."
          : "Digite o placar exato de cada jogo."}
      </p>

      {/* Campaign summary */}
      <div className="mb-6">
        <CampaignSummary />
      </div>

      {/* Tab navigation */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab("grupos")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === "grupos"
              ? "bg-green-600 text-white shadow-sm"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
          }`}
          aria-selected={activeTab === "grupos"}
          role="tab"
        >
          <span className="text-base">🔵</span>
          Grupos
          <span className={`rounded-full px-1.5 py-0.5 text-xs ${
            activeTab === "grupos" ? "bg-white/20" : "bg-neutral-200 dark:bg-neutral-700"
          }`}>
            72
          </span>
        </button>
        <button
          onClick={() => setActiveTab("chaveamento")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === "chaveamento"
              ? "bg-green-600 text-white shadow-sm"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
          }`}
          aria-selected={activeTab === "chaveamento"}
          role="tab"
        >
          <Network className="h-4 w-4" />
          Chaveamento
          <span className={`rounded-full px-1.5 py-0.5 text-xs ${
            activeTab === "chaveamento" ? "bg-white/20" : "bg-neutral-200 dark:bg-neutral-700"
          }`}>
            {KNOCKOUT_MATCHES.length}
          </span>
        </button>
      </div>

      {/* Groups tab */}
      {activeTab === "grupos" && (
        <section aria-labelledby="groups-heading">
          <h2 id="groups-heading" className="sr-only">Fase de Grupos</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {GROUPS.map((group) => (
              <GroupCard key={group.id} groupId={group.id} mode={mode} />
            ))}
          </div>
        </section>
      )}

      {/* Knockout tab */}
      {activeTab === "chaveamento" && (
        <section aria-labelledby="knockout-heading">
          <h2 id="knockout-heading" className="sr-only">Fase Eliminatória</h2>
          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10 px-4 py-3">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              ℹ️ O chaveamento considera os resultados dos grupos quando simulados. Simule os grupos primeiro para ver os confrontos automaticamente.
            </p>
          </div>
          <KnockoutBracket mode={mode} />
        </section>
      )}

      {/* Mobile share bar */}
      {simulated > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white/95 backdrop-blur-sm p-4 sm:hidden dark:border-neutral-800 dark:bg-neutral-950/95 z-40">
          <Button fullWidth size="lg" variant="secondary" onClick={() => setShowShareModal(true)}>
            <Share2 className="mr-2 h-5 w-5" />
            Compartilhar resultados
          </Button>
        </div>
      )}

      {/* Reset modal */}
      <Modal open={showResetModal} onClose={() => setShowResetModal(false)} title="Reiniciar simulação?">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Todos os resultados simulados serão apagados.
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="ghost" fullWidth onClick={() => setShowResetModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => {
              resetAll();
              setShowResetModal(false);
              addToast("Simulação reiniciada", "info");
            }}
          >
            Reiniciar
          </Button>
        </div>
      </Modal>

      {/* Share modal */}
      <Modal open={showShareModal} onClose={() => setShowShareModal(false)} title="Compartilhar Simulação 🏆">
        <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          Compartilhe sua simulação da Copa com {simulated} jogo(s) simulado(s).
        </p>

        <div className="mb-4 rounded-xl bg-neutral-100 px-3 py-2 dark:bg-neutral-800">
          <p className="truncate text-xs font-mono text-neutral-500">{shareUrl}</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            onClick={() => window.open(getWhatsAppUrl(shareUrl), "_blank", "noopener")}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1ebe5a] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>
          <button
            onClick={() => window.open(getFacebookUrl(shareUrl), "_blank", "noopener")}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] px-4 py-3 text-sm font-semibold text-white hover:bg-[#166fe5] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
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
