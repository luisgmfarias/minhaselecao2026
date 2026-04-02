import { buildShareUrl } from "./urlState";
import type { SharePayload } from "@/types";
import { SITE_NAME } from "@/data/config";

const DEFAULT_SHARE_TEXT =
  ` &#x1f1e7;&#x1f1f7; Monte sua convocação do Brasil para a Copa 2026! Veja a minha seleção em`;

export function getWhatsAppUrl(shareUrl: string, text?: string): string {
  const message = `${text ?? DEFAULT_SHARE_TEXT} ${shareUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function getFacebookUrl(shareUrl: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
}

export function getTwitterUrl(shareUrl: string, text?: string): string {
  const tweet = `${text ?? DEFAULT_SHARE_TEXT} ${shareUrl} #Copa2026 #Seleção #Brasil`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
}

export async function shareNative(
  payload: SharePayload,
  text?: string
): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;
  const url = buildShareUrl(payload);
  try {
    await navigator.share({
      title: SITE_NAME,
      text: text ?? "Veja minha convocação do Brasil para a Copa 2026!",
      url,
    });
    return true;
  } catch {
    return false;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  }
}
