import {
    addDoc,
    collection,
    onSnapshot,
    query,
    where,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import type { ProjectTask } from "../models/ProjectTask";

const COLLECTION = "projectTasks";

export async function addProjectTask(
    task: Omit<ProjectTask, "id">
) {

    await addDoc(
        collection(db, COLLECTION),
        task
    );

}

export async function updateProjectTask(
    id: string,
    values: Partial<Omit<ProjectTask, "id">>
) {

    await updateDoc(
        doc(db, COLLECTION, id),
        values
    );

}

export async function deleteProjectTask(
    id: string
) {

    await deleteDoc(
        doc(db, COLLECTION, id)
    );

}

export function subscribeProjectTasks(
    projectId: string,
    callback:(tasks:ProjectTask[])=>void
){

    const q=query(

        collection(db,COLLECTION),

        where("projectId","==",projectId)

    );

    return onSnapshot(q,snapshot=>{

        callback(

            snapshot.docs.map(doc=>({

                id:doc.id,

                ...doc.data(),

            })) as ProjectTask[]

        );

    });

}