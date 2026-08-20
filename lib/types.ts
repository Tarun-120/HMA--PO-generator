export type DocType = "TAX_INVOICE" | "PROFORMA_INVOICE" | "QUOTATION";

export const DOC_TYPE_LABEL: Record<DocType, string> = {
  TAX_INVOICE: "Tax Invoice",
  PROFORMA_INVOICE: "Proforma Invoice",
  QUOTATION: "Quotation",
};

export const DOC_TYPE_PREFIX: Record<DocType, string> = {
  TAX_INVOICE: "INV",
  PROFORMA_INVOICE: "PI",
  QUOTATION: "QUO",
};

export interface CompanyInfo {
  legalName: string;
  tradeName: string;
  gstin: string;
  pan: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  stateCode: string;
  pinCode: string;
  phone: string;
  email: string;
}

export interface BankInfo {
  beneficiaryName: string;
  accountNumber: string;
  accountType: string;
  bankName: string;
  branchName: string;
  branchAddress: string;
  ifsc: string;
}

export interface PartyInfo {
  name: string;
  address: string;
  gstin: string;
  state: string;
  stateCode: string;
  phone: string;
  email: string;
}

export interface LineItem {
  id: string;
  description: string;
  hsnSac: string;
  qty: number;
  unit: string;
  rate: number;
  discountPercent: number;
  gstRate: number;
}

export interface InvoiceData {
  docType: DocType;
  docNumber: string;
  docDate: string;
  dueDate: string;
  validUntil: string;
  poNumber: string;
  buyer: PartyInfo;
  items: LineItem[];
  notes: string;
  termsAndConditions: string;
}

export interface HistoryEntry {
  id: string;
  docType: DocType;
  docNumber: string;
  docDate: string;
  buyerName: string;
  grandTotal: number;
  data: InvoiceData;
  createdAt: string;
}
