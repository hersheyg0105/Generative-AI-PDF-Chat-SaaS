"use server";

import { Message } from "@/components/Chat";
import { adminDB } from "@/firebaseAdmin";
// import { FREE_LIMIT, PRO_LIMIT } from "@/hooks/useSubscription";
import { generateLangChainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
// import { generateLangChainCompletion } from "@/lib/langchain"

// const FREE_LIMIT = 2;
// const PRO_LIMIT = 100;

const PRO_LIMIT = 20;
const FREE_LIMIT = 5;

export async function askQuestion(id: string, question: string) {
  auth().protect();
  const { userId } = await auth();

  const chatRef = adminDB
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .collection("chat");

  // check membership limits for messages in a document
  const chatSnapshot = await chatRef.get();
  const userMessages = chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  // check membership limits for messages in a document
  const userRef = await adminDB.collection("users").doc(userId!).get();

  //limit the FREE users
  if (!userRef.data()?.hasActiveMembership) {
    if (userMessages.length >= FREE_LIMIT) {
      return {
        success: false,
        message: `You'll need to upgrade to PRO to ask more than ${FREE_LIMIT} questions per document`,
      };
    }
  }

  //limit the PRO users
  if (!userRef.data()?.hasActiveMembership) {
    if (userMessages.length >= PRO_LIMIT) {
      return {
        success: false,
        message: `You've reached the PRO limit of ${PRO_LIMIT} questions per document`,
      };
    }
  }

  const userMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };

  await chatRef.add(userMessage);

  // Geneate AI response
  const reply = await generateLangChainCompletion(id, question);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  chatRef.add(aiMessage);

  return { success: true, message: null };
}
