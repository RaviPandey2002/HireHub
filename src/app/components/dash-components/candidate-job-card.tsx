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
import { JobIcon } from "./job-icon";

import CreateJobApplicationAction from "actions/createJobApplicationAction";
import { CommonCard } from "../common/common-card";
import { useToast } from "../ui/use-toast";

export const CandidateJobCard = ({ jobItem, user, jobApplications }) => {
  const [showJobDetailsDrawer, setShowJobDetailsDrawer] = useState(false);
  const { toast } = useToast();

  async function handlejobApply() {
    if (!user?.isPremiumUser && jobApplications.length >= 2) {
      setShowJobDetailsDrawer(false);
      toast({
        variant: "destructive",
        title: "You can apply max 2 jobs.",
        description: "Please opt for membership to apply for more jobs",
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
        jobApplicationDate: new Date("2024-08-31T00:00:00Z")
        ,
      },
      "/jobs"
    );
    setShowJobDetailsDrawer(false);
  }

  console.log(" candidate_card jobApplications",jobApplications);
  console.log(" candidate_card jobItem",jobItem);
  return (
    <>
      <Drawer
        open={showJobDetailsDrawer}
        onOpenChange={setShowJobDetailsDrawer}
      >
        <CommonCard
          icon={<JobIcon />}
          title={jobItem?.title}
          description={jobItem?.companyName}
          footerContent={
            <Button
              onClick={() => setShowJobDetailsDrawer(true)}
              className=" dark:bg-[#fffa27] flex h-11 items-center justify-center px-5"
            >
              View Details
            </Button>
          }
        />
        <DrawerContent className="p-6">
          <DrawerHeader className="px-0">
            <div className="flex justify-between">
              <DrawerTitle className="text-4xl dark:text-white font-extrabold text-gray-800">
                {jobItem?.title}
              </DrawerTitle>
              <div className="flex gap-3">
                <Button
                  onClick={handlejobApply}
                  disabled={jobApplications?.findIndex(
                    (item) => item.jobId === jobItem?.id
                  ) > -1
                    ? true
                    : false
                  }
                  className="disabled:opacity-65 flex h-11 items-center justify-center px-5"
                >
                  {jobApplications?.findIndex(
                    (item) => item?.jobId === jobItem?.id
                  ) > -1
                    ? "Applied"
                    : "Apply"}
                </Button>
                <Button
                  className=" flex h-11 items-center justify-center px-5"
                  onClick={() => setShowJobDetailsDrawer(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DrawerHeader>
          <DrawerDescription className="text-2xl dark:text-white  font-medium text-gray-600">
            {jobItem?.description}
            <span className="text-xl dark:text-white  ml-4 font-normal text-gray-500">
              {jobItem?.location}
            </span>
          </DrawerDescription>
          <div className="w-[150px] mt-6 flex justify-center dark:bg-white  items-center h-[40px] bg-black rounded-[4px]">
            <h2 className="text-xl font-bold dark:text-black  text-white">
              {jobItem?.type} Time
            </h2>
          </div>
          <h3 className="text-2xl font-medium text-black mt-3">
            Experience: {jobItem?.experience} year
          </h3>
          <div className="flex gap-4 mt-6">
            {jobItem?.skills.split(",").map((skillItem) => (
              <div
                key={jobItem?.id}
                className="w-[100px] flex justify-center items-center h-[35px] dark:bg-white  bg-black rounded-[4px]"
              >
                <h2 className="text-[13px] font-medium text-white dark:text-black ">
                  {skillItem}
                </h2>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer >
    </>
  );
};
