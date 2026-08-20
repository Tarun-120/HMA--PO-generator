"use client";

import { INDIAN_STATES } from "@/lib/constants";
import { DocType, DOC_TYPE_LABEL, InvoiceData, PartyInfo } from "@/lib/types";
import { Field, TextArea, TextInput } from "./ui/Field";

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

const DOC_TYPES: DocType[] = ["TAX_INVOICE", "PROFORMA_INVOICE", "QUOTATION"];

interface PartyFieldsProps {
  party: PartyInfo;
  onFieldChange: <K extends keyof PartyInfo>(key: K, value: PartyInfo[K]) => void;
}

function PartyFields({ party, onFieldChange }: PartyFieldsProps) {
  return (
    <>
      <Field label="Customer / Company Name">
        <TextInput value={party.name} onChange={(e) => onFieldChange("name", e.target.value)} />
      </Field>
      <Field label="Phone">
        <TextInput value={party.phone} onChange={(e) => onFieldChange("phone", e.target.value)} />
      </Field>
      <Field label="Address" className="sm:col-span-2">
        <TextArea rows={2} value={party.address} onChange={(e) => onFieldChange("address", e.target.value)} />
      </Field>
      <Field label="State">
        <select
          value={party.state}
          onChange={(e) => onFieldChange("state", e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
        >
          <option value="">Select state</option>
          {INDIAN_STATES.map((s) => (
            <option key={s.code} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="GSTIN (if registered)">
        <TextInput value={party.gstin} onChange={(e) => onFieldChange("gstin", e.target.value)} />
      </Field>
      <Field label="Email">
        <TextInput value={party.email} onChange={(e) => onFieldChange("email", e.target.value)} />
      </Field>
    </>
  );
}

export function DocumentDetails({ data, onChange }: Props) {
  function setField<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) {
    onChange({ ...data, [key]: value });
  }

  function setBuyerField<K extends keyof PartyInfo>(key: K, value: PartyInfo[K]) {
    const buyer = { ...data.buyer, [key]: value };
    if (key === "state") {
      const match = INDIAN_STATES.find((s) => s.name === value);
      if (match) buyer.stateCode = match.code;
    }
    onChange({ ...data, buyer });
  }

  function setShipToField<K extends keyof PartyInfo>(key: K, value: PartyInfo[K]) {
    const shipTo = { ...data.shipTo, [key]: value };
    if (key === "state") {
      const match = INDIAN_STATES.find((s) => s.name === value);
      if (match) shipTo.stateCode = match.code;
    }
    onChange({ ...data, shipTo });
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-navy">Document Details</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {DOC_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setField("docType", t)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              data.docType === t
                ? "bg-navy text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {DOC_TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Document Number">
          <TextInput value={data.docNumber} onChange={(e) => setField("docNumber", e.target.value)} />
        </Field>
        <Field label="Document Date">
          <TextInput type="date" value={data.docDate} onChange={(e) => setField("docDate", e.target.value)} />
        </Field>
        {data.docType === "TAX_INVOICE" ? (
          <Field label="Due Date">
            <TextInput type="date" value={data.dueDate} onChange={(e) => setField("dueDate", e.target.value)} />
          </Field>
        ) : null}
        {data.docType === "QUOTATION" ? (
          <Field label="Valid Until">
            <TextInput type="date" value={data.validUntil} onChange={(e) => setField("validUntil", e.target.value)} />
          </Field>
        ) : null}
        <Field label="PO / Reference No. (optional)">
          <TextInput value={data.poNumber} onChange={(e) => setField("poNumber", e.target.value)} />
        </Field>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <h3 className="col-span-full text-xs font-semibold uppercase tracking-wide text-slate-500">
            {data.docType === "QUOTATION" ? "Quoted To (Customer)" : "Bill To (Customer)"}
          </h3>
          <PartyFields party={data.buyer} onFieldChange={setBuyerField} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="col-span-full flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Shipment To</h3>
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={data.shipSameAsBill}
                onChange={(e) => setField("shipSameAsBill", e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-navy focus:ring-navy/30"
              />
              Same as Bill To
            </label>
          </div>
          {data.shipSameAsBill ? (
            <p className="col-span-full rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
              Shipment address will be printed same as the Bill To details above. Uncheck &quot;Same as Bill
              To&quot; to enter a different shipping address.
            </p>
          ) : (
            <PartyFields party={data.shipTo} onFieldChange={setShipToField} />
          )}
        </div>
      </div>
    </section>
  );
}
