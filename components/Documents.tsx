import React from "react";
import PlaceHolderDocument from "./PlaceHolderDocument";
import { auth } from "@clerk/nextjs/server";
import { adminDB } from "@/firebaseAdmin";
import Document from "./Document";

async function Documents() {
  auth().protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Error not found");
  }

  const documentsSnapshot = await adminDB
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();

  return (
    <div className="flex flex-wrap p-5 bg-gray-100 justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
      {/* <div>hi</div> */}
      {documentsSnapshot.docs.map((doc) => {
        const { name, downloadUrl, size } = doc.data();

        return (
          <Document
            key={doc.id}
            id={doc.id}
            name={name}
            size={size}
            downloadUrl={downloadUrl}
          />
        );
      })}
      <PlaceHolderDocument></PlaceHolderDocument>
    </div>
  );
}

export default Documents;
