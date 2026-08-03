import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import type { Customer } from "../models/Customer";

export async function addCustomer(
  customer: Omit<Customer, "id">
) {

  await addDoc(
    collection(db, "customers"),
    customer
  );

}

export async function getCustomers(
  companyId: string
) {

  const q = query(
    collection(db, "customers"),
    where("companyId", "==", companyId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Customer[];

}

export function subscribeCustomers(
  companyId: string,
  callback: (customers: Customer[]) => void
) {

  const q = query(
    collection(db, "customers"),
    where("companyId", "==", companyId)
  );

  return onSnapshot(q, snapshot => {

    callback(

      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Customer[]

    );

  });

}