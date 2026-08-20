"use client";

import { FormEvent, useState } from "react";
import { login } from "@/lib/auth";

interface Props {
  onSuccess: () => void;
}

export function LoginScreen({ onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (login(username, password)) {
      setError(null);
      onSuccess();
    } else {
      setError("Incorrect username or password.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-lg font-bold text-navy">HMA Billing Studio</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to create Proforma Invoices, Quotations and Tax Invoices.</p>

        <label className="mt-5 flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium text-slate-600">Username</span>
          <input
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
          />
        </label>

        <label className="mt-3 flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium text-slate-600">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
          />
        </label>

        {error ? <p className="mt-3 text-xs font-medium text-brandred">{error}</p> : null}

        <button
          type="submit"
          className="mt-5 w-full rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
