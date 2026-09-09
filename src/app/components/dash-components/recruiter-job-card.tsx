"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Building2,
  MapPin,
  Briefcase,
  Sparkles,
  Users,
  Trash2,
  Loader2,
  UserCheck,
} from "lucide-react";
import { JobApplicants } from "./job-applicants";
import { deleteJobAction } from "actions/deleteJobAction";
import { useToast } from "../ui/use-toast";

interface JobItem {
  id: string;
  title: string;
  companyName: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  skills: string;
  recruiterId: string;
}

interface ApplicationItem {
  id?: string;
  jobId: string;
  status: string[];
}

interface RecruiterJobCardProps {
  jobItem: JobItem;
  jobApplications: ApplicationItem[];
}

export const RecruiterJobCard = ({ jobItem, jobApplications }: RecruiterJobCardProps) => {
  const [showApplicantsDrawer, setShowApplicantsDrawer] = useState(false);
  const [currentCandidateDetails, setCurrentCandidateDetails] = useState<unknown>(null);
  const [showCurrentCandidateDetailsModal, setShowCurrentCandidateDetailsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      const result = await deleteJobAction(jobItem?.id, "/jobs");
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Failed to delete job",
          description: result.error,
        });
      } else {
        toast({
          title: "Job Posting Deleted",
          description: `"${jobItem.title}" and its associated applications have been removed.`,
        });
        setShowDeleteDialog(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete job.";
      toast({
        variant: "destructive",
        title: "Error deleting job",
        description: msg,
      });
    } finally {
      setDeleting(false);
    }
  }

  const matchingApplications = (jobApplications || []).filter(
    (item) => item?.jobId === jobItem?.id
  );
  const applicantCount = matchingApplications.length;

  const companyMonogram = (jobItem?.companyName || "C")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const skillsList = (jobItem?.skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const displaySkills = skillsList.slice(0, 3);
  const remainingSkillsCount = skillsList.length - displaySkills.length;

  return (
    <>
      <Card className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-md hover:border-slate-400/40 dark:hover:border-slate-600/40 transition-all duration-200">
        <CardHeader className="p-5 pb-3">
          {/* Top Row: Company avatar + Name + Applicants Count Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-bold text-sm shadow-sm">
                {companyMonogram}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{jobItem?.companyName || "Company"}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                  {jobItem?.title}
                </h3>
              </div>
            </div>

            <Badge
              variant={applicantCount > 0 ? "default" : "secondary"}
              className={`shrink-0 font-semibold text-[11px] gap-1 px-2.5 py-0.5 ${
                applicantCount > 0
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Users className="h-3 w-3" />
              {applicantCount === 1 ? "1 Applicant" : `${applicantCount} Applicants`}
            </Badge>
          </div>

          {/* Metadata Row: Location, Experience */}
          <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-slate-500 dark:text-slate-400">
            {jobItem?.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {jobItem.location}
              </span>
            )}
            <span className="text-slate-300 dark:text-slate-700">•</span>
            {jobItem?.type && (
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                {jobItem.type}
              </span>
            )}
            <span className="text-slate-300 dark:text-slate-700">•</span>
            {jobItem?.experience && (
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-slate-400" />
                {jobItem.experience} yr exp
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 space-y-3">
          {/* 2-line Description Preview */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {jobItem?.description || "No description provided."}
          </p>

          {/* Skills Chips */}
          {skillsList.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {displaySkills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
              {remainingSkillsCount > 0 && (
                <span className="rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                  +{remainingSkillsCount} more
                </span>
              )}
            </div>
          )}
        </CardContent>

        {/* Card Footer Actions */}
        <CardFooter className="p-4 pt-3 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
          <Button
            size="sm"
            onClick={() => setShowApplicantsDrawer(true)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs gap-1.5 shadow-sm"
          >
            <UserCheck className="h-3.5 w-3.5" />
            Review Candidates ({applicantCount})
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-slate-200 dark:border-slate-800"
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleting}
            title="Delete job posting"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteDialog}
        onOpenChange={(open) => !open && !deleting && setShowDeleteDialog(false)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Delete Job Posting?
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 pt-2">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                &ldquo;{jobItem?.title}&rdquo;
              </span>
              ?
              <br />
              <br />
              This will permanently delete this job listing along with{" "}
              <span className="font-semibold text-rose-600">
                all {applicantCount} applicant submissions
              </span>
              . This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Job"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Applicants Review Drawer */}
      <JobApplicants
        showApplicantsDrawer={showApplicantsDrawer}
        setShowApplicantsDrawer={setShowApplicantsDrawer}
        showCurrentCandidateDetailsModal={showCurrentCandidateDetailsModal}
        setShowCurrentCandidateDetailsModal={setShowCurrentCandidateDetailsModal}
        currentCandidateDetails={currentCandidateDetails}
        setCurrentCandidateDetails={setCurrentCandidateDetails}
        jobItem={jobItem}
        jobApplications={matchingApplications}
      />
    </>
  );
};
