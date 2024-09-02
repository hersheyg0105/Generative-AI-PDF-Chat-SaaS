"use client";

import React from "react";
import { Button } from "./ui/button";
import { FrownIcon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";

function PlaceHolderDocument() {
  const router = useRouter();
  const { isOverFileLimit } = useSubscription();
  // const handleClick = () => {
  //   console.log("We're going to upload document");
  //   router.push("/dashboard/upload");
  // };

  const handleClick = () => {
    if (isOverFileLimit) {
      router.push("/dashboard/upgrade");
    } else {
      router.push("/dashboard/upload");
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="flex flex-col items-center w-64 h-80 rounded-xl bg-gray-200 text-gray-400 space-y-2"
    >
      {isOverFileLimit ? (
        <FrownIcon className="h-16 w-16" />
      ) : (
        <PlusCircleIcon className="h-16 w-16"></PlusCircleIcon>
      )}

      <p className="font-semibold">
        {isOverFileLimit ? "Upgrade to add more documents" : "Add a document"}
      </p>
    </Button>
  );
}

export default PlaceHolderDocument;
