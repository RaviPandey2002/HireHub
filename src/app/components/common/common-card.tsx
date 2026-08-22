import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const CommonCard = ({ title, icon, description, footerContent }) => {
    return (
        <Card className="flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-200 dark:hover:shadow-gray-900 cursor-pointer">
            <CardHeader className="p-0">
                {icon ? icon : null}
                {title ? (
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {title}
                    </CardTitle>
                ) : null}
                {description ? (
                    <CardDescription className="mt-1 text-gray-500 dark:text-gray-400">
                        {description}
                    </CardDescription>
                ) : null}
            </CardHeader>
            <CardFooter className="p-0">{footerContent}</CardFooter>
        </Card>
    );
}
