"use client";

import { CandidateJobCard } from "./candidate-job-card";
import { PostNewJob } from "./post-new-job";
import { RecruiterJobCard } from "./recruiter-job-card";
import { JobFilter } from "./job-filter";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSearchParams, useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 9;

export const JobsListing = ({ user, allJobs, jobApplications }: { user: any; allJobs: any[]; jobApplications: any[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyFilter = searchParams.get("company");

  const [jobList, setJobList] = useState(allJobs || []);
  const [searchQuery, setSearchQuery] = useState(companyFilter ?? "");
  const [currentPage, setCurrentPage] = useState(1);

  // Seed the search box with it so the filter is applied immediately.
  useEffect(() => {
    if (companyFilter) setSearchQuery(companyFilter);
  }, [companyFilter]);

  // Sync jobList when allJobs prop updates from server revalidations
  useEffect(() => {
    setJobList(allJobs || []);
  }, [allJobs]);

  // Reset page to 1 when search query or filter list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, jobList]);

  const filteredBySearch = searchQuery.trim() === ""
    ? jobList
    : jobList.filter((job) => {
        const q = searchQuery.toLowerCase();
        return (
          job.title?.toLowerCase().includes(q) ||
          job.description?.toLowerCase().includes(q) ||
          job.skills?.toLowerCase().includes(q) ||
          job.companyName?.toLowerCase().includes(q)
        );
      });

  const totalPages = Math.ceil(filteredBySearch.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = filteredBySearch.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-800 pt-6 pb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl dark:text-white font-bold tracking-tight text-gray-900">
          {user?.role === "Candidate" ? "Explore All Jobs" : "Jobs Dashboard"}
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              type="search"
              placeholder="Search jobs…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-48 lg:w-64"
            />
          </div>
          {user?.role === "Candidate"
            ? <JobFilter allJobs={allJobs} jobList={jobList} setJobList={setJobList} />
            : <PostNewJob user={user} jobList={jobList} />}
        </div>
      </div>

      {/* Mobile search */}
      <div className="relative sm:hidden mt-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <Input
          type="search"
          placeholder="Search jobs…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full"
        />
      </div>

      {/* Active company filter pill */}
      {companyFilter && searchQuery === companyFilter && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing jobs at
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-200">
            {companyFilter}
            <button
              onClick={() => {
                setSearchQuery("");
                router.replace("/jobs");
              }}
              className="ml-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold"
              aria-label="Clear company filter"
            >
              ×
            </button>
          </span>
        </div>
      )}

      <div className="mt-8 pb-16">
        {filteredBySearch.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
              <span>
                Showing <strong className="font-semibold text-gray-800 dark:text-gray-200">{startIndex + 1}</strong>–
                <strong className="font-semibold text-gray-800 dark:text-gray-200">{Math.min(startIndex + ITEMS_PER_PAGE, filteredBySearch.length)}</strong> of{" "}
                <strong className="font-semibold text-gray-800 dark:text-gray-200">{filteredBySearch.length}</strong> jobs
              </span>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {paginatedJobs.map((jobItem) =>
                user?.role === "Candidate" ? (
                  <CandidateJobCard
                    key={jobItem?.id}
                    jobItem={jobItem}
                    user={user}
                    jobApplications={jobApplications}
                  />
                ) : (
                  <RecruiterJobCard
                    key={jobItem?.id}
                    jobItem={jobItem}
                    jobApplications={jobApplications}
                  />
                )
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-8">
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
          </div>
        ) : searchQuery.trim() !== "" ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No results for &ldquo;{searchQuery}&rdquo;</AlertTitle>
            <AlertDescription>
              Try a different keyword or clear the search.
            </AlertDescription>
            <Button className="mt-4" variant="outline" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          </Alert>
        ) : user?.role === "Candidate" ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No jobs posted yet</AlertTitle>
            <AlertDescription>
              Recruiters haven&apos;t posted any jobs yet. Check back soon.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No jobs posted yet</AlertTitle>
            <AlertDescription>
              You haven&apos;t posted any jobs. Click &ldquo;Post A Job&rdquo; to get started.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
