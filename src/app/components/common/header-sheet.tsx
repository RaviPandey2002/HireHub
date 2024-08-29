import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "../ui/sheet";
export const HeaderSheet = ({ menuItems }) => {
    
    return (
        <>
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
        </>
    )
}