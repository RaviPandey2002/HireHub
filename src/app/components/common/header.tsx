"use client"

import { Button } from "@/components/ui/button";
import { AlignJustify } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";
import { UserInfoButton } from "./user-info-button";
import { SignOutButton } from "../helper/signOutButton";
import { ClientStatusBtn } from "../helper/clientStatusBtn";
import { UserServerStatus } from "../helper/ServerStatusBtn";


function Header({ user, profileInfo }) {

  const menuItems = [
    {
      label: "Home",
      path: "/",
      show: true,
    },
    {
      label: "Feed",
      path: "/feed",
      show: profileInfo,
    },
    {
      label: "Login",
      path: "/sign-in",
      show: !user,
    },
    {
      label: "Register",
      path: "/sign-up",
      show: !user,
    },
    {
      label: "Activity",
      path: "/activity",
      show: profileInfo?.role === "candidate",
    },
    {
      label: "Companies",
      path: "/companies",
      show: profileInfo?.role === "candidate",
    },
    {
      label: "Jobs",
      path: "/jobs",
      show: profileInfo,
    },
    {
      label: "Membership",
      path: "/membership",
      show: profileInfo,
    },
    {
      label: "Account",
      path: "/account",
      show: profileInfo,
    },
  ];


  return (
    <div className="ml-5 mr-5 p-4">
      <header className="flex h-16 w-full shrink-0 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="lg:hidden">
              <AlignJustify className="h-6 w-6" />
              <span className="sr-only">Toggle Navigation Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link className="mr-6 hidden lg:flex" href='/'>
              <h3>HireHub</h3>
            </Link>

            <div className="grid gap-2 py-6">
              {menuItems.map((menuItem) =>
                menuItem.show ? (
                  <Link
                    href={menuItem.path}
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    key={menuItem.label}
                  >
                    {menuItem.label}
                  </Link>
                ) : null
              )}
            </div>
          </SheetContent>
        </Sheet>
        <Link className="hidden font-bold text-3xl lg:flex mr-6" href={"/"}>
          HIREHUB
        </Link>
        <nav className=" ml-auto hidden lg:flex gap-6 items-center ">
          {menuItems.map((menuItem) =>
            menuItem.show ? (
              <Link
                href={menuItem.path}
                className="group inline-flex h-9 w-max items-center rounded-md  px-4 py-2 text-sm font-medium"
                key={menuItem.label}
              >
                {menuItem.label}
              </Link>
            ) : null
          )}
          {(user)? <UserInfoButton />: null}

        </nav>
        {(user) ? <SignOutButton /> : null}
        <ClientStatusBtn />
        <UserServerStatus />
      </header>
      <div>
      </div>
    </div>
  );
}



export default Header;
