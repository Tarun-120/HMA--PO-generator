"use client";

import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useState } from "react";
import { calculateInvoice } from "@/lib/calculations";
import { generateId } from "@/lib/id";
import { PdfDocument } from "@/lib/pdf/PdfDocument";
import { BankInfo, CompanyInfo, DocType, HistoryEntry, InvoiceData } from "@/lib/types";
import {
  addHistoryEntry,
  buildSuggestedDocNumber,
  commitSeq,
  getFinancialYearCode,
  parseSeqFromDocNumber,
} from "@/lib/storage";

interface Props {
  data: InvoiceData;
  company: CompanyInfo;
  bank: BankInfo;
  logoDataUrl: string | null;
  onGenerated: (entry: HistoryEntry) => void;
  onDocNumberBump: (docType: DocType, nextDocNumber: string) => void;
}

export default function PdfActions({ data, company, bank, logoDataUrl, onGenerated, onDocNumberBump }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasItems = data.items.some((i) => i.description.trim().length > 0);

  async function handleDownload() {
    setError(null);
    if (!data.buyer.name.trim()) {
      setError("Please enter the customer / company name before generating.");
      return;
    }
    if (!hasItems) {
      setError("Please add at least one item with a description.");
      return;
    }
    setGenerating(true);
    try {
      const blob = await pdf(
        <PdfDocument data={data} company={company} bank={bank} logoDataUrl={logoDataUrl} />
      ).toBlob();

      const fileName = `${data.docNumber}.pdf`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      const totals = calculateInvoice(data.items, company.stateCode, data.buyer.stateCode || company.stateCode);
      const entry: HistoryEntry = {
        id: generateId(),
        docType: data.docType,
        docNumber: data.docNumber,
        docDate: data.docDate,
        buyerName: data.buyer.name,
        grandTotal: totals.grandTotal,
        data,
        createdAt: new Date().toISOString(),
      };
      addHistoryEntry(entry);
      onGenerated(entry);

      const usedSeq = parseSeqFromDocNumber(data.docNumber);
      if (usedSeq !== null) {
        const fyCode = getFinancialYearCode(new Date(data.docDate || Date.now()));
        commitSeq(data.docType, fyCode, usedSeq);
        const nextNumber = buildSuggestedDocNumber(data.docType, new Date(data.docDate || Date.now()));
        onDocNumberBump(data.docType, nextNumber);
      }
    } catch (e) {
      setError("Something went wrong while generating the PDF. Please check the item details and try again.");
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-navy">Generate PDF</h2>
          <p className="text-xs text-slate-500">
            Downloads as <span className="font-mono text-navy">{data.docNumber || "DOC"}.pdf</span> to your
            browser&apos;s default download folder.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="rounded-md border border-navy px-3 py-1.5 text-xs font-medium text-navy hover:bg-navy/5"
          >
            {showPreview ? "Hide Preview" : "Preview"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={generating}
            className="rounded-md bg-brandred px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {generating ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      {error ? <p className="mt-2 text-xs text-brandred">{error}</p> : null}

      {showPreview ? (
        <div className="mt-4 h-[720px] w-full overflow-hidden rounded-md border border-slate-200">
          <PDFViewer width="100%" height="100%" showToolbar={false}>
            <PdfDocument data={data} company={company} bank={bank} logoDataUrl={logoDataUrl} />
          </PDFViewer>
        </div>
      ) : null}
    </section>
  );
}
