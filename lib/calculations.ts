import { LineItem } from "./types";

export interface ItemCalc {
  item: LineItem;
  taxableValue: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  lineTotal: number;
}

export interface InvoiceTotals {
  items: ItemCalc[];
  isIntraState: boolean;
  subtotal: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  grandTotalRaw: number;
  roundOff: number;
  grandTotal: number;
  gstRateSummary: { rate: number; taxable: number; cgst: number; sgst: number; igst: number }[];
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calculateInvoice(items: LineItem[], sellerStateCode: string, buyerStateCode: string): InvoiceTotals {
  const isIntraState = sellerStateCode === buyerStateCode;

  const itemCalcs: ItemCalc[] = items.map((item) => {
    const gross = item.qty * item.rate;
    const discount = gross * (item.discountPercent / 100);
    const taxableValue = round2(gross - discount);
    const gstAmount = round2(taxableValue * (item.gstRate / 100));

    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    if (isIntraState) {
      cgstAmount = round2(gstAmount / 2);
      sgstAmount = round2(gstAmount - cgstAmount);
    } else {
      igstAmount = gstAmount;
    }

    const lineTotal = round2(taxableValue + cgstAmount + sgstAmount + igstAmount);

    return { item, taxableValue, cgstAmount, sgstAmount, igstAmount, lineTotal };
  });

  const subtotal = round2(itemCalcs.reduce((s, i) => s + i.taxableValue, 0));
  const totalCgst = round2(itemCalcs.reduce((s, i) => s + i.cgstAmount, 0));
  const totalSgst = round2(itemCalcs.reduce((s, i) => s + i.sgstAmount, 0));
  const totalIgst = round2(itemCalcs.reduce((s, i) => s + i.igstAmount, 0));
  const totalTax = round2(totalCgst + totalSgst + totalIgst);
  const grandTotalRaw = round2(subtotal + totalTax);
  const grandTotal = Math.round(grandTotalRaw);
  const roundOff = round2(grandTotal - grandTotalRaw);

  const rateMap = new Map<number, { taxable: number; cgst: number; sgst: number; igst: number }>();
  for (const ic of itemCalcs) {
    const rate = ic.item.gstRate;
    const entry = rateMap.get(rate) ?? { taxable: 0, cgst: 0, sgst: 0, igst: 0 };
    entry.taxable = round2(entry.taxable + ic.taxableValue);
    entry.cgst = round2(entry.cgst + ic.cgstAmount);
    entry.sgst = round2(entry.sgst + ic.sgstAmount);
    entry.igst = round2(entry.igst + ic.igstAmount);
    rateMap.set(rate, entry);
  }
  const gstRateSummary = Array.from(rateMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([rate, v]) => ({ rate, ...v }));

  return {
    items: itemCalcs,
    isIntraState,
    subtotal,
    totalCgst,
    totalSgst,
    totalIgst,
    totalTax,
    grandTotalRaw,
    roundOff,
    grandTotal,
    gstRateSummary,
  };
}
