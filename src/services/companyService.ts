import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import type { Company } from "../models/Company";

const COLLECTION = "companies";

export async function createCompany(
  company: Omit<Company, "id">
) {
  const docRef = await addDoc(
    collection(db, COLLECTION),
    company
  );

  return docRef.id;
}

export async function getCompaniesByUser(
  uid: string
) {
  const q = query(
    collection(db, COLLECTION),
    where("memberIds", "array-contains", uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Company[];
}

export async function hasCompany(uid: string) {
  const companies = await getCompaniesByUser(uid);
  return companies.length > 0;
}