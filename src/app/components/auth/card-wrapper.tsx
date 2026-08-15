"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { OtherProviders } from "./other-providers";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader>
        <div className="flex flex-col items-center gap-y-2">
          <h1 className="text-3xl font-bold">HireHub</h1>
          <p className="text-sm text-muted-foreground">{headerLabel}</p>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <OtherProviders />
        </CardFooter>
      )}
      <CardFooter className="justify-center">
        <Link
          href={backButtonHref}
          className="text-sm text-muted-foreground hover:underline"
        >
          {backButtonLabel}
        </Link>
      </CardFooter>
    </Card>
  );
};
