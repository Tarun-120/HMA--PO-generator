"use client";

import { InvoiceData } from "@/lib/types";
import { Field, TextArea } from "./ui/Field";

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export function NotesTerms({ data, onChange }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-navy">Notes &amp; Terms</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Notes (optional)">
          <TextArea
            rows={5}
            placeholder="Any additional note for the customer"
            value={data.notes}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
          />
        </Field>
        <Field label="Terms & Conditions">
          <TextArea
            rows={5}
            value={data.termsAndConditions}
            onChange={(e) => onChange({ ...data, termsAndConditions: e.target.value })}
          />
        </Field>
      </div>
    </section>
  );
}
