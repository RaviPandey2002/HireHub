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

  return (
    <div>
      <CommonCard
        icon={<JobIcon />}
        title={jobItem?.title}
        footerContent={
          <Button className="flex h-11 items-center justify-center px-5">
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
        jobItem={jobApplications.filter(
          (jobApplicationsItem) => jobApplicationsItem?.id === jobItem?.id
        )}
        jobApplications={jobApplications}
      />
    </div>)
};
