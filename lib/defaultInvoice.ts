import { DEFAULT_TERMS } from "./constants";
import { generateId } from "./id";
import { buildSuggestedDocNumber } from "./storage";
import { DocType, InvoiceData, LineItem, PartyInfo } from "./types";

function blankParty(): PartyInfo {
  return {
    name: "",
    address: "",
    gstin: "",
    state: "",
    stateCode: "",
    phone: "",
    email: "",
  };
}

function blankItem(): LineItem {
  return {
    id: generateId(),
    description: "",
    hsnSac: "",
    qty: 1,
    unit: "Nos",
    rate: 0,
    discountPercent: 0,
    gstRate: 18,
  };
}

function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function buildDefaultInvoiceData(docType: DocType = "TAX_INVOICE"): InvoiceData {
  return {
    docType,
    docNumber: buildSuggestedDocNumber(docType, new Date()),
    docDate: todayISO(),
    dueDate: addDaysISO(15),
    validUntil: addDaysISO(15),
    poNumber: "",
    buyer: blankParty(),
    shipSameAsBill: docType !== "PURCHASE_ORDER",
    shipTo: blankParty(),
    items: [blankItem()],
    freightAmount: 0,
    freightGstRate: 18,
    notes: "",
    termsAndConditions: DEFAULT_TERMS[docType],
    preparedBy: { name: "", phone: "", email: "" },
  };
}
