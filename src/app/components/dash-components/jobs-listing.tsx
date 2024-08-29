"use client";

import { PostNewJob } from "./post-new-job";
import { RecruiterJobCard } from "./recruiter-job-card";

export const JobsListing = ({ user, jobList }) => {
  // console.log("JobListing ", user)
  return (<div>
    <div className="mx-auto max-w-7xl ml-5 mr-5">
      <div className="flex items-baseline dark:border-white justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-4xl dark:text-white font-bold tracking-tight text-gray-900">
          {user?.role === "candidate"
            ? "Explore All Jobs"
            : "Jobs Dashboard"}
        </h1>
        <div className="flex items-center">
          {user?.role === "candidate" 
          ? <p>Filter</p> 
          : (<PostNewJob user={user} jobList />)}
        </div>
      </div>
      <div>
      <div className="pt-6 pb-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
            <div className="lg:col-span-4">
              <div className="container mx-auto p-0 space-y-8">
                <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                  {jobList && jobList.length > 0
                    ? jobList.map((jobItem) =>
                        user?.role === "candidate" ? (
                          // <CandidateJobCard
                          //   profileInfo={profileInfo}
                          //   jobItem={jobItem}
                          //   jobApplications={jobApplications}
                          // />
                          <div key={jobItem.id}>candidate job card</div>
                        ) : (
                          <div key={jobItem?.id}>
                            <RecruiterJobCard
                            // profileInfo={user?.role}
                            jobItem={jobItem}
                            // jobApplications={jobApplications}
                          />
                          </div>
                        )
                      )
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}