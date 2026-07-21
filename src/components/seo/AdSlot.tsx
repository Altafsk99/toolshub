"use client";

import { useEffect, useRef } from "react";

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

type AdSlotProps = {
  /** AdSense ad unit slot ID */
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * AdSense unit. Renders nothing until `NEXT_PUBLIC_ADSENSE_CLIENT_ID` and
 * `NEXT_PUBLIC_ADSENSE_ENABLED=true` are set (after AdSense approval).
 * In development, shows a labeled placeholder so layout can be checked.
 */
export function AdSlot({ slot, format = "auto", className = "" }: AdSlotProps) {
  const pushed = useRef(false);
  const showLive = Boolean(clientId && adsEnabled && slot && slot !== "0000000000");
  const showPlaceholder = process.env.NODE_ENV === "development" && !showLive;

  useEffect(() => {
    if (!showLive || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Ad blockers / missing script — ignore
    }
  }, [showLive, slot]);

  if (showPlaceholder) {
    return (
      <aside
        className={`flex min-h-[90px] items-center justify-center rounded-md border border-dashed border-line bg-mist/40 px-4 text-center text-xs text-ink-soft/55 ${className}`}
        aria-hidden
      >
        Ad placeholder (slot {slot}) — set AdSense env vars to go live
      </aside>
    );
  }

  if (!showLive || !clientId) return null;

  return (
    <aside className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
