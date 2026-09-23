"use client";

import { InvoiceData } from "@/lib/types";
import { Field, TextArea } from "./ui/Field";

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export function TermsConditions({ data, onChange }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-navy">Terms &amp; Conditions</h2>
      <Field label="Terms & Conditions">
        <TextArea
          rows={5}
          value={data.termsAndConditions}
          onChange={(e) => onChange({ ...data, termsAndConditions: e.target.value })}
        />
      </Field>
    </section>
  );
}
