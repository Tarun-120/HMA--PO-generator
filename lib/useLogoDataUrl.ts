"use client";

import { useEffect, useState } from "react";

export function useLogoDataUrl(path: string = "/logo.png"): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(path, { cache: "no-store" });
        if (!res.ok) return;
        const blob = await res.blob();
        if (!blob.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => {
          if (!cancelled) setDataUrl(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch {
        // no logo available yet - fallback badge will be used
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [path]);

  return dataUrl;
}
