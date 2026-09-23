import { BankInfo, CompanyInfo } from "./types";

export const DEFAULT_COMPANY: CompanyInfo = {
  legalName: "HINDUSTAN MACHINES & AUTOMATION",
  tradeName: "HINDUSTAN MACHINES & AUTOMATION",
  gstin: "09AARFH8133J1ZT",
  pan: "AARFH8133J",
  addressLine1: "KH No. 692, Saddiq Nagar, Sihani Meerut Road",
  addressLine2: "Near Modern Public School, Sihani Chungi",
  city: "Ghaziabad",
  state: "Uttar Pradesh",
  stateCode: "09",
  pinCode: "201001",
  phone: "+91 95994 87511",
  email: "ajhmagroup@gmail.com",
};

export const DEFAULT_BANK: BankInfo = {
  beneficiaryName: "HINDUSTAN MACHINES & AUTOMATION",
  accountNumber: "0279102000021979",
  accountType: "Current Account",
  bankName: "IDBI Bank Ltd.",
  branchName: "G T Road - Ghaziabad II",
  branchAddress: "2-3, Amar Enclave, East Model Town, G T Road, Ghaziabad, Uttar Pradesh - 201001",
  ifsc: "IBKL0000279",
};

export const DEFAULT_TERMS: Record<string, string> = {
  TAX_INVOICE:
    "1. Payment due within the agreed credit period from the date of invoice.\n2. Interest @18% p.a. will be charged on overdue payments.\n3. Goods once sold will not be taken back.\n4. Subject to Ghaziabad jurisdiction only.\n5. This is a computer generated invoice.",
  PROFORMA_INVOICE:
    "1. This is a Proforma Invoice and not a demand for payment.\n2. Prices are valid as per the validity mentioned above.\n3. Order will be confirmed only after receipt of advance payment.\n4. Delivery timeline will be confirmed on order confirmation.\n5. Subject to Ghaziabad jurisdiction only.",
  QUOTATION:
    "1. Prices quoted are valid until the date mentioned above.\n2. Taxes as applicable at the time of billing.\n3. Delivery period will be confirmed on order confirmation.\n4. Payment terms to be mutually agreed at the time of order.\n5. Subject to Ghaziabad jurisdiction only.",
  PURCHASE_ORDER:
    "1. Please confirm this order in writing and mention our PO number on your invoice and dispatch documents.\n2. Goods must match the specification, quantity and rates mentioned above.\n3. Material found defective or not as per specification will be rejected and returned at supplier's cost.\n4. Delivery to be completed within the agreed timeline; delays must be communicated in advance.\n5. Payment will be released as per mutually agreed terms after receipt and inspection of goods.\n6. Subject to Ghaziabad jurisdiction only.",
};

export interface PoTermsClause {
  heading: string;
  body: string;
}

export const GENERAL_PO_TERMS: PoTermsClause[] = [
  {
    heading: "Scope",
    body: 'The following document covers mutual terms and conditions between the seller/supplier, i.e., whomsoever this document has been addressed to and the buyer, i.e., M/s. Hindustan Machines & Automation, which shall hereinafter be referred to as "HMA" for all the purposes of this document. The technical specifications of each item in the supplier\'s scope shall be of the highest quality and suitable for the intended service, complying with the highest applicable standards. The supplier is responsible for the completeness of the system. Any components, fittings, accessories, etc., not specifically mentioned in the specifications or drawings but necessary for the satisfactory functioning of the system, shall be provided by the supplier at no extra cost. For additional details, refer to Purchase Order Remarks.',
  },
  {
    heading: "Payment",
    body: "Payment and Credit Terms shall be as mentioned in the Purchase Order remarks. If the Purchase Order is silent, then a credit period of 45 days from the invoice date shall apply. Payment will be made in INR in case of a supply from India and in the invoice currency in case of a supply from an overseas location.",
  },
  {
    heading: "Documents for Payment Process",
    body: "Signed commercial invoice/Delivery challan/LR. Packing list. Internal Inspection Report/Performance Report. Test Certificate/Warranty Certificate. Other documents as per dispatch instructions.",
  },
  {
    heading: "Price Validity",
    body: "The price indicated in the Purchase Order (PO) is firm and non-negotiable until the completion of the project, irrespective of any market price variations in materials or services.",
  },
  {
    heading: "Packing & Forwarding",
    body: "All shipments shall be properly packed, marked, and shipped in accordance with the requirements of the Purchase Order or specific instructions of the Buyer. If there is no specific instruction from the Buyer, goods shall be packed, marked, and shipped in a prudent manner. The seller will be liable for the loss of goods if the requirements of this condition are not met.",
  },
  {
    heading: "Freight",
    body: 'As per the Purchase Order remarks. "TO PAY" OR "POSTPAID" shall not be accepted in any scenario. The supplier will be liable to pay at the time of delivery. If freight is extra, it should be included in the invoice.',
  },
  {
    heading: "Carrier",
    body: "If the Buyer designates a specific carrier, the Seller shall attempt to use that carrier. Otherwise, the Seller may select a carrier of his choice to transport the goods. If the Seller fails to meet the delivery schedule, the Buyer may require expedited shipment at the Seller's cost. Expedited shipment does not relieve the Seller from liquidated damages for delays.",
  },
  {
    heading: "Delivery",
    body: "As per the Purchase Order remarks. Delays beyond the stipulated delivery schedule shall attract the Liquidated Damages (LD) clause.",
  },
  {
    heading: "Material Dispatch Clearance",
    body: "Materials should be dispatched only after the issuance of the Material Dispatch Clearance Certificate (MDCC) from HMA upon inspection completion.",
  },
  {
    heading: "Documents Submission for Approval",
    body: "Quality Assurance Plan (QAP) and Escalation Matrix must be submitted for approval within 4-5 days from the Letter of Intent (LOI) or PO.",
  },
  {
    heading: "Inspection",
    body: "Inspection by HMA/Consultant/Customer is mandatory. Inspection calls must be raised at least 3 days in advance of the actual verification date.",
  },
  {
    heading: "Tests to be Performed at Vendor Premises",
    body: "Tests must be conducted as per IS/Relevant standards applicable and QAP.",
  },
  {
    heading: "Quantity Modifications",
    body: "The Seller shall not over or under deliver any quantity of Goods than the quantity mentioned in the Buyer's Purchase Order without prior permission. Over shipments may be returned at the Seller's cost or stored at a 10% storage charge per invoice value.",
  },
  {
    heading: "Acceptance",
    body: "The Seller must accept the Buyer's Purchase Order and notify within 48 hours, failing which it shall be considered accepted by default.",
  },
  {
    heading: "Warranty",
    body: "The equipment/materials supplied shall be guaranteed against bad workmanship, wrong design, poor quality of materials, and poor performance for 12 months from the dispatch date. Defective items shall be rectified or replaced at no cost to HMA.",
  },
  {
    heading: "Warranty Period Terms",
    body: "During the warranty period, all defective parts due to manufacturing defects shall be replaced and installed at no cost to the purchaser, covering supplies, freight, duties, travel, lodging, and boarding.",
  },
  {
    heading: "Risk Purchase",
    body: "In case of delivery delays beyond a pre-agreed date, HMA reserves the right to re-procure the goods at the vendor's risk and cost from any source.",
  },
  {
    heading: "Liquidated Damages (LD)",
    body: "Delays will result in LD at 1% per week up to a maximum of 10% of the total order or contract value. HMA reserves the right to cancel the order and source from an alternative supplier at the vendor's risk and cost if delays exceed one month.",
  },
  {
    heading: "Technical Deviation",
    body: "Technical deviations are not acceptable unless specifically authorized in writing by the design engineer of HMA. Materials must conform strictly to approved technical specifications and drawings.",
  },
  {
    heading: "Insurance Claims",
    body: "In case of loss or damage of goods during transit, the responsibility to lodge a claim will be based on price terms. Both parties shall assist each other in lodging claims.",
  },
  {
    heading: "Completeness of Design",
    body: "The supplier must ensure that the design of the equipment or materials supplied enables beneficial use to the end user, irrespective of interventions by the approving authority.",
  },
  {
    heading: "Unloading Procedure",
    body: "Unloading procedures must be submitted prior to dispatch.",
  },
  {
    heading: "Force Majeure",
    body: "Neither party shall be liable for failure to fulfill obligations due to force majeure events, including acts of God, war, terrorism, civil disturbances, and governmental actions.",
  },
  {
    heading: "Governing Law and Jurisdiction",
    body: "This order shall be governed by Indian laws, and the courts at Delhi shall have exclusive jurisdiction over all disputes arising under or pursuant to it.",
  },
];

export const GST_RATES = [0, 5, 12, 18, 28];

export const UNITS = ["Nos", "Set", "Pcs", "Unit", "Box", "Mtr", "Kg", "Ltr", "Job"];

export const INDIAN_STATES: { name: string; code: string }[] = [
  { name: "Jammu and Kashmir", code: "01" },
  { name: "Himachal Pradesh", code: "02" },
  { name: "Punjab", code: "03" },
  { name: "Chandigarh", code: "04" },
  { name: "Uttarakhand", code: "05" },
  { name: "Haryana", code: "06" },
  { name: "Delhi", code: "07" },
  { name: "Rajasthan", code: "08" },
  { name: "Uttar Pradesh", code: "09" },
  { name: "Bihar", code: "10" },
  { name: "Sikkim", code: "11" },
  { name: "Arunachal Pradesh", code: "12" },
  { name: "Nagaland", code: "13" },
  { name: "Manipur", code: "14" },
  { name: "Mizoram", code: "15" },
  { name: "Tripura", code: "16" },
  { name: "Meghalaya", code: "17" },
  { name: "Assam", code: "18" },
  { name: "West Bengal", code: "19" },
  { name: "Jharkhand", code: "20" },
  { name: "Odisha", code: "21" },
  { name: "Chhattisgarh", code: "22" },
  { name: "Madhya Pradesh", code: "23" },
  { name: "Gujarat", code: "24" },
  { name: "Daman and Diu", code: "25" },
  { name: "Dadra and Nagar Haveli", code: "26" },
  { name: "Maharashtra", code: "27" },
  { name: "Andhra Pradesh (Old)", code: "28" },
  { name: "Karnataka", code: "29" },
  { name: "Goa", code: "30" },
  { name: "Lakshadweep", code: "31" },
  { name: "Kerala", code: "32" },
  { name: "Tamil Nadu", code: "33" },
  { name: "Puducherry", code: "34" },
  { name: "Andaman and Nicobar Islands", code: "35" },
  { name: "Telangana", code: "36" },
  { name: "Andhra Pradesh", code: "37" },
  { name: "Ladakh", code: "38" },
];
