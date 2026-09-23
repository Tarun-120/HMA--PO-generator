import { GENERAL_PO_TERMS } from "@/lib/constants";

export function GeneralPoTerms() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-sm font-semibold text-navy">General Purchase Order Terms and Conditions</h2>
      <p className="mb-3 text-xs text-slate-500">
        These standard terms are printed on every Purchase Order PDF and are not editable per document.
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-xs text-slate-700">
        {GENERAL_PO_TERMS.map((clause) => (
          <li key={clause.heading}>
            <span className="font-semibold text-navy">{clause.heading}: </span>
            {clause.body}
          </li>
        ))}
      </ol>
    </section>
  );
}
