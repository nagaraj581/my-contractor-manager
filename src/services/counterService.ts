import {
  doc,
  getDoc,
  runTransaction,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import type { Company } from "../models/Company";
import type { Counter } from "../models/Counter";

type DocumentType = "quotation" | "invoice" | "project";

type CounterField =
  | "quotationCounter"
  | "invoiceCounter"
  | "projectCounter";

const COUNTER_FIELDS: Record<DocumentType, CounterField> = {
  quotation: "quotationCounter",
  invoice: "invoiceCounter",
  project: "projectCounter",
};

function generateCompanyCode(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0]
      .substring(0, 3)
      .toUpperCase();
  }

  return words
    .map(word => word[0])
    .join("")
    .toUpperCase();
}

function formatDocumentNumber(
  company: Company,
  number: number
) {
  const year = new Date().getFullYear();
  const companyCode =
    company.companyCode || generateCompanyCode(company.companyName);

  return `${companyCode}-${year}-${String(number).padStart(5, "0")}`;
}

/** Read-only preview of the next number. Does not increment the counter. */
export async function peekNextDocumentNumber(
  company: Company,
  documentType: DocumentType
) {
  const counterRef = doc(db, "counters", company.id);
  const snap = await getDoc(counterRef);
  const data = snap.exists()
    ? (snap.data() as Partial<Counter>)
    : {};

  const counterField = COUNTER_FIELDS[documentType];
  const next = Number(data[counterField] ?? 0) + 1;

  return formatDocumentNumber(company, next);
}

export async function peekNextQuotationNumber(company: Company) {
  return peekNextDocumentNumber(company, "quotation");
}

/** Increments the counter and returns the assigned number. Call only on save. */
export async function generateDocumentNumber(
  company: Company,
  documentType: DocumentType
) {
  const counterRef = doc(db, "counters", company.id);
  const counterField = COUNTER_FIELDS[documentType];

  const number = await runTransaction(db, async transaction => {
    const snap = await transaction.get(counterRef);
    const data = snap.exists()
      ? (snap.data() as Partial<Counter>)
      : {};

    const counters: Counter = {
      companyId: company.id,
      quotationCounter: Number(data.quotationCounter ?? 0),
      invoiceCounter: Number(data.invoiceCounter ?? 0),
      projectCounter: Number(data.projectCounter ?? 0),
    };

    const current = counters[counterField] + 1;
    counters[counterField] = current;

    transaction.set(counterRef, counters, { merge: true });

    return current;
  });

  return formatDocumentNumber(company, number);
}

export async function generateQuotationNumber(company: Company) {
  return generateDocumentNumber(company, "quotation");
}
