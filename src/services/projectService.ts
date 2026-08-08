import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import type { Project } from "../models/Project";import { updateQuotation } from "./quotationService";



const COLLECTION = "projects";

export async function createProject(
    project: Omit<Project, "id">
) {
    const ref = await addDoc(
        collection(db, COLLECTION),
        project
    );

    return ref.id;
}


export async function convertQuotationToProject(
    quotation: {
        id: string;
        companyId: string;
        quotationNo: string;
        customerId: string;
        customerName: string;
        siteAddress: string;
        grandTotal: number;
    }
) {

    const projectId = await createProject({

        companyId: quotation.companyId,

        quotationId: quotation.id,

        quotationNo: quotation.quotationNo,

        customerId: quotation.customerId,

        customerName: quotation.customerName,

        projectName: quotation.quotationNo,

        siteAddress: quotation.siteAddress,

        startDate: new Date().toISOString().slice(0,10),

        expectedCompletionDate: "",

        status: "Planning",

        progress: 0,

        estimatedAmount: quotation.grandTotal,

        actualAmount: 0,

        notes: "",

        createdAt: new Date().toISOString(),

    });

    await updateQuotation(

        quotation.id,
    
        {
    
            convertedToProject: true,
    
            projectId,
    
        }
    
    );

    return projectId;

}

export async function updateProject(
    projectId: string,
    values: Partial<Omit<Project, "id">>
) {
    await updateDoc(
        doc(db, COLLECTION, projectId),
        values
    );
}

export async function getProject(
    projectId: string
) {
    const snapshot = await getDoc(
        doc(db, COLLECTION, projectId)
    );

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data(),
    } as Project;
}

export function subscribeProject(
    projectId: string,
    callback: (project: Project | null) => void
) {

    return onSnapshot(

        doc(db, COLLECTION, projectId),

        snapshot => {

            if (!snapshot.exists()) {

                callback(null);

                return;

            }

            callback({

                id: snapshot.id,

                ...snapshot.data(),

            } as Project);

        }

    );

}



export function subscribeProjects(
    companyId: string,
    callback: (projects: Project[]) => void
) {
    const q = query(
        collection(db, COLLECTION),
        where("companyId", "==", companyId)
    );

    return onSnapshot(q, snapshot => {

        callback(

            snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Project[]

        );

    });
}