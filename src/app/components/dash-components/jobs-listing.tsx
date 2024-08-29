"use client";

import { PostNewJob } from "./post-new-job";

export const JobsListing = ({ user }) => {
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
          {user?.role === "candidate" ? <p>Filter</p> : (<PostNewJob user={user} jobList />)}
        </div>
      </div>
      <div>Jobs</div>
    </div>
  </div>
  )
}