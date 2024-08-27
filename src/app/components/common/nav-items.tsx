import { getUser } from "actions/getUser";
import Link from "next/link";


export const NavItems = async () => {
    const currentUser = await getUser();
    console.log("nav, user", currentUser);
    const menuItems = [
        {
            label: "Home",
            path: "/",
            show: "true",
        },
        {
            label: "Login",
            path: "/login",
            show: !currentUser,
        },
        {
            label: "Register",
            path: "/register",
            show: !currentUser,
        },
    ];

    return (
        <nav className=" ml-auto hidden lg:flex gap-6 items-center">
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
        </nav>
    )
}

