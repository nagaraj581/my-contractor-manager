import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import type { QuotationItem } from "../models/QuotationItem";




export async function addQuotationItem(
  quotationId: string,
  item: Omit<QuotationItem, "id">
) {

  await addDoc(
    collection(
      db,
      "quotations",
      quotationId,
      "items"
    ),
    item
  );

}

export async function updateQuotationItem(
  quotationId: string,
  itemId: string,
  data: {
      description: string;
      category: string;
      unit: string;
      quantity: number;
      rate: number;
      amount: number;
  }
) {
  await updateDoc(
      doc(
          db,
          "quotations",
          quotationId,
          "items",
          itemId
      ),
      data
  );
}

export async function deleteQuotationItem(

  quotationId: string,

  itemId: string

) {

  await deleteDoc(

    doc(
      db,
      "quotations",
      quotationId,
      "items",
      itemId
    )

  );

}

export function subscribeQuotationItems(

  quotationId: string,

  callback: (items: QuotationItem[]) => void

) {

  const q = query(

    collection(
      db,
      "quotations",
      quotationId,
      "items"
    ),

    orderBy("createdAt")

  );

  return onSnapshot(q, snapshot => {

    callback(

      snapshot.docs.map(doc => ({

        id: doc.id,

        ...doc.data(),

      })) as QuotationItem[]

    );

  });

}
