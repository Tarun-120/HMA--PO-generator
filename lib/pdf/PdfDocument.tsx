import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { calculateInvoice } from "../calculations";
import { amountInWordsINR } from "../numberToWords";
import { BankInfo, CompanyInfo, DOC_TYPE_LABEL, InvoiceData } from "../types";
import { styles } from "./styles";

const DOC_SUBTITLE: Record<InvoiceData["docType"], string> = {
  TAX_INVOICE: "Tax Invoice under GST",
  PROFORMA_INVOICE: "This is a Proforma Invoice - not a demand for payment",
  QUOTATION: "Prices quoted are subject to confirmation at the time of order",
};

function fmtMoney(n: number): string {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d: string): string {
  if (!d) return "-";
  const parts = d.split("-");
  if (parts.length !== 3) return d;
  const [y, m, day] = parts;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[parseInt(m, 10) - 1]} ${y}`;
}

export interface PdfDocumentProps {
  data: InvoiceData;
  company: CompanyInfo;
  bank: BankInfo;
  logoDataUrl: string | null;
}

export function PdfDocument({ data, company, bank, logoDataUrl }: PdfDocumentProps) {
  const totals = calculateInvoice(data.items, company.stateCode, data.buyer.stateCode || company.stateCode, {
    amount: data.freightAmount,
    gstRate: data.freightGstRate,
  });
  const label = DOC_TYPE_LABEL[data.docType];

  return (
    <Document
      title={`${data.docNumber} - ${company.tradeName}`}
      author={company.legalName}
      subject={label}
    >
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.companyBlock}>
            {logoDataUrl ? (
              <Image src={logoDataUrl} style={styles.logoImg} />
            ) : (
              <View style={styles.logoFallback}>
                <Text style={styles.logoFallbackText}>HMA</Text>
              </View>
            )}
            <View>
              <Text style={styles.companyName}>{company.tradeName}</Text>
              <Text style={styles.companyLine}>
                {company.addressLine1}, {company.addressLine2}
              </Text>
              <Text style={styles.companyLine}>
                {company.city}, {company.state} - {company.pinCode}
              </Text>
              <Text style={styles.companyLine}>GSTIN: {company.gstin}  |  PAN: {company.pan}</Text>
              <Text style={styles.companyLine}>
                {company.phone}  |  {company.email}
              </Text>
            </View>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.docTitle}>{label}</Text>
            <Text style={styles.docSubtitle}>{DOC_SUBTITLE[data.docType]}</Text>
            <View style={{ marginTop: 6 }}>
              <View style={styles.docMetaRow}>
                <Text style={styles.docMetaLabel}>No.:  </Text>
                <Text>{data.docNumber}</Text>
              </View>
              <View style={styles.docMetaRow}>
                <Text style={styles.docMetaLabel}>Date:  </Text>
                <Text>{fmtDate(data.docDate)}</Text>
              </View>
              {data.docType === "TAX_INVOICE" && data.dueDate ? (
                <View style={styles.docMetaRow}>
                  <Text style={styles.docMetaLabel}>Due Date:  </Text>
                  <Text>{fmtDate(data.dueDate)}</Text>
                </View>
              ) : null}
              {data.docType === "QUOTATION" && data.validUntil ? (
                <View style={styles.docMetaRow}>
                  <Text style={styles.docMetaLabel}>Valid Until:  </Text>
                  <Text>{fmtDate(data.validUntil)}</Text>
                </View>
              ) : null}
              {data.poNumber ? (
                <View style={styles.docMetaRow}>
                  <Text style={styles.docMetaLabel}>PO No.:  </Text>
                  <Text>{data.poNumber}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Bill To */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>
              {data.docType === "QUOTATION" ? "Quoted To" : "Bill To"}
            </Text>
            <Text style={styles.infoTextBold}>{data.buyer.name || "-"}</Text>
            <Text style={styles.infoText}>{data.buyer.address || "-"}</Text>
            {data.buyer.state ? (
              <Text style={styles.infoText}>
                State: {data.buyer.state} {data.buyer.stateCode ? `(${data.buyer.stateCode})` : ""}
              </Text>
            ) : null}
            {data.buyer.gstin ? <Text style={styles.infoText}>GSTIN: {data.buyer.gstin}</Text> : null}
            {data.buyer.phone ? <Text style={styles.infoText}>Phone: {data.buyer.phone}</Text> : null}
            {data.buyer.email ? <Text style={styles.infoText}>Email: {data.buyer.email}</Text> : null}
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Shipment To</Text>
            {data.shipSameAsBill ? (
              <Text style={styles.infoText}>Same as Bill To address.</Text>
            ) : (
              <>
                <Text style={styles.infoTextBold}>{data.shipTo.name || "-"}</Text>
                <Text style={styles.infoText}>{data.shipTo.address || "-"}</Text>
                {data.shipTo.state ? (
                  <Text style={styles.infoText}>
                    State: {data.shipTo.state} {data.shipTo.stateCode ? `(${data.shipTo.stateCode})` : ""}
                  </Text>
                ) : null}
                {data.shipTo.gstin ? <Text style={styles.infoText}>GSTIN: {data.shipTo.gstin}</Text> : null}
                {data.shipTo.phone ? <Text style={styles.infoText}>Phone: {data.shipTo.phone}</Text> : null}
                {data.shipTo.email ? <Text style={styles.infoText}>Email: {data.shipTo.email}</Text> : null}
              </>
            )}
          </View>
        </View>

        <View style={styles.metaStrip}>
          <Text style={styles.metaStripItem}>
            Place of Supply: <Text style={styles.metaStripValue}>
              {data.buyer.state || company.state} ({data.buyer.stateCode || company.stateCode})
            </Text>
          </Text>
          <Text style={styles.metaStripItem}>
            Tax Type: <Text style={styles.metaStripValue}>{totals.isIntraState ? "CGST + SGST" : "IGST"}</Text>
          </Text>
          <Text style={styles.metaStripItem}>
            Reverse Charge: <Text style={styles.metaStripValue}>No</Text>
          </Text>
          <Text style={styles.metaStripItem}>
            Total Items: <Text style={styles.metaStripValue}>{data.items.length}</Text>
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeadRow}>
            <Text style={[styles.th, styles.colBorder, { width: "5%" }]}>#</Text>
            <Text style={[styles.th, styles.colBorder, { width: "27%" }]}>Description</Text>
            <Text style={[styles.th, styles.colBorder, { width: "9%" }]}>HSN/SAC</Text>
            <Text style={[styles.th, styles.colBorder, { width: "7%", textAlign: "right" }]}>Qty</Text>
            <Text style={[styles.th, styles.colBorder, { width: "10%", textAlign: "right" }]}>Rate</Text>
            <Text style={[styles.th, styles.colBorder, { width: "7%", textAlign: "right" }]}>Disc%</Text>
            <Text style={[styles.th, styles.colBorder, { width: "11%", textAlign: "right" }]}>Taxable</Text>
            <Text style={[styles.th, styles.colBorder, { width: "6%", textAlign: "right" }]}>GST%</Text>
            {totals.isIntraState ? (
              <>
                <Text style={[styles.th, styles.colBorder, { width: "9%", textAlign: "right" }]}>CGST</Text>
                <Text style={[styles.th, styles.colBorder, { width: "9%", textAlign: "right" }]}>SGST</Text>
              </>
            ) : (
              <Text style={[styles.th, styles.colBorder, { width: "18%", textAlign: "right" }]}>IGST</Text>
            )}
          </View>
          {totals.items.map((ic, idx) => {
            const isLast = idx === totals.items.length - 1;
            return (
              <View key={ic.item.id} style={isLast ? styles.tableRowLast : styles.tableRow}>
                <Text style={[styles.td, styles.colBorder, { width: "5%" }]}>{idx + 1}</Text>
                <Text style={[styles.td, styles.colBorder, { width: "27%" }]}>{ic.item.description || "-"}</Text>
                <Text style={[styles.td, styles.colBorder, { width: "9%" }]}>{ic.item.hsnSac || "-"}</Text>
                <Text style={[styles.td, styles.colBorder, { width: "7%", textAlign: "right" }]}>
                  {ic.item.qty} {ic.item.unit}
                </Text>
                <Text style={[styles.td, styles.colBorder, { width: "10%", textAlign: "right" }]}>
                  {fmtMoney(ic.item.rate)}
                </Text>
                <Text style={[styles.td, styles.colBorder, { width: "7%", textAlign: "right" }]}>
                  {ic.item.discountPercent || 0}%
                </Text>
                <Text style={[styles.td, styles.colBorder, { width: "11%", textAlign: "right" }]}>
                  {fmtMoney(ic.taxableValue)}
                </Text>
                <Text style={[styles.td, styles.colBorder, { width: "6%", textAlign: "right" }]}>
                  {ic.item.gstRate}%
                </Text>
                {totals.isIntraState ? (
                  <>
                    <Text style={[styles.td, styles.colBorder, { width: "9%", textAlign: "right" }]}>
                      {fmtMoney(ic.cgstAmount)}
                    </Text>
                    <Text style={[styles.td, styles.colBorder, { width: "9%", textAlign: "right" }]}>
                      {fmtMoney(ic.sgstAmount)}
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.td, styles.colBorder, { width: "18%", textAlign: "right" }]}>
                    {fmtMoney(ic.igstAmount)}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Totals */}
        <View style={styles.totalsWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Items Subtotal</Text>
              <Text style={styles.totalsValue}>Rs. {fmtMoney(totals.itemsSubtotal)}</Text>
            </View>
            {totals.freightAmount > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Freight / Forwarding Charges</Text>
                <Text style={styles.totalsValue}>Rs. {fmtMoney(totals.freightAmount)}</Text>
              </View>
            ) : null}
            {totals.isIntraState ? (
              <>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>CGST</Text>
                  <Text style={styles.totalsValue}>Rs. {fmtMoney(totals.totalCgst)}</Text>
                </View>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>SGST</Text>
                  <Text style={styles.totalsValue}>Rs. {fmtMoney(totals.totalSgst)}</Text>
                </View>
              </>
            ) : (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>IGST</Text>
                <Text style={styles.totalsValue}>Rs. {fmtMoney(totals.totalIgst)}</Text>
              </View>
            )}
            <View style={[styles.totalsRow, styles.totalsRowBorder]}>
              <Text style={styles.totalsLabel}>Round Off</Text>
              <Text style={styles.totalsValue}>Rs. {fmtMoney(totals.roundOff)}</Text>
            </View>
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>Grand Total</Text>
              <Text style={styles.grandValue}>Rs. {fmtMoney(totals.grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Amount in words */}
        <View style={styles.wordsRow}>
          <Text style={styles.wordsLabel}>Amount in Words:</Text>
          <Text style={styles.wordsText}>{amountInWordsINR(totals.grandTotal)}</Text>
        </View>

        {data.notes ? (
          <View style={styles.notesBox}>
            <Text style={styles.boxTitle}>Notes</Text>
            <Text style={styles.termsText}>{data.notes}</Text>
          </View>
        ) : null}

        {/* Bank + Terms */}
        <View style={styles.bottomRow}>
          <View style={styles.bankBox}>
            <Text style={styles.boxTitle}>Bank Details</Text>
            <View style={styles.bankLine}>
              <Text style={styles.bankLabel}>Beneficiary</Text>
              <Text style={styles.bankValue}>{bank.beneficiaryName}</Text>
            </View>
            <View style={styles.bankLine}>
              <Text style={styles.bankLabel}>Account No.</Text>
              <Text style={styles.bankValue}>{bank.accountNumber}</Text>
            </View>
            <View style={styles.bankLine}>
              <Text style={styles.bankLabel}>Account Type</Text>
              <Text style={styles.bankValue}>{bank.accountType}</Text>
            </View>
            <View style={styles.bankLine}>
              <Text style={styles.bankLabel}>Bank Name</Text>
              <Text style={styles.bankValue}>{bank.bankName}</Text>
            </View>
            <View style={styles.bankLine}>
              <Text style={styles.bankLabel}>Branch</Text>
              <Text style={styles.bankValue}>{bank.branchName}</Text>
            </View>
            <View style={styles.bankLine}>
              <Text style={styles.bankLabel}>IFSC Code</Text>
              <Text style={styles.bankValue}>{bank.ifsc}</Text>
            </View>
          </View>
          <View style={styles.termsBox}>
            <Text style={styles.boxTitle}>Terms &amp; Conditions</Text>
            <Text style={styles.termsText}>{data.termsAndConditions}</Text>
            <View style={styles.signatureArea}>
              <Text style={styles.signatureFor}>For {company.tradeName}</Text>
              <View style={styles.signatureSpace} />
              <Text style={styles.signatureLabel}>Authorised Signatory</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          {company.tradeName} | GSTIN: {company.gstin} | This is a system generated {label.toLowerCase()} and does not require a physical signature.
        </Text>
      </Page>
    </Document>
  );
}
