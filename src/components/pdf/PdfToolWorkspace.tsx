"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePdfStore } from "@/stores/pdfStore";

type PdfToolWorkspaceProps = {
  children: ReactNode;
};

export function PdfToolWorkspace({ children }: PdfToolWorkspaceProps) {
  const pathname = usePathname();
  const clear = usePdfStore((s) => s.clear);
  const activePath = useRef<string | null>(null);

  useEffect(() => {
    if (activePath.current !== pathname) {
      clear();
      activePath.current = pathname;
    }

    return () => {
      clear();
      activePath.current = null;
    };
  }, [pathname, clear]);

  return <>{children}</>;
}
