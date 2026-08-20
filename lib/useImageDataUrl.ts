"use client";

import { useEffect, useState } from "react";

const LOGO_CANDIDATES = ["/logo.png", "/logo.jpg", "/logo.jpeg"];
const SIGNATURE_CANDIDATES = ["/signature.png", "/signature.jpg", "/signature.jpeg"];

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

function useImageDataUrl(candidates: string[]): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await loadFirstAvailable(candidates);
      if (!cancelled) setDataUrl(result);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates.join(",")]);

  return dataUrl;
}

export function useLogoDataUrl(): string | null {
  return useImageDataUrl(LOGO_CANDIDATES);
}

export function useSignatureDataUrl(): string | null {
  return useImageDataUrl(SIGNATURE_CANDIDATES);
}
