"use client";

import { GST_RATES, UNITS } from "@/lib/constants";
import { calculateInvoice, round2 } from "@/lib/calculations";
import { generateId } from "@/lib/id";
import { LineItem } from "@/lib/types";

interface Props {
  items: LineItem[];
  sellerStateCode: string;
  buyerStateCode: string;
  onChange: (items: LineItem[]) => void;
}

function newItem(): LineItem {
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

const cellInput =
  "w-full rounded border border-slate-300 bg-white px-1.5 py-1 text-xs outline-none focus:border-navy focus:ring-1 focus:ring-navy/30";

export function ItemsTable({ items, sellerStateCode, buyerStateCode, onChange }: Props) {
  const totals = calculateInvoice(items, sellerStateCode, buyerStateCode || sellerStateCode);

  function updateItem<K extends keyof LineItem>(id: string, key: K, value: LineItem[K]) {
    onChange(items.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  }

  function removeItem(id: string) {
    onChange(items.filter((it) => it.id !== id));
  }

  function addItem() {
    onChange([...items, newItem()]);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-navy">Items</h2>
        <button
          type="button"
          onClick={addItem}
          className="rounded-md bg-navy px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
        >
          + Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500">
              <th className="p-1.5 font-medium">#</th>
              <th className="p-1.5 font-medium">Description</th>
              <th className="p-1.5 font-medium">HSN/SAC</th>
              <th className="p-1.5 font-medium">Qty</th>
              <th className="p-1.5 font-medium">Unit</th>
              <th className="p-1.5 font-medium">Rate (Rs.)</th>
              <th className="p-1.5 font-medium">Disc %</th>
              <th className="p-1.5 font-medium">GST %</th>
              <th className="p-1.5 text-right font-medium">Amount</th>
              <th className="p-1.5"></th>
            </tr>
          </thead>
          <tbody>
            {totals.items.map((ic, idx) => (
              <tr key={ic.item.id} className="border-b border-slate-100">
                <td className="p-1.5 text-slate-400">{idx + 1}</td>
                <td className="p-1.5">
                  <input
                    className={cellInput}
                    style={{ minWidth: 180 }}
                    placeholder="Item description"
                    value={ic.item.description}
                    onChange={(e) => updateItem(ic.item.id, "description", e.target.value)}
                  />
                </td>
                <td className="p-1.5">
                  <input
                    className={cellInput}
                    style={{ width: 80 }}
                    value={ic.item.hsnSac}
                    onChange={(e) => updateItem(ic.item.id, "hsnSac", e.target.value)}
                  />
                </td>
                <td className="p-1.5">
                  <input
                    type="number"
                    className={cellInput}
                    style={{ width: 60 }}
                    value={ic.item.qty}
                    min={0}
                    onChange={(e) => updateItem(ic.item.id, "qty", parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="p-1.5">
                  <select
                    className={cellInput}
                    style={{ width: 70 }}
                    value={ic.item.unit}
                    onChange={(e) => updateItem(ic.item.id, "unit", e.target.value)}
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-1.5">
                  <input
                    type="number"
                    className={cellInput}
                    style={{ width: 90 }}
                    value={ic.item.rate}
                    min={0}
                    onChange={(e) => updateItem(ic.item.id, "rate", parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="p-1.5">
                  <input
                    type="number"
                    className={cellInput}
                    style={{ width: 60 }}
                    value={ic.item.discountPercent}
                    min={0}
                    max={100}
                    onChange={(e) => updateItem(ic.item.id, "discountPercent", round2(parseFloat(e.target.value) || 0))}
                  />
                </td>
                <td className="p-1.5">
                  <select
                    className={cellInput}
                    style={{ width: 65 }}
                    value={ic.item.gstRate}
                    onChange={(e) => updateItem(ic.item.id, "gstRate", parseFloat(e.target.value))}
                  >
                    {GST_RATES.map((r) => (
                      <option key={r} value={r}>
                        {r}%
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-1.5 whitespace-nowrap text-right font-medium">
                  {ic.lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
                <td className="p-1.5">
                  <button
                    type="button"
                    onClick={() => removeItem(ic.item.id)}
                    disabled={items.length <= 1}
                    className="text-slate-400 hover:text-brandred disabled:opacity-30"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>Rs. {totals.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          {totals.isIntraState ? (
            <>
              <div className="flex justify-between text-slate-600">
                <span>CGST</span>
                <span>Rs. {totals.totalCgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST</span>
                <span>Rs. {totals.totalSgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-slate-600">
              <span>IGST</span>
              <span>Rs. {totals.totalIgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Round Off</span>
            <span>Rs. {totals.roundOff.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between border-t border-slate-300 pt-1.5 text-base font-semibold text-navy">
            <span>Grand Total</span>
            <span>Rs. {totals.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
