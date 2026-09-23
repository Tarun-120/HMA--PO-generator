"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CompanySettings } from "@/components/CompanySettings";
import { DocumentDetails } from "@/components/DocumentDetails";
import { GeneralPoTerms } from "@/components/GeneralPoTerms";
import { HistoryPanel } from "@/components/HistoryPanel";
import { ItemsTable } from "@/components/ItemsTable";
import { LoginScreen } from "@/components/LoginScreen";
import { PreparedBy } from "@/components/PreparedBy";
import { TermsConditions } from "@/components/TermsConditions";
import { isLoggedIn, logout } from "@/lib/auth";
import { DEFAULT_BANK, DEFAULT_COMPANY, DEFAULT_TERMS } from "@/lib/constants";
import { buildDefaultInvoiceData } from "@/lib/defaultInvoice";
import {
  buildSuggestedDocNumber,
  docNumberToFileName,
  getBank,
  getCompany,
  getDraft,
  getHistory,
  removeHistoryEntry,
  saveBank,
  saveCompany,
  saveDraft,
  withRevisionPrefix,
} from "@/lib/storage";
import { BankInfo, CompanyInfo, DocType, HistoryEntry, InvoiceData } from "@/lib/types";
import { useLogoDataUrl } from "@/lib/useImageDataUrl";

const PdfActions = dynamic(() => import("@/components/PdfActions"), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-400 shadow-sm">
      Loading PDF engine...
    </div>
  ),
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [company, setCompanyState] = useState<CompanyInfo>(DEFAULT_COMPANY);
  const [bank, setBankState] = useState<BankInfo>(DEFAULT_BANK);
  const [data, setDataState] = useState<InvoiceData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const logoDataUrl = useLogoDataUrl();

  useEffect(() => {
    setCompanyState(getCompany());
    setBankState(getBank());
    const draft = getDraft();
    setDataState(draft ? { ...buildDefaultInvoiceData(draft.docType), ...draft } : buildDefaultInvoiceData());
    setHistory(getHistory());
    setAuthed(isLoggedIn());
    setMounted(true);
  }, []);

  function handleLogout() {
    logout();
    setAuthed(false);
  }

  useEffect(() => {
    if (mounted && data) saveDraft(data);
  }, [data, mounted]);

  function setCompany(c: CompanyInfo) {
    setCompanyState(c);
    saveCompany(c);
  }

  function setBank(b: BankInfo) {
    setBankState(b);
    saveBank(b);
  }

  function handleDataChange(newData: InvoiceData) {
    if (data && newData.docType !== data.docType) {
      const suggested = buildSuggestedDocNumber(newData.docType, new Date(newData.docDate || Date.now()));
      const usedDefaultTerms = Object.values(DEFAULT_TERMS).includes(data.termsAndConditions);
      newData = {
        ...newData,
        docNumber: suggested,
        termsAndConditions: usedDefaultTerms ? DEFAULT_TERMS[newData.docType] : newData.termsAndConditions,
      };
    }
    setDataState(newData);
  }

  function handleNewDocument() {
    if (!data) return;
    setDataState(buildDefaultInvoiceData(data.docType));
  }

  function handleGenerated(entry: HistoryEntry) {
    setHistory((h) => [entry, ...h.filter((e) => e.docNumber !== entry.docNumber || e.docType !== entry.docType)]);
  }

  function handleDocNumberBump(docType: DocType, nextDocNumber: string) {
    setDataState((prev) => (prev && prev.docType === docType ? { ...prev, docNumber: nextDocNumber } : prev));
  }

  function handleLoadHistory(entry: HistoryEntry) {
    setDataState({ ...buildDefaultInvoiceData(entry.data.docType), ...entry.data });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDeleteHistory(id: string) {
    removeHistoryEntry(id);
    setHistory((h) => h.filter((e) => e.id !== id));
  }

  async function handleRedownload(entry: HistoryEntry) {
    const mod = await import("@react-pdf/renderer");
    const { PdfDocument } = await import("@/lib/pdf/PdfDocument");
    const displayDocNumber = withRevisionPrefix(entry.docNumber, entry.revision);
    const displayData = entry.revision > 0 ? { ...entry.data, docNumber: displayDocNumber } : entry.data;
    const blob = await mod
      .pdf(<PdfDocument data={displayData} company={company} bank={bank} logoDataUrl={logoDataUrl} />)
      .toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${docNumberToFileName(displayDocNumber)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  if (!mounted || !data) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 text-sm text-slate-400">Loading billing studio...</main>
    );
  }

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy">HMA Billing Studio</h1>
          <p className="text-sm text-slate-500">
            Create Proforma Invoices, Quotations, Tax Invoices and Purchase Orders for Hindustan Machines &amp;
            Automation. Runs entirely in your browser - nothing is sent to a server.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleNewDocument}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            + New Document
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="space-y-5">
        <CompanySettings company={company} bank={bank} onCompanyChange={setCompany} onBankChange={setBank} />
        <DocumentDetails data={data} onChange={handleDataChange} />
        <PreparedBy data={data} onChange={handleDataChange} />
        <ItemsTable
          items={data.items}
          sellerStateCode={company.stateCode}
          buyerStateCode={data.buyer.stateCode}
          freightAmount={data.freightAmount}
          freightGstRate={data.freightGstRate}
          onChange={(items) => setDataState({ ...data, items })}
          onFreightAmountChange={(freightAmount) => setDataState({ ...data, freightAmount })}
          onFreightGstRateChange={(freightGstRate) => setDataState({ ...data, freightGstRate })}
        />
        <TermsConditions data={data} onChange={handleDataChange} />
        {data.docType === "PURCHASE_ORDER" ? <GeneralPoTerms /> : null}
        <PdfActions
          data={data}
          company={company}
          bank={bank}
          logoDataUrl={logoDataUrl}
          history={history}
          onGenerated={handleGenerated}
          onDocNumberBump={handleDocNumberBump}
        />
        <HistoryPanel
          history={history}
          onLoad={handleLoadHistory}
          onRedownload={handleRedownload}
          onDelete={handleDeleteHistory}
        />
      </div>
    </main>
  );
}
