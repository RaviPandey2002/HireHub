import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export const ErrorCard = () => {
  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader>
        <div className="flex flex-col items-center gap-y-2">
          <h1 className="text-3xl font-bold">HireHub</h1>
          <p className="text-sm text-destructive font-medium">
            Something went wrong. Please try again.
          </p>
        </div>
      </CardHeader>
      <CardFooter className="justify-center">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          Back to home
        </Link>
      </CardFooter>
    </Card>
  );
};
