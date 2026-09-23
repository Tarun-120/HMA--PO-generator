"use client";

import { InvoiceData, PreparedByInfo } from "@/lib/types";
import { Field, TextInput } from "./ui/Field";

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export function PreparedBy({ data, onChange }: Props) {
  function setField<K extends keyof PreparedByInfo>(key: K, value: PreparedByInfo[K]) {
    onChange({ ...data, preparedBy: { ...data.preparedBy, [key]: value } });
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-sm font-semibold text-navy">Prepared By (optional)</h2>
      <p className="mb-3 text-xs text-slate-500">
        Add your name and contact details so the recipient knows who to reach out to about this document.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Name">
          <TextInput value={data.preparedBy.name} onChange={(e) => setField("name", e.target.value)} />
        </Field>
        <Field label="Phone">
          <TextInput value={data.preparedBy.phone} onChange={(e) => setField("phone", e.target.value)} />
        </Field>
        <Field label="Email">
          <TextInput value={data.preparedBy.email} onChange={(e) => setField("email", e.target.value)} />
        </Field>
      </div>
    </section>
  );
}
