import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import type { ProjectMaterial } from "../models/ProjectMaterial";
import {
    updateDoc,
} from "firebase/firestore";

const COLLECTION="projectMaterials";

export async function addProjectMaterial(
    material: Omit<ProjectMaterial, "id">
) {
    await addDoc(
        collection(db, COLLECTION),
        material
    );
}


export async function updateProjectMaterial(
    id: string,
    data: Partial<ProjectMaterial>
) {
    await updateDoc(
        doc(db, COLLECTION, id),
        data
    );
}

export async function deleteProjectMaterial(
    id: string
) {
    await deleteDoc(
        doc(db, COLLECTION, id)
    );
}

export function subscribeProjectMaterials(
    projectId: string,
    callback: (materials: ProjectMaterial[]) => void
) {
    const q = query(
        collection(db, COLLECTION),
        where("projectId", "==", projectId),
        orderBy(

            "description"
        
        )
    );

    return onSnapshot(q, snapshot => {

        callback(

            snapshot.docs.map(doc => ({

                id: doc.id,

                ...doc.data(),

            })) as ProjectMaterial[]

        );

    });
}