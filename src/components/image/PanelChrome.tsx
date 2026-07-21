import type { ReactNode } from "react";

/** Primary / secondary actions — sticky on mobile so Download stays reachable. */
export function PanelActions({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-2 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-md sm:static sm:mx-0 sm:mt-auto sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        {children}
      </div>
    </div>
  );
}

export const panelPrimaryBtnClass =
  "focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-foam transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto";

export const panelAccentBtnClass =
  "focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-5 text-sm font-semibold text-foam transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto";

export const panelSecondaryBtnClass =
  "focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md border border-line bg-paper px-4 text-sm font-medium text-ink-soft transition hover:bg-mist sm:w-auto sm:border-0 sm:bg-transparent";

export function chipClass(active: boolean): string {
  return `focus-ring inline-flex min-h-11 items-center justify-center rounded-md px-3.5 text-sm font-medium transition disabled:opacity-40 ${
    active ? "bg-ink text-foam" : "bg-mist text-ink-soft hover:bg-mist/80"
  }`;
}

export function modeTabClass(active: boolean): string {
  return `focus-ring flex min-h-11 flex-1 items-center justify-center rounded-md px-3 text-sm font-semibold transition ${
    active ? "bg-paper text-ink shadow-sm" : "text-ink-soft hover:text-ink"
  }`;
}

export const panelShellClass =
  "flex h-full flex-col justify-between gap-5 sm:gap-6";

export const panelSectionClass = "space-y-5";

export const rangeInputClass =
  "mt-2 h-11 w-full cursor-pointer accent-[var(--accent)] disabled:opacity-40";

export const numberInputClass =
  "focus-ring mt-2 min-h-11 w-full rounded-md border border-line bg-paper px-3 py-2 text-base tabular-nums disabled:opacity-40 sm:text-sm";

export const checkboxRowClass =
  "flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink-soft";
