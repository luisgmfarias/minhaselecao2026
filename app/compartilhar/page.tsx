"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { parseShareUrl } from "@/lib/utils/urlState";
import { useSquadStore } from "@/lib/store/squadStore";
import { useSimulatorStore } from "@/lib/store/simulatorStore";
import { getSelectedPlayers } from "@/lib/utils/squadValidation";
import { computeCampaignStats, getBrazilOutcome } from "@/lib/utils/simulationUtils";
import { ALL_BRAZIL_MATCHES } from "@/data/matches";
import { POSITION_ORDER, POSITION_ABBREVIATIONS } from "@/data/config";
import { copyToClipboard, getWhatsAppUrl, getFacebookUrl } from "@/lib/utils/shareUtils";
import { buildShareUrl } from "@/lib/utils/urlState";
import { addToast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Users, Trophy, Share2, ArrowLeft, CheckCircle, XCircle, Minus } from "lucide-react";
import { getFormation } from "@/data/formations";
import { PLAYERS } from "@/data/players";
import type { MatchResult, SharePayload } from "@/types";

// ─── Lineup view (static, read-only pitch) ────────────────────────────────────

function LineupView({
  formation,
  slots,
  squadIds = [],
}: {
  formation: string;
  slots: Record<string, string>;
  squadIds?: string[];
}) {
  const def = getFormation(formation);
  const startingIds = new Set(Object.values(slots));
  const benchPlayers = squadIds
    .map((id) => PLAYERS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p && !startingIds.has(p.id));

  return (
    <section className="mb-6 rounded-2xl border border-neutral-200 bg-white overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <span className="text-xl">⚽</span>
        <h2 className="font-bold text-neutral-900 dark:text-white">
          Escalação — <span className="text-green-600">{formation}</span>
        </h2>
      </div>

      {/* Pitch */}
      <div
        className="relative w-full"
        style={{ paddingBottom: "140%" }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #166534 0%, #15803d 30%, #16a34a 50%, #15803d 70%, #166534 100%)",
          }}
        />
        {/* SVG lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 140"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {(() => {
            const s = "rgba(255,255,255,0.45)";
            return (
              <>
                <rect x="1" y="1" width="98" height="138" fill="none" stroke={s} strokeWidth="0.8" />
                <line x1="1" y1="70" x2="99" y2="70" stroke={s} strokeWidth="0.6" />
                <ellipse cx="50" cy="70" rx="11" ry="8" fill="none" stroke={s} strokeWidth="0.6" />
                <circle cx="50" cy="70" r="0.8" fill={s} />
                <rect x="19" y="101" width="62" height="38" fill="none" stroke={s} strokeWidth="0.6" />
                <rect x="33" y="122" width="34" height="17" fill="none" stroke={s} strokeWidth="0.5" />
                <rect x="19" y="1" width="62" height="38" fill="none" stroke={s} strokeWidth="0.6" />
                <rect x="33" y="1" width="34" height="17" fill="none" stroke={s} strokeWidth="0.5" />
              </>
            );
          })()}
        </svg>

        {/* Formation label */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/30 rounded-full px-3 py-0.5">
          <span className="text-[10px] font-black text-white tracking-widest">{formation}</span>
        </div>

        {/* Player tokens */}
        {def.slots.map((slot) => {
          const playerId = slots[slot.id];
          const player = playerId ? PLAYERS.find((p) => p.id === playerId) : null;
          return (
            <div
              key={slot.id}
              className="absolute flex flex-col items-center gap-0.5 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden flex items-center justify-center bg-yellow-400 shadow-md">
                {player ? (
                  player.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <span className="text-[10px] font-black text-green-900">
                      {player.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                    </span>
                  )
                ) : (
                  <span className="text-[9px] font-bold text-white/70">{slot.label}</span>
                )}
              </div>
              <span className="text-[9px] font-bold text-white text-center w-14 truncate drop-shadow leading-tight">
                {player
                  ? player.name.length <= 9
                    ? player.name
                    : (() => {
                        const parts = player.name.split(" ");
                        return parts.length === 1
                          ? player.name.slice(0, 8) + "."
                          : `${parts[0][0]}. ${parts[parts.length - 1]}`;
                      })()
                  : "—"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Slot list + bench below pitch */}
      <div className="px-5 py-4 space-y-4">
        {/* Starters */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Titulares
          </p>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            {def.slots.map((slot) => {
              const playerId = slots[slot.id];
              const player = playerId ? PLAYERS.find((p) => p.id === playerId) : null;
              return (
                <div
                  key={slot.id}
                  className="flex items-center gap-2 rounded-lg bg-neutral-50 px-2.5 py-1.5 dark:bg-neutral-800"
                >
                  <span className="w-7 text-[10px] font-bold text-neutral-500 dark:text-neutral-400 shrink-0">
                    {slot.label}
                  </span>
                  <span className="truncate text-xs font-medium text-neutral-900 dark:text-white">
                    {player?.name ?? "—"}
                  </span>
                  {player && (
                    <span className="ml-auto shrink-0 text-[9px] text-neutral-400">
                      {POSITION_ABBREVIATIONS[player.position]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bench */}
        {benchPlayers.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Banco de Reservas ({benchPlayers.length})
            </p>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {benchPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-2 rounded-lg bg-neutral-50 px-2.5 py-1.5 dark:bg-neutral-800"
                >
                  <span className="w-7 text-[10px] font-bold text-neutral-500 dark:text-neutral-400 shrink-0">
                    {POSITION_ABBREVIATIONS[player.position]}
                  </span>
                  <span className="truncate text-xs font-medium text-neutral-900 dark:text-white">
                    {player.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SharePageContent() {
  const searchParams = useSearchParams();
  const [payload, setPayload] = useState<SharePayload | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { loadFromIds } = useSquadStore();
  const { loadResults } = useSimulatorStore();

  useEffect(() => {
    const parsed = parseShareUrl(searchParams.toString());
    if (parsed) {
      setPayload(parsed);
      if (parsed.squad?.length) loadFromIds(parsed.squad);
      if (parsed.results) loadResults(parsed.results as Record<string, MatchResult>, parsed.mode);
    }
    setLoaded(true);
  }, [searchParams, loadFromIds, loadResults]);

  if (!loaded) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (!payload || (!payload.squad?.length && !Object.keys(payload.results ?? {}).length)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-5xl mb-4">🤔</p>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
          Link inválido ou expirado
        </h1>
        <p className="mt-2 text-neutral-500">
          O link de compartilhamento não contém dados válidos.
        </p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white">
          <ArrowLeft className="h-4 w-4" /> Ir para o início
        </Link>
      </div>
    );
  }

  const squad = payload.squad ?? [];
  const results = (payload.results ?? {}) as Record<string, MatchResult>;
  const selectedPlayers = getSelectedPlayers(squad);
  const stats = computeCampaignStats(results);
  const shareUrl = buildShareUrl(payload);
  const simulatedCount = Object.keys(results).filter((id) =>
    ALL_BRAZIL_MATCHES.some((m) => m.id === id)
  ).length;

  const handleCopy = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) addToast("Link copiado!", "success");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
      >
        <ArrowLeft className="h-4 w-4" /> Início
      </Link>

      {/* Title card */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 p-6 text-white">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🇧🇷</span>
          <div>
            <h1 className="text-xl font-black">Minha Seleção 2026</h1>
            <p className="text-sm text-green-100">
              Convocação compartilhada · Copa do Mundo 2026
            </p>
          </div>
        </div>
      </div>

      {/* Squad section */}
      {selectedPlayers.length > 0 && (
        <section className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <h2 className="font-bold text-neutral-900 dark:text-white">
              Convocação ({selectedPlayers.length}/26)
            </h2>
          </div>

          <ProgressBar value={selectedPlayers.length} max={26} className="mb-4" />

          {POSITION_ORDER.map((pos) => {
            const posPlayers = selectedPlayers.filter((p) => p.position === pos);
            if (posPlayers.length === 0) return null;
            return (
              <div key={pos} className="mb-4">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="muted" className="text-[10px]">
                    {POSITION_ABBREVIATIONS[pos]}
                  </Badge>
                  <span className="text-xs font-semibold text-neutral-500">{pos}</span>
                  <span className="text-xs text-neutral-400">({posPlayers.length})</span>
                </div>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {posPlayers.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800"
                    >
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                          {p.name}
                        </p>
                        <p className="truncate text-xs text-neutral-500">{p.club}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Lineup section */}
      {payload.lineup && (
        <LineupView
          formation={payload.lineup.formation}
          slots={payload.lineup.slots}
          squadIds={squad}
        />
      )}

      {/* Simulation results */}
      {simulatedCount > 0 && (
        <section className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h2 className="font-bold text-neutral-900 dark:text-white">
              Campanha Simulada
            </h2>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            {[
              { label: "Vitórias", value: stats.wins, color: "text-green-600" },
              { label: "Empates", value: stats.draws, color: "text-yellow-600" },
              { label: "Derrotas", value: stats.losses, color: "text-red-600" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-800">
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-neutral-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Match list */}
          <div className="space-y-2">
            {ALL_BRAZIL_MATCHES.map((match) => {
              const result = results[match.id];
              if (!result) return null;
              const outcome = getBrazilOutcome(match.id, result);
              return (
                <div
                  key={match.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2.5 dark:border-neutral-800"
                >
                  <div className="flex items-center gap-2">
                    {outcome === "win" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {outcome === "draw" && <Minus className="h-4 w-4 text-yellow-500" />}
                    {outcome === "loss" && <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      {match.homeTeam} {match.homeFlag} vs {match.awayFlag} {match.awayTeam}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                    {result.mode === "advanced"
                      ? `${result.homeScore}–${result.awayScore}`
                      : outcome === "win"
                      ? "V"
                      : outcome === "draw"
                      ? "E"
                      : "D"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Share CTA */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-3 font-bold text-neutral-900 dark:text-white">
          Monte a sua também! 🇧🇷
        </h2>
        <p className="mb-4 text-sm text-neutral-500">
          Você viu a seleção de um amigo. Agora monte a sua e compare!
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Link href="/convocacao" className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
            <Users className="h-4 w-4" /> Montar minha seleção
          </Link>
          <Button variant="outline" onClick={handleCopy}>
            <Share2 className="mr-1.5 h-4 w-4" /> Copiar link
          </Button>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            onClick={() => window.open(getWhatsAppUrl(shareUrl), "_blank", "noopener")}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-sm font-semibold text-white"
          >
            WhatsApp
          </button>
          <button
            onClick={() => window.open(getFacebookUrl(shareUrl), "_blank", "noopener")}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] py-2.5 text-sm font-semibold text-white"
          >
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CompartilharPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
        </div>
      }
    >
      <SharePageContent />
    </Suspense>
  );
}
