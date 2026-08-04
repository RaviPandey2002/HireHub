"use client"

import { useState } from "react";
import { CommonCard } from "../common/common-card";
import { Button } from "../ui/button";
import { JobIcon } from "./job-icon";
import { JobApplicants } from "./job-applicants";
import { deleteJobAction } from "actions/deleteJobAction";
import { useToast } from "../ui/use-toast";
import { Trash2 } from "lucide-react";

export const RecruiterJobCard = ({ jobItem, jobApplications }) => {
  const [showApplicantsDrawer, setShowApplicantsDrawer] = useState(false);
  const [currentCandidateDetails, setCurrentCandidateDetails] = useState(null);
  const [showCurrentCandidateDetailsModal, setShowCurrentCandidateDetailsModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    if (!confirm(`Delete "${jobItem?.title}"? This will also remove all applications for this job.`)) return;
    setDeleting(true);
    const result = await deleteJobAction(jobItem?.id, "/jobs");
    if (result?.error) {
      toast({ variant: "destructive", title: "Failed to delete job", description: result.error });
      setDeleting(false);
    }
  }

  const applicantCount = jobApplications.filter((item) => item?.jobId === jobItem?.id).length;

  return (
    <div>
      <CommonCard
        icon={<JobIcon />}
        title={jobItem?.title}
        footerContent={
          <div className="flex gap-2 w-full">
            <Button
              className="flex h-11 flex-1 items-center justify-center px-5"
              onClick={() => setShowApplicantsDrawer(true)}
            >
              {applicantCount === 1 ? "1 Applicant" : `${applicantCount} Applicants`}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={handleDelete}
              disabled={deleting}
              title="Delete job"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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
