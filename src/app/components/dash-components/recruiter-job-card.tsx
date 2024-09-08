"use client"

import { useState } from "react";
import { CommonCard } from "../common/common-card";
import { Button } from "../ui/button";
import { JobIcon } from "./job-icon";
import { JobApplicants } from "./job-applicants";



export const RecruiterJobCard = ({ jobItem, jobApplications }) => {
  const [showApplicantsDrawer, setShowApplicantsDrawer] = useState(false);
  const [currentCandidateDetails, setCurrentCandidateDetails] = useState(null);
  const [
    showCurrentCandidateDetailsModal,
    setShowCurrentCandidateDetailsModal,
  ] = useState(false);
  // console.log("recruiterJobCard jobApplications ", jobApplications)
  // console.log("recruiterJobCard jobItem", jobItem)
  return (
    <div>
      <CommonCard
        icon={<JobIcon />}
        title={jobItem?.title}
        footerContent={
          <Button className="flex h-11 items-center justify-center px-5"
            onClick={() => { setShowApplicantsDrawer(true) }}
          >
            {
              jobApplications.filter((item) => item?.jobId === jobItem?.id).length > 1 ? `${jobApplications.filter((item) => item?.jobId === jobItem?.id).length} Applicants` :
                `${jobApplications.filter((item) => item?.jobId === jobItem?.id).length} Applicant`

            }
          </Button>
        }
        description={""}
      />
      <JobApplicants
        showApplicantsDrawer={showApplicantsDrawer}
        setShowApplicantsDrawer={setShowApplicantsDrawer}
        showCurrentCandidateDetailsModal={showCurrentCandidateDetailsModal}
        setShowCurrentCandidateDetailsModal={
          setShowCurrentCandidateDetailsModal
        }
        currentCandidateDetails={currentCandidateDetails}
        setCurrentCandidateDetails={setCurrentCandidateDetails}
        jobItem={jobItem}
        jobApplications={jobApplications.filter(
          (jobApplicationsItem) => jobApplicationsItem?.jobId === jobItem?.id
        )}
      />
    </div>)
};
