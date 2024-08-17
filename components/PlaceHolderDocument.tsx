"use client";

import React from "react";
import { Button } from "./ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function PlaceHolderDocument() {
  const router = useRouter();
  const handleClick = () => {
    console.log("We're going to upload document");
    router.push("/dashboard/upload");
  };

  return (
    <Button
      onClick={handleClick}
      className="flex flex-col items-center w-64 h-80 rounded-xl bg-gray-200 text-gray-400 space-y-2"
    >
      <PlusCircleIcon className="h-16 w-16"></PlusCircleIcon>
      <p>Add Document</p>
    </Button>
  );
}

export default PlaceHolderDocument;
