# HMA--PO-generator

Client-side PDF generator for **Hindustan Machines & Automation** — create Proforma Invoices, Quotations,
and Tax Invoices with automatic GST (CGST/SGST/IGST) calculation, right in the browser.

- Built with Next.js (App Router) + TypeScript + Tailwind CSS.
- PDFs are rendered client-side with `@react-pdf/renderer` and downloaded directly to your browser's
  download folder — no backend, no data leaves the browser.
- Company profile, bank details, invoice numbering sequence, and document history are all saved to the
  browser's `localStorage`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To add your company logo, place an image file at `public/logo.png` — it will automatically appear on
generated PDFs.
