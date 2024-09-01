import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";

import { adminDB } from "../firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { doc } from "firebase/firestore";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
});

export const indexName = "pdfchat";

export async function generateDocs(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  console.log("feetching download url from firebase");

  const firebaseRef = await adminDB
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();
  const downloadUrl = firebaseRef.data()?.downloadUrl;

  if (!downloadUrl) {
    throw new Error(`Download URL not found ${downloadUrl}`);
  }
  console.log("download URL fetched perfectly for ");

  const response = await fetch(downloadUrl);

  const data = await response.blob();

  console.log("loading pdf document");
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  // split it into chunks
  console.log("splitting it into smaller parts");
  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`split it into ${splitDocs.length} parts`);

  return splitDocs;
}

async function namespaceExists(index: Index, namespace: string) {
  if (namespace === null) {
    throw new Error("No namespace value passed");
  }
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function geneateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  let pineConeVectorStore;
  console.log("Defined pineConeVectorStore");

  const embeddings = new OpenAIEmbeddings();
  console.log("generating embeddings");

  const index = await pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);
  console.log("Checked if namespace exists");

  if (namespaceAlreadyExists) {
    console.log(
      `namespace ${docId} already exists, reusing existing embeddings`
    );

    pineConeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });
    return pineConeVectorStore;
  } else {
    // if namespace does not exist, download the PDF from firestore via the stored Download URL, and generate the embeddings and store them in the pinecone vector store.
    const splitDocs = await generateDocs(docId);

    console.log(
      `storing the embeddings in namespace ${docId} in the ${indexName} pinecone vector space`
    );
    pineConeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );
    return pineConeVectorStore;
  }
}
