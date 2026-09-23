import { DEFAULT_BANK, DEFAULT_COMPANY } from "./constants";
import { BankInfo, CompanyInfo, DocType, DOC_TYPE_PREFIX, HistoryEntry, InvoiceData } from "./types";

const KEYS = {
  company: "hma_billing_company",
  bank: "hma_billing_bank",
  draft: "hma_billing_draft",
  history: "hma_billing_history",
  seqPrefix: "hma_billing_seq_",
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / privacy-mode errors
  }
}

export function getCompany(): CompanyInfo {
  return safeGet(KEYS.company, DEFAULT_COMPANY);
}

export function saveCompany(company: CompanyInfo) {
  safeSet(KEYS.company, company);
}

export function getBank(): BankInfo {
  return safeGet(KEYS.bank, DEFAULT_BANK);
}

export function saveBank(bank: BankInfo) {
  safeSet(KEYS.bank, bank);
}

export function getDraft(): InvoiceData | null {
  return safeGet<InvoiceData | null>(KEYS.draft, null);
}

export function saveDraft(data: InvoiceData) {
  safeSet(KEYS.draft, data);
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEYS.draft);
}

export function getFinancialYearCode(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;
  return `${String(startYear).slice(-2)}${String(endYear).slice(-2)}`;
}

function seqKey(docType: DocType, fyCode: string): string {
  return `${KEYS.seqPrefix}${docType}_${fyCode}`;
}

export function peekNextSeq(docType: DocType, fyCode: string): number {
  return safeGet<number>(seqKey(docType, fyCode), 1);
}

export function commitSeq(docType: DocType, fyCode: string, usedSeq: number) {
  const current = peekNextSeq(docType, fyCode);
  if (usedSeq >= current) {
    safeSet(seqKey(docType, fyCode), usedSeq + 1);
  }
}

const COMPANY_CODE = "HMA";

export function buildSuggestedDocNumber(docType: DocType, date: Date): string {
  const fyCode = getFinancialYearCode(date);
  const seq = peekNextSeq(docType, fyCode);
  const prefix = DOC_TYPE_PREFIX[docType];
  return `${prefix}/${COMPANY_CODE}/${fyCode}/${String(seq).padStart(4, "0")}`;
}

export function resolveDocDate(docDate: string): Date {
  return docDate ? new Date(docDate) : new Date();
}

export function docNumberToFileName(docNumber: string): string {
  return docNumber.replace(/[\\/:*?"<>|]/g, "-");
}

export function parseSeqFromDocNumber(docNumber: string): number | null {
  const match = docNumber.match(/(\d+)\s*$/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

export function getHistory(): HistoryEntry[] {
  return safeGet<HistoryEntry[]>(KEYS.history, []);
}

export function withRevisionPrefix(docNumber: string, revision: number): string {
  return revision > 0 ? `R${revision}-${docNumber}` : docNumber;
}

export function addHistoryEntry(entry: HistoryEntry) {
  const history = getHistory();
  const filtered = history.filter((h) => h.docNumber !== entry.docNumber || h.docType !== entry.docType);
  filtered.unshift(entry);
  safeSet(KEYS.history, filtered.slice(0, 200));
}

export function removeHistoryEntry(id: string) {
  const history = getHistory().filter((h) => h.id !== id);
  safeSet(KEYS.history, history);
}
