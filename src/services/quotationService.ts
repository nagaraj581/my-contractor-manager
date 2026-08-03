import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import type { Company } from "../models/Company";
import type { Quotation } from "../models/Quotation";
import { generateQuotationNumber } from "./counterService";

const COLLECTION = "quotations";

type QuotationInput = Omit<Quotation, "id" | "quotationNo">;

type QuotationItemInput = {
  rateCardId: string;
  description: string;
  category: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
};

export async function createQuotation(
  quotation: Omit<Quotation, "id">
) {
  const batch = writeBatch(db);
  const quotationRef = doc(collection(db, COLLECTION));

  batch.set(quotationRef, quotation);
  await batch.commit();

  return quotationRef.id;
}

/**
 * Assigns a quotation number at save time, then writes quotation + items
 * in one batch so a failed item write does not leave a numbered empty doc
 * with a reusable cached number.
 */
export async function createQuotationWithItems(
  company: Company,
  quotation: QuotationInput,
  items: QuotationItemInput[]
) {
  const quotationNo = await generateQuotationNumber(company);
  const batch = writeBatch(db);
  const quotationRef = doc(collection(db, COLLECTION));

  batch.set(quotationRef, {
    ...quotation,
    quotationNo,
  });

  const createdAt = new Date().toISOString();

  for (const item of items) {
    const itemRef = doc(collection(quotationRef, "items"));
    batch.set(itemRef, {
      quotationId: quotationRef.id,
      ...item,
      createdAt,
    });
  }

  await batch.commit();

  return {
    id: quotationRef.id,
    quotationNo,
  };
}

export async function updateQuotation(
  quotationId: string,
  values: Partial<Omit<Quotation, "id">>
) {
  await updateDoc(doc(db, COLLECTION, quotationId), values);
}

export async function getQuotation(quotationId: string) {
  const quotationRef = doc(db, COLLECTION, quotationId);
  const snapshot = await getDoc(quotationRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Quotation;
}

export function subscribeQuotations(
  companyId: string,
  callback: (quotations: Quotation[]) => void
) {
  const quotationsQuery = query(
    collection(db, COLLECTION),
    where("companyId", "==", companyId)
  );

  return onSnapshot(quotationsQuery, snapshot => {
    callback(
      snapshot.docs.map(documentSnapshot => ({
        id: documentSnapshot.id,
        ...documentSnapshot.data(),
      })) as Quotation[]
    );
  });
}
export function subscribeQuotation(
  quotationId: string,
  callback: (quotation: Quotation | null) => void
) {
  return onSnapshot(
    doc(db, COLLECTION, quotationId),
    snapshot => {

      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback({
        id: snapshot.id,
        ...snapshot.data(),
      } as Quotation);

    }
  );
}