import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { FilePlus2 } from "lucide-react";

function Header() {
  return (
    <div className="flex justify-between p-5 shadow-sm items-center border-b">
      <Link href="/dashboard">
        Chat to
        <span className="text-indigo-600"> PDF</span>
      </Link>

      <SignedIn>
        <div className="flex space-x-2 items-center">
          <Button asChild variant="outline" className="hidden md:flex">
            <Link href="/dashboard/upgrade">Pricing</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/dashboard">My Documents</Link>
          </Button>

          <Button asChild variant="outline" className="border-indigo-600">
            <Link href="/dashboard/upload">
              <FilePlus2 className="text-indigo-600"></FilePlus2>
            </Link>
          </Button>
          {/* UPgrade button */}
          <UserButton></UserButton>
        </div>
      </SignedIn>
      {/* <p>hello</p>
      <p>hi</p>
      <p>bye</p> */}
    </div>
  );
}

export default Header;
