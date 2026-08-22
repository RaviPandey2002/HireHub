"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { useState } from "react";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { JobIcon } from "./job-icon";

import CreateJobApplicationAction from "actions/createJobApplicationAction";
import { CommonCard } from "../common/common-card";
import { useToast } from "../ui/use-toast";

export const CandidateJobCard = ({ jobItem, user, jobApplications }) => {
  const [showJobDetailsDrawer, setShowJobDetailsDrawer] = useState(false);
  const { toast } = useToast();

  async function handlejobApply() {
    if (!user?.isPremiumUser && jobApplications.length >= 2) {
      toast({
        variant: "destructive",
        title: "Application limit reached",
        description: "Free accounts can apply to 2 jobs. Upgrade your membership to apply to more.",
      });
      return;
    }

    await CreateJobApplicationAction(
      {
        recruiterId: jobItem.recruiterId,
        name: user?.name,
        email: user?.email,
        candidateId: user?.id,
        status: ["Applied"],
        jobId: jobItem?.id,
        jobApplicationDate: new Date(),
      },
      "/jobs"
    );
    setShowJobDetailsDrawer(false);
  }
  // console.log("jobListing jobList", jobItem)

  const alreadyApplied = jobApplications?.findIndex(
    (item) => item.jobId === jobItem?.id
  ) > -1;

  return (
    <>
      <Drawer open={showJobDetailsDrawer} onOpenChange={setShowJobDetailsDrawer}>
        <CommonCard
          icon={<JobIcon />}
          title={jobItem?.title}
          description={jobItem?.companyName}
          footerContent={
            <Button
              onClick={() => setShowJobDetailsDrawer(true)}
              className="w-full"
            >
              View Details
            </Button>
          }
        />
        <DrawerContent className="p-6">
          <DrawerHeader className="px-0">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <DrawerTitle className="text-3xl dark:text-white font-extrabold text-gray-800">
                {jobItem?.title}
              </DrawerTitle>
              <div className="flex gap-2">
                <Button
                  onClick={handlejobApply}
                  disabled={alreadyApplied}
                >
                  {alreadyApplied ? "Applied" : "Apply"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowJobDetailsDrawer(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DrawerHeader>
          <DrawerDescription className="text-base dark:text-white text-gray-600 mt-1">
            {jobItem?.description}
          </DrawerDescription>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Badge variant="secondary">{jobItem?.location}</Badge>
            <Badge variant="outline">{jobItem?.type} Time</Badge>
            <Badge variant="outline">{jobItem?.experience} yr exp</Badge>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {jobItem?.skills.split(",").map((skillItem, index) => (
              <Badge key={index} variant="secondary">
                {skillItem.trim()}
              </Badge>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
