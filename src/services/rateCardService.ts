import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import {

    writeBatch,

    doc,


} from "firebase/firestore";

import { db } from "../firebase/firebase";

import type { RateCard } from "../models/RateCard";

export async function addRateCardItem(
  item: Omit<RateCard, "id">
) {

  await addDoc(
    collection(db, "rateCards"),
    item
  );

}

export async function importRateCards(

    items: Omit<RateCard,"id">[]

){

    const batch = writeBatch(db);

    items.forEach(item=>{

        const ref = doc(
            collection(db,"rateCards")
        );

        batch.set(ref,item);

    });

    await batch.commit();

}

export function subscribeRateCards(

  companyId: string,

  callback: (items: RateCard[]) => void

) {

  const q = query(

    collection(db, "rateCards"),

    where("companyId", "==", companyId)

  );

  return onSnapshot(q, snapshot => {

    callback(

      snapshot.docs.map(doc => ({

        id: doc.id,

        ...doc.data(),

      })) as RateCard[]

    );

  });

}