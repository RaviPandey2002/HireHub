"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { AlignJustify } from "lucide-react";
import Link from "next/link";

function Header({ user }: any) {
  console.log("USERR: ", user);

  const menuItems = [
    {
      label: "Home",
      path: "/",
      show: "true",
    },
    {
      label: "Login",
      path: "/login",
      show: !user,
    },
    {
      label: "Register",
      path: "/register",
      show: !user,
    },
  ];

  return (
    <div>
      <header className="flex h-16 w-full shrink-0 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="lg:hidden">
              <AlignJustify className="h-6 w-6" />
              <span className="sr-only">Toggle Navigation Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link className="mr-6 hidden lg:flex" href={"#"}>
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
        <nav className=" ml-auto hidden lg:flex gap-6 items-center">
          {menuItems.map((menuItem) =>
            menuItem.show ? (
              <Link
                href={menuItem.path}
                onClick={() => sessionStorage.removeItem("filterParams")}
                className="group inline-flex h-9 w-max items-center rounded-md  px-4 py-2 text-sm font-medium"
                key={menuItem.label}
              >
                {menuItem.label}
              </Link>
            ) : null
          )}
        </nav>
      </header>
    </div>
  );
}

export default Header;
