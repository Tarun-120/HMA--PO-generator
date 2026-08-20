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
};

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
