"use server";

import { adminDB, adminStorage } from "@/firebaseAdmin";
import { indexName } from "@/lib/langchain";
import pineconeClient from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteDocument(docId: string) {
  auth().protect();

  const { userId } = await auth();

  //delete firestore record, delete pinecone embeddings namespace, delete firebase storage

  // delete from firestore
  await adminDB
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(docId)
    .delete();

  // delete from storage
  await adminStorage
    .bucket(process.env.FIREBASE_STORAGE_BUCKET)
    .file(`users/${userId}/files/${docId}`)
    .delete();

  //delete embeddings in pinecone
  const index = await pineconeClient.index(indexName);
  await index.namespace(docId).deleteAll();

  revalidatePath("/dashboard");
}
