"use client";

import { AlertCircle } from "lucide-react";
import { CommonCard } from "../common/common-card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { JobIcon } from "./job-icon";
import { Button } from "../ui/button";
import Link from "next/link";

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

    return (
        <div className="mx-auto max-w-7xl">
            <div className="border-b dark:border-gray-700 pb-6 pt-10">
                <h1 className="text-4xl font-bold dark:text-white tracking-tight text-gray-950">
                    Your Activity
                </h1>
            </div>

            {!jobApplicants.length ? (
                <div className="pt-10">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No applications yet</AlertTitle>
                        <AlertDescription>
                            You haven&apos;t applied to any jobs. Start exploring opportunities and apply to some jobs to see them here.
                        </AlertDescription>
                        <Link href="/jobs">
                            <Button className="mt-4" variant="outline">
                                Explore Jobs
                            </Button>
                        </Link>
                    </Alert>
                </div>
            ) : (
                <Tabs defaultValue={uniqueStatusArray[0]} className="w-full mt-6">
                    <TabsList className="flex-wrap h-auto gap-1">
                        {uniqueStatusArray.map((val) => (
                            <TabsTrigger key={val} value={val}>
                                {val}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="pb-24 pt-6">
                        {uniqueStatusArray.map((status) => (
                            <TabsContent key={status} value={status}>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {jobsByStatus[status].map((finalFilteredItem) => (
                                        <CommonCard
                                            key={finalFilteredItem.id}
                                            icon={<JobIcon />}
                                            title={finalFilteredItem.title}
                                            description={finalFilteredItem.companyName}
                                            footerContent={undefined}
                                        />
                                    ))}
                                </div>
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            )}
        </div>
    );
    };
