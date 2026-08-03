export interface Quotation {
  id: string;

  companyId: string;
  customerId: string;

  quotationNo: string;

  quotationDate: string;

  validityDays: number;

  siteAddress: string;
  reference: string;
  notes: string;

  subtotal: number;
  gstAmount: number;
  discount: number;
  grandTotal: number;

  status:
    | "Draft"
    | "Sent"
    | "Accepted"
    | "Rejected";

  createdAt: string;
}