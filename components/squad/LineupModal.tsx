"use client";

import { useState, useEffect } from "react";
import { X, RefreshCw, Check, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { FORMATIONS, getFormation } from "@/data/formations";
import { useLineupStore } from "@/lib/store/lineupStore";
import { PLAYERS } from "@/data/players";
import { POSITION_ABBREVIATIONS } from "@/data/config";
import type { SlotDef } from "@/data/formations";
import type { Player } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTokenName(name: string): string {
  if (name.length <= 10) return name;
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return name.slice(0, 9) + ".";
  const last = parts[parts.length - 1];
  if (last === "Jr." || last === "Júnior") return `${parts[0]} Jr.`;
  return last.length >= 4 ? last : `${parts[0][0]}. ${last}`;
}

function getPlayerById(id?: string | null): Player | null {
  if (!id) return null;
  return PLAYERS.find((p) => p.id === id) ?? null;
}

// ─── Pitch markings ───────────────────────────────────────────────────────────

function Pitch() {
  const s = "rgba(255,255,255,0.45)";
  return (
    <>
      {/* Grass stripes */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            to bottom,
            #15803d 0%, #15803d 12.5%,
            #166534 12.5%, #166534 25%
          )`,
        }}
      />
      {/* Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 140"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect x="1.5" y="1.5" width="97" height="137" fill="none" stroke={s} strokeWidth="0.7" />
        <line x1="1.5" y1="70" x2="98.5" y2="70" stroke={s} strokeWidth="0.6" />
        <ellipse cx="50" cy="70" rx="12" ry="8.5" fill="none" stroke={s} strokeWidth="0.6" />
        <circle cx="50" cy="70" r="0.9" fill={s} />
        {/* Bottom penalty box */}
        <rect x="18.5" y="102" width="63" height="37" fill="none" stroke={s} strokeWidth="0.6" />
        <rect x="33" y="122" width="34" height="17" fill="none" stroke={s} strokeWidth="0.5" />
        <circle cx="50" cy="114" r="0.8" fill={s} />
        {/* Top penalty box */}
        <rect x="18.5" y="1.5" width="63" height="37" fill="none" stroke={s} strokeWidth="0.6" />
        <rect x="33" y="1.5" width="34" height="17" fill="none" stroke={s} strokeWidth="0.5" />
        <circle cx="50" cy="27" r="0.8" fill={s} />
      </svg>
    </>
  );
}

// ─── Player circle ────────────────────────────────────────────────────────────

function PlayerCircle({
  player,
  size = "md",
  className,
}: {
  player: Player | null;
  size?: "sm" | "md";
  className?: string;
}) {
  const [err, setErr] = useState(false);
  useEffect(() => { setErr(false); }, [player?.id]);

  const dim = size === "sm" ? "w-9 h-9 text-[9px]" : "w-12 h-12 text-xs";
  const initials = player
    ? player.name.split(" ").slice(0, 2).map((n) => n[0]).join("")
    : "+";

  return (
    <div className={cn(
      "rounded-full overflow-hidden flex items-center justify-center font-black border-2 shadow-lg",
      player ? "bg-yellow-400 border-white text-green-900" : "bg-white/20 border-white/30 border-dashed text-white/50",
      dim,
      className,
    )}>
      {player?.image && !err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={player.image} alt={player.name} className="w-full h-full object-cover object-top" onError={() => setErr(true)} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

// ─── Pitch token ──────────────────────────────────────────────────────────────

function PitchToken({ slot, player, isActive, onClick }: {
  slot: SlotDef;
  player: Player | null;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none group z-10"
      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
      aria-label={player ? `${slot.label}: ${player.name}` : `Vazio: ${slot.label}`}
    >
      <div className={cn("relative transition-transform duration-150", isActive ? "scale-125" : "group-hover:scale-110")}>
        <PlayerCircle
          player={player}
          className={cn(
            isActive && "border-blue-300 ring-2 ring-blue-400 ring-offset-1 ring-offset-transparent shadow-blue-400/50",
          )}
        />
        {/* Position label badge */}
        <span className="absolute -bottom-0.5 -right-0.5 bg-green-900/90 border border-white/40 rounded-full px-1 text-[7px] font-black text-white leading-4 min-w-[14px] text-center">
          {slot.label}
        </span>
      </div>
      <span className={cn(
        "mt-1 text-[10px] font-bold text-center w-14 truncate leading-none",
        "drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]",
        player ? "text-white" : "text-white/40",
      )}>
        {player ? getTokenName(player.name) : "—"}
      </span>
    </button>
  );
}

// ─── Inline player picker (appears over bottom of pitch) ──────────────────────

function InlinePicker({ slot, currentPlayerId, selectedIds, occupiedSlots, onSelect, onClose }: {
  slot: SlotDef;
  currentPlayerId: string | null;
  selectedIds: string[];
  occupiedSlots: Record<string, string | null>;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const squadPlayers = PLAYERS.filter((p) => selectedIds.includes(p.id));

  const sorted = [...squadPlayers].sort((a, b) => {
    const ai = slot.preferredPositions.indexOf(a.position);
    const bi = slot.preferredPositions.indexOf(b.position);
    const as_ = (ai === -1 ? 999 : ai) * 10 + (a.tags?.includes("titular") ? 0 : 1);
    const bs_ = (bi === -1 ? 999 : bi) * 10 + (b.tags?.includes("titular") ? 0 : 1);
    return as_ - bs_;
  });

  return (
    // Overlay anchored to bottom of pitch container
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-green-950/95 backdrop-blur-sm rounded-t-2xl border-t border-white/20 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
        <p className="text-xs font-bold text-white">
          Posição <span className="text-yellow-400">{slot.label}</span>
          <span className="text-white/40 font-normal ml-1.5 text-[10px]">
            {slot.preferredPositions.map(p => POSITION_ABBREVIATIONS[p]).join(" · ")}
          </span>
        </p>
        <button onClick={onClose} className="text-white/50 hover:text-white p-1 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Player list */}
      <div className="overflow-y-auto max-h-44 px-3 py-2.5">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {sorted.map((p) => {
            const isHere = p.id === currentPlayerId;
            const isElsewhere = !isHere && Object.values(occupiedSlots).includes(p.id);
            const isPreferred = slot.preferredPositions.includes(p.position);
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-2.5 py-2 text-left transition-all active:scale-95",
                  isHere
                    ? "bg-yellow-400/20 border border-yellow-400/50"
                    : "bg-white/10 border border-white/10 hover:bg-white/20",
                )}
              >
                <PlayerCircle player={p} size="sm" className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-white leading-tight">
                    {getTokenName(p.name)}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={cn(
                      "text-[8px] font-bold leading-none px-1 py-0.5 rounded",
                      isPreferred ? "text-yellow-300 bg-yellow-400/20" : "text-white/40 bg-white/10",
                    )}>
                      {POSITION_ABBREVIATIONS[p.position]}
                    </span>
                    {isHere && <Check className="w-2.5 h-2.5 text-yellow-400 shrink-0" />}
                    {isElsewhere && <ArrowLeftRight className="w-2.5 h-2.5 text-blue-400 shrink-0" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Bench strip ──────────────────────────────────────────────────────────────

function BenchStrip({ players, activeSlotId, onPlayerClick }: {
  players: Player[];
  activeSlotId: string | null;
  onPlayerClick: (id: string) => void;
}) {
  if (players.length === 0) return null;

  return (
    <div className="shrink-0 bg-green-950/70 border-t border-white/10 px-4 py-3">
      <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2.5">
        Banco de Reservas · {players.length} jogadores
        {activeSlotId && (
          <span className="ml-2 text-yellow-400 normal-case font-semibold not-italic">
            ↑ selecione no campo acima
          </span>
        )}
      </p>
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
      >
        {players.map((p) => (
          <button
            key={p.id}
            onClick={() => onPlayerClick(p.id)}
            className={cn(
              "flex flex-col items-center gap-1 shrink-0 rounded-xl p-2 transition-all active:scale-95",
              "w-[58px] border",
              activeSlotId
                ? "bg-yellow-400/10 border-yellow-400/25 hover:bg-yellow-400/20"
                : "bg-white/5 border-white/10 hover:bg-white/10 cursor-default",
            )}
          >
            <PlayerCircle player={p} size="sm" />
            <span className="text-[9px] font-semibold text-white/70 text-center w-full truncate leading-tight">
              {getTokenName(p.name)}
            </span>
            <span className="text-[8px] font-bold text-white/40">
              {POSITION_ABBREVIATIONS[p.position]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface LineupModalProps {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
}

export function LineupModal({ open, onClose, selectedIds }: LineupModalProps) {
  const { formation, slots, setFormation, assignPlayer, autoFill } = useLineupStore();
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [autoFilled, setAutoFilled] = useState(false);

  const formationDef = getFormation(formation);

  // Auto-fill once on first open
  useEffect(() => {
    if (open && selectedIds.length > 0 && !autoFilled) {
      if (!Object.values(slots).some(Boolean)) autoFill(selectedIds);
      setAutoFilled(true);
    }
    if (!open) setActiveSlotId(null);
  }, [open, selectedIds, autoFilled, slots, autoFill]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") activeSlotId ? setActiveSlotId(null) : onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, activeSlotId, onClose]);

  if (!open) return null;

  const startingIds = new Set(Object.values(slots).filter(Boolean) as string[]);
  const benchPlayers = PLAYERS.filter(p => selectedIds.includes(p.id) && !startingIds.has(p.id));

  const activeSlot = activeSlotId ? formationDef.slots.find(s => s.id === activeSlotId) ?? null : null;

  const handleSlotClick = (slotId: string) => {
    setActiveSlotId(prev => prev === slotId ? null : slotId);
  };

  const handlePickPlayer = (playerId: string) => {
    if (!activeSlotId) return;
    assignPlayer(activeSlotId, playerId);
    setActiveSlotId(null);
  };

  const handleBenchClick = (playerId: string) => {
    if (!activeSlotId) return;
    assignPlayer(activeSlotId, playerId);
    setActiveSlotId(null);
  };

  const handleFormationChange = (fId: string) => {
    setFormation(fId, selectedIds);
    setActiveSlotId(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => activeSlotId ? setActiveSlotId(null) : onClose()}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-lg flex flex-col rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl bg-green-900 max-h-[96dvh] sm:max-h-[92dvh]">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="shrink-0 relative flex items-center justify-between px-4 pt-5 pb-3 sm:pt-4">
          {/* mobile drag handle */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-9 h-1 rounded-full bg-white/20 sm:hidden" />
          <h2 className="text-sm font-black text-white">⚽ Escalar minha Seleção</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { autoFill(selectedIds); setActiveSlotId(null); }}
              className="flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg px-2.5 py-1.5 transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Auto
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Formation pills ───────────────────────────────────────── */}
        <div
          className="shrink-0 flex gap-1.5 px-4 pb-3 overflow-x-auto"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {FORMATIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFormationChange(f.id)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95",
                formation === f.id
                  ? "bg-yellow-400 text-green-900 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20",
              )}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* ── Scrollable body ───────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>

          {/* Pitch */}
          <div className="relative w-full" style={{ paddingBottom: "140%" }}>
            <Pitch />

            {/* Formation tag */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 bg-black/40 rounded-full px-3 py-0.5 pointer-events-none">
              <span className="text-[10px] font-black text-white tracking-widest">{formation}</span>
            </div>

            {/* Player tokens */}
            {formationDef.slots.map((slot) => (
              <PitchToken
                key={slot.id}
                slot={slot}
                player={getPlayerById(slots[slot.id])}
                isActive={activeSlotId === slot.id}
                onClick={() => handleSlotClick(slot.id)}
              />
            ))}

            {/* Hint when nothing selected */}
            {!activeSlotId && (
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-white/40 whitespace-nowrap pointer-events-none">
                Toque num jogador para trocar
              </p>
            )}

            {/* Inline picker — slides up from bottom of pitch */}
            {activeSlot && (
              <InlinePicker
                slot={activeSlot}
                currentPlayerId={slots[activeSlotId!] ?? null}
                selectedIds={selectedIds}
                occupiedSlots={slots}
                onSelect={handlePickPlayer}
                onClose={() => setActiveSlotId(null)}
              />
            )}
          </div>

          {/* Bench */}
          <BenchStrip
            players={benchPlayers}
            activeSlotId={activeSlotId}
            onPlayerClick={handleBenchClick}
          />
        </div>
      </div>
    </div>
  );
}
