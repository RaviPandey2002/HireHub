"use client";

export const JobsListing = ({ user}) => {
  return (<div>
    <div className="mx-auto max-w-7xl">
      <div className="flex items-baseline dark:border-white justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-4xl dark:text-white font-bold tracking-tight text-gray-900">
          {user?.role === "candidate"
            ? "Explore All Jobs"
            : "Jobs Dashboard"}
        </h1>
            


      </div>
    </div>
  </div>
  )
}