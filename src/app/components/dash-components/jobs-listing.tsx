"use client";

import { CandidateJobCard } from "./candidate-job-card";
import { PostNewJob } from "./post-new-job";
import { RecruiterJobCard } from "./recruiter-job-card";
import { JobFilter } from "./job-filter";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const JobsListing = ({ user, allJobs, jobApplications }) => {
  const [jobList, setJobList] = useState(allJobs);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center dark:border-white justify-between border-b border-gray-200 pt-6 pb-6">
        <h1 className="text-4xl dark:text-white font-bold tracking-tight text-gray-900">
          {user?.role === "Candidate"
            ? "Explore All Jobs"
            : "Jobs Dashboard"}
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
      {/* Mobile search — shown below header on small screens */}
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

      <div className="mt-10">
        {filteredBySearch.length > 0 ? (
          <div className="pt-6 pb-24">
            <div className="container mx-auto p-0">
              <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredBySearch.map((jobItem) =>
                  user?.role === "Candidate" ? (
                    <div key={jobItem?.id}>
                      <CandidateJobCard
                        jobItem={jobItem}
                        user={user}
                        jobApplications={jobApplications}
                      />
                    </div>
                  ) : (
                    <div key={jobItem?.id}>
                      <RecruiterJobCard
                        jobItem={jobItem}
                        jobApplications={jobApplications}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
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