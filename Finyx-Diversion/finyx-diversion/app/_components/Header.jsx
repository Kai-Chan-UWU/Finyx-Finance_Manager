"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <div className="flex flex-row items-center">
        <Image src={"logo.png"} alt="logo" width={40} height={25} />
        <span className="text-emerald-700  font-bold text-xl">Finyx</span>
      </div>
      {isSignedIn ? (
        <UserButton />
      ) : (
        <div className="flex gap-3  items-center">
          <Link href={"/dashboard"}>
            <Button variant="outline" className="rounded-full border-emerald-700 text-emerald-700">
              Dashboard
            </Button>
          </Link>
          <Link href={"/sign-in"}>
            <Button className="rounded-full bg-emerald-500 hover:bg-emerald-800">Get Started</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
