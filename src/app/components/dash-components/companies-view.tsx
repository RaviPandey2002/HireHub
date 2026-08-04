"use client";

import { Building2, MapPin } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface Company {
  companyName: string;
  location: string;
  jobCount: number;
}

interface CompaniesViewProps {
  companies: Company[];
}

export const CompaniesView = ({ companies }: CompaniesViewProps) => {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="flex items-baseline dark:border-white justify-between border-b pb-6 pt-10">
        <h1 className="text-4xl font-bold dark:text-white tracking-tight text-gray-950">
          Companies
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {companies.length} {companies.length === 1 ? "company" : "companies"} hiring
        </p>
      </div>

      <div className="py-8">
        {companies.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No companies yet</AlertTitle>
            <AlertDescription>
              No companies have posted jobs yet. Check back soon.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <div
                key={company.companyName}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 hover:bg-white dark:hover:bg-gray-800 transition-colors flex flex-col gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black dark:bg-white">
                    <Building2 className="h-5 w-5 text-white dark:text-black" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                      {company.companyName}
                    </p>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {company.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {company.jobCount} open {company.jobCount === 1 ? "role" : "roles"}
                  </Badge>
                  <Link
                    href={`/jobs?company=${encodeURIComponent(company.companyName)}`}
                  >
                    <Button size="sm" variant="outline">
                      View Jobs
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
