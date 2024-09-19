"use client";

import { AlertCircle } from "lucide-react";
import { CommonCard } from "../common/common-card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { JobIcon } from "./job-icon";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
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

    // const getStatusBadge = (status) => {
    //     switch (status) {
    //         case "pending": return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
    //         case "interview": return <Badge variant="outline" className="bg-blue-100 text-blue-800">Interview</Badge>
    //         case "rejected": return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>
    //         case "accepted": return <Badge variant="outline" className="bg-green-100 text-green-800">Accepted</Badge>
    //         default: return null
    //     }

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
                {!jobApplicants.length
                    ? <Alert>
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
                    : null}
            </div>
        );
    };
