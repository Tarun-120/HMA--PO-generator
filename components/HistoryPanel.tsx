"use client";

import { DOC_TYPE_LABEL, HistoryEntry } from "@/lib/types";

interface Props {
  history: HistoryEntry[];
  onLoad: (entry: HistoryEntry) => void;
  onRedownload: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
}

export function HistoryPanel({ history, onLoad, onRedownload, onDelete }: Props) {
  if (history.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
        No documents generated yet. Generated PIs, quotations and invoices will be listed here (saved on this
        device only).
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-navy">Recent Documents (saved on this device)</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-1.5 pr-2 font-medium">Type</th>
              <th className="py-1.5 pr-2 font-medium">Number</th>
              <th className="py-1.5 pr-2 font-medium">Date</th>
              <th className="py-1.5 pr-2 font-medium">Customer</th>
              <th className="py-1.5 pr-2 text-right font-medium">Amount</th>
              <th className="py-1.5 pr-2"></th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id} className="border-b border-slate-100">
                <td className="py-1.5 pr-2">{DOC_TYPE_LABEL[h.docType]}</td>
                <td className="py-1.5 pr-2 font-medium">{h.docNumber}</td>
                <td className="py-1.5 pr-2">{h.docDate}</td>
                <td className="py-1.5 pr-2">{h.buyerName || "-"}</td>
                <td className="py-1.5 pr-2 text-right">
                  Rs. {h.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
                <td className="py-1.5 pr-2">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onLoad(h)}
                      className="text-navy hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onRedownload(h)}
                      className="text-navy hover:underline"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(h.id)}
                      className="text-brandred hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
