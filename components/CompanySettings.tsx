"use client";

import { useState } from "react";
import { Field, TextInput } from "./ui/Field";
import { BankInfo, CompanyInfo } from "@/lib/types";

interface Props {
  company: CompanyInfo;
  bank: BankInfo;
  onCompanyChange: (c: CompanyInfo) => void;
  onBankChange: (b: BankInfo) => void;
}

export function CompanySettings({ company, bank, onCompanyChange, onBankChange }: Props) {
  const [open, setOpen] = useState(false);

  function setCompanyField<K extends keyof CompanyInfo>(key: K, value: CompanyInfo[K]) {
    onCompanyChange({ ...company, [key]: value });
  }

  function setBankField<K extends keyof BankInfo>(key: K, value: BankInfo[K]) {
    onBankChange({ ...bank, [key]: value });
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <h2 className="text-sm font-semibold text-navy">Your Company &amp; Bank Details</h2>
          <p className="text-xs text-slate-500">{company.tradeName} - GSTIN {company.gstin}</p>
        </div>
        <span className="text-xs text-slate-500">{open ? "Hide" : "Edit"}</span>
      </button>

      {open ? (
        <div className="grid grid-cols-1 gap-6 border-t border-slate-200 px-4 py-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Company (Seller)</h3>
            <Field label="Legal Name">
              <TextInput value={company.legalName} onChange={(e) => setCompanyField("legalName", e.target.value)} />
            </Field>
            <Field label="Trade Name (shown on PDF)">
              <TextInput value={company.tradeName} onChange={(e) => setCompanyField("tradeName", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="GSTIN">
                <TextInput value={company.gstin} onChange={(e) => setCompanyField("gstin", e.target.value)} />
              </Field>
              <Field label="PAN">
                <TextInput value={company.pan} onChange={(e) => setCompanyField("pan", e.target.value)} />
              </Field>
            </div>
            <Field label="Address Line 1">
              <TextInput value={company.addressLine1} onChange={(e) => setCompanyField("addressLine1", e.target.value)} />
            </Field>
            <Field label="Address Line 2">
              <TextInput value={company.addressLine2} onChange={(e) => setCompanyField("addressLine2", e.target.value)} />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="City">
                <TextInput value={company.city} onChange={(e) => setCompanyField("city", e.target.value)} />
              </Field>
              <Field label="State">
                <TextInput value={company.state} onChange={(e) => setCompanyField("state", e.target.value)} />
              </Field>
              <Field label="State Code">
                <TextInput value={company.stateCode} onChange={(e) => setCompanyField("stateCode", e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="PIN Code">
                <TextInput value={company.pinCode} onChange={(e) => setCompanyField("pinCode", e.target.value)} />
              </Field>
              <Field label="Phone">
                <TextInput value={company.phone} onChange={(e) => setCompanyField("phone", e.target.value)} />
              </Field>
            </div>
            <Field label="Email">
              <TextInput value={company.email} onChange={(e) => setCompanyField("email", e.target.value)} />
            </Field>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bank Details</h3>
            <Field label="Beneficiary Name">
              <TextInput value={bank.beneficiaryName} onChange={(e) => setBankField("beneficiaryName", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Account Number">
                <TextInput value={bank.accountNumber} onChange={(e) => setBankField("accountNumber", e.target.value)} />
              </Field>
              <Field label="Account Type">
                <TextInput value={bank.accountType} onChange={(e) => setBankField("accountType", e.target.value)} />
              </Field>
            </div>
            <Field label="Bank Name">
              <TextInput value={bank.bankName} onChange={(e) => setBankField("bankName", e.target.value)} />
            </Field>
            <Field label="Branch Name">
              <TextInput value={bank.branchName} onChange={(e) => setBankField("branchName", e.target.value)} />
            </Field>
            <Field label="Branch Address">
              <TextInput value={bank.branchAddress} onChange={(e) => setBankField("branchAddress", e.target.value)} />
            </Field>
            <Field label="IFSC Code">
              <TextInput value={bank.ifsc} onChange={(e) => setBankField("ifsc", e.target.value)} />
            </Field>
            <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
              Logo: place your logo image file as <code className="font-mono text-navy">public/logo.png</code> (or
              <code className="font-mono text-navy"> .jpg</code> / <code className="font-mono text-navy">.jpeg</code>
              ) in the project folder. Signature: place it as{" "}
              <code className="font-mono text-navy">public/signature.png</code> (or .jpg / .jpeg). Both appear
              automatically on generated PDFs - no code changes needed.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
