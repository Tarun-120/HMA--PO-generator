"use client";

import { useEffect, useState } from "react";

const CANDIDATE_PATHS = ["/logo.png", "/logo.jpg", "/logo.jpeg"];

async function loadFirstAvailable(paths: string[]): Promise<string | null> {
  for (const path of paths) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) continue;
      const blob = await res.blob();
      if (!blob.type.startsWith("image/")) continue;
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      // try next candidate
    }
  }
  return null;
}

export function useLogoDataUrl(path?: string): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await loadFirstAvailable(path ? [path] : CANDIDATE_PATHS);
      if (!cancelled) setDataUrl(result);
    })();
    return () => {
      cancelled = true;
    };
  }, [path]);

  return dataUrl;
}
