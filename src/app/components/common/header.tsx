import { auth } from "auth";
import Link from "next/link";
import { ClientStatusBtn } from "../helper/clientStatusBtn";
import { UserServerStatus } from "../helper/ServerStatusBtn";
import { SignOutButton } from "../helper/signOutButton";
import { HeaderSheet } from "./header-sheet";
import { UserInfoButton } from "./user-info-button";
import { Button } from "../ui/button";


async function Header({ user }) {
  // console.log("header layoutUser ",user)
  const menuItems = [
    {
      label: "Home",
      path: "/",
      show: true,
    },
    {
      label: "Feed",
      path: "/feed",
      show: user?.role,
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
    {
      label: "Activity",
      path: "/activity",
      show: user?.role === "Candidate",
    },
    {
      label: "Companies",
      path: "/companies",
      show: user?.role === "Candidate",
    },
    {
      label: "Jobs",
      path: "/jobs",
      show: user
    },
    {
      label: "Membership",
      path: "/membership",
      show: user?.role,
    },
    {
      label: "Account",
      path: "/account",
      show: user?.role,
    },
  ];
  return (
    <div className="ml-5 mr-5 p-4">
      <header className="flex h-16 w-full shrink-0 justify-between items-center">
        <Link className="font-bold text-4xl lg:flex mr-6" href={"/"}>
          HIREHUB
        </Link>
        <HeaderSheet menuItems={menuItems} user={user}/>
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
          {(user) ? <UserInfoButton /> : null}

        </nav>
        {/* {(user) ? <SignOutButton /> : null}
        <ClientStatusBtn />
        <UserServerStatus /> */}
      </header>
      <div>
      </div>
    </div>
  );
}



export default Header;
