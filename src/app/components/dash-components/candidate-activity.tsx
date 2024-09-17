"use client";

import { CommonCard } from "../common/common-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { JobIcon } from "./job-icon";

interface Job {
    id: string;
    title: string;
    companyName: string;
}

interface JobApplicant {
    status: string;
    jobId: string;
}

interface CandidateActivityProps {
    jobList: Job[];
    jobApplicants: JobApplicant[];
}

export const CandidateActivity = ({ jobList, jobApplicants }: CandidateActivityProps) => {
    // Generate unique status array
    const uniqueStatusArray = [
        ...new Set(
            jobApplicants.map((jobApplicantItem: { status: string }) => jobApplicantItem.status).flat(1)
        ),
    ];


    // Precompute jobs by status
    const jobsByStatus = uniqueStatusArray.reduce((acc, status) => {
        acc[status] = jobList.filter((jobItem) =>
            jobApplicants.some((jobApplication) =>
                jobApplication.status.includes(status) && jobItem.id === jobApplication.jobId
            )
        );
        return acc;
    }, {} as Record<string, Job[]>);
    

    console.log("jobsByStatus", jobsByStatus)
    console.log("jobList", jobList)
    console.log("jobApplicants", jobApplicants)

    return (
        <div className="mx-auto max-w-7xl">
            <Tabs defaultValue="Applied" className="w-full">
                <div className="flex items-baseline dark:border-white justify-between border-b pb-6 pt-24">
                    <h1 className="text-4xl font-bold dark:text-white tracking-tight text-gray-950">
                        Your Activity
                    </h1>
                    <TabsList>
                        {uniqueStatusArray.map((val) => (
                            <TabsTrigger key={val} value={val}>
                                {val}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                <div className="pb-24 pt-6">
                    <div className="container mx-auto p-0 space-y-8">
                        <div className="flex flex-col gap-4">
                            {uniqueStatusArray.map((status) => (
                                <TabsContent key={status} value={status}>
                                    {jobsByStatus[status].map((finalFilteredItem) => (
                                        <CommonCard
                                            key={finalFilteredItem.id}
                                            icon={<JobIcon />}
                                            title={finalFilteredItem.title}
                                            description={finalFilteredItem.companyName}
                                            footerContent={undefined}
                                        />
                                    ))}
                                </TabsContent>
                            ))}
                        </div>
                    </div>
                </div>
            </Tabs>
        </div>
    );
};
