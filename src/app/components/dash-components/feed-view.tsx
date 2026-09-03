"use client";

import { useState } from "react";
import { AlertCircle, Briefcase, Building2, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface FeedJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  type: string;
  experience: string;
  skills: string;
}

interface FeedApplication {
  id: string;
  name: string;
  email: string;
  jobId: string;
  status: string[];
  jobApplicationDate: string;
}

interface FeedViewProps {
  user: { role: string; name?: string } | null;
  data: FeedJob[] | FeedApplication[];
}

const ITEMS_PER_PAGE = 8;

export const FeedView = ({ user, data }: FeedViewProps) => {
  const isRecruiter = user?.role === "Recruiter";
  const [currentPage, setCurrentPage] = useState(1);

  const items = data || [];
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-baseline dark:border-white justify-between border-b pb-6 pt-10 gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold dark:text-white tracking-tight text-gray-950">
          {isRecruiter ? "Applications Feed" : "Jobs Feed"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isRecruiter
            ? "Latest applications received for your job postings"
            : "Latest job opportunities posted by recruiters"}
        </p>
      </div>

      <div className="py-8 space-y-4">
        {!items || items.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{isRecruiter ? "No applications yet" : "No jobs posted yet"}</AlertTitle>
            <AlertDescription>
              {isRecruiter
                ? "Applications from candidates will appear here once they start applying to your jobs."
                : "Recruiters haven't posted any jobs yet. Check back soon."}
            </AlertDescription>
            <Link href="/jobs">
              <Button className="mt-4" variant="outline">
                {isRecruiter ? "View Your Jobs" : "Explore Jobs"}
              </Button>
            </Link>
          </Alert>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>
                Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, items.length)} of {items.length} {isRecruiter ? "applications" : "jobs"}
              </span>
            </div>

            {isRecruiter ? (
              (paginatedItems as FeedApplication[]).map((app) => (
                <div
                  key={app.id}
                  className="flex items-start justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-base">
                      {app.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{app.email}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {app.status.map((s) => (
                        <Badge key={s} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-4">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(app.jobApplicationDate).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              (paginatedItems as FeedJob[]).map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-base">
                        {job.title}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {job.companyName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          {job.type} · {job.experience} yr exp
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.split(",").map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Link href="/jobs" className="shrink-0">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className="h-8 w-8 p-0 text-xs font-medium"
                    >
                      {pageNumber}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="gap-1 text-xs"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
