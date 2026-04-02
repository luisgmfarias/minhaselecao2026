"use client";

import { useState, useCallback } from "react";
import {
  buildShareUrl,
} from "@/lib/utils/urlState";
import {
  copyToClipboard,
  getFacebookUrl,
  getWhatsAppUrl,
  getTwitterUrl,
  shareNative,
} from "@/lib/utils/shareUtils";
import type { SharePayload } from "@/types";

export function useShare(payload: SharePayload) {
  const [copied, setCopied] = useState(false);

  const shareUrl = buildShareUrl(payload);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [shareUrl]);

  const handleWhatsApp = useCallback(() => {
    window.open(getWhatsAppUrl(shareUrl), "_blank", "noopener,noreferrer");
  }, [shareUrl]);

  const handleFacebook = useCallback(() => {
    window.open(getFacebookUrl(shareUrl), "_blank", "noopener,noreferrer");
  }, [shareUrl]);

  const handleTwitter = useCallback(() => {
    window.open(getTwitterUrl(shareUrl), "_blank", "noopener,noreferrer");
  }, [shareUrl]);

  const handleNative = useCallback(async () => {
    const ok = await shareNative(payload);
    if (!ok) {
      // Fallback to copy
      await handleCopy();
    }
  }, [payload, handleCopy]);

  return {
    shareUrl,
    copied,
    handleCopy,
    handleWhatsApp,
    handleFacebook,
    handleTwitter,
    handleNative,
    supportsNativeShare:
      typeof navigator !== "undefined" && !!navigator.share,
  };
}
