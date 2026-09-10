"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { CandidateList } from "./candidate-list";
import { AppUser, JobApplication, JobOpening } from "types";

interface JobApplicantsProps {
  showApplicantsDrawer: boolean;
  setShowApplicantsDrawer: (open: boolean) => void;
  showCurrentCandidateDetailsModal: boolean;
  setShowCurrentCandidateDetailsModal: (open: boolean) => void;
  currentCandidateDetails: unknown;
  setCurrentCandidateDetails: (details: unknown) => void;
  jobItem: { id: string; title: string; companyName?: string };
  jobApplications: unknown[];
  currentCandidateDetails: AppUser | null;
  setCurrentCandidateDetails: (details: AppUser | null) => void;
  jobItem: JobOpening | { id: string; title: string; companyName?: string };
  jobApplications: JobApplication[];
}

export const JobApplicants = ({
  showApplicantsDrawer,
  setShowApplicantsDrawer,
  showCurrentCandidateDetailsModal,
  setShowCurrentCandidateDetailsModal,
  currentCandidateDetails,
  setCurrentCandidateDetails,
  jobItem,
  jobApplications,
}: JobApplicantsProps) => {
  return (
    <Dialog open={showApplicantsDrawer} onOpenChange={setShowApplicantsDrawer}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] p-6 flex flex-col">
        <DialogHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Applicants for &ldquo;{jobItem?.title}&rdquo;
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Review and manage candidates who submitted applications for this role ({jobApplications?.length || 0} total).
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto mt-2 pr-1">
          <CandidateList
            currentCandidateDetails={currentCandidateDetails}
            setCurrentCandidateDetails={setCurrentCandidateDetails}
            jobApplications={jobApplications}
            showCurrentCandidateDetailsModal={showCurrentCandidateDetailsModal}
            setShowCurrentCandidateDetailsModal={setShowCurrentCandidateDetailsModal}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

