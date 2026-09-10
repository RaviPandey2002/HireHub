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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Building2,
  MapPin,
  Briefcase,
  Sparkles,
  Users,
  Trash2,
  Loader2,
  UserCheck,
  Pencil,
  Power,
  CheckCircle2,
  PauseCircle,
} from "lucide-react";
import { JobApplicants } from "./job-applicants";
import { deleteJobAction } from "actions/deleteJobAction";
import { editJobAction } from "actions/editJobAction";
import { toggleJobStatusAction } from "actions/toggleJobStatusAction";
import { useToast } from "../ui/use-toast";
import { JobOpening, JobApplication, AppUser } from "types";

interface RecruiterJobCardProps {
  jobItem: JobOpening;
  jobApplications: JobApplication[];
}

export const RecruiterJobCard = ({ jobItem, jobApplications }: RecruiterJobCardProps) => {
  const [showApplicantsDrawer, setShowApplicantsDrawer] = useState(false);
  const [currentCandidateDetails, setCurrentCandidateDetails] = useState<AppUser | null>(null);
  const [showCurrentCandidateDetailsModal, setShowCurrentCandidateDetailsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [jobStatus, setJobStatus] = useState<string>(jobItem.status || "Active");

  const [editFormData, setEditFormData] = useState({
    id: jobItem.id,
    title: jobItem.title || "",
    companyName: jobItem.companyName || "",
    location: jobItem.location || "",
    type: jobItem.type || "",
    experience: jobItem.experience || "",
    description: jobItem.description || "",
    skills: jobItem.skills || "",
  });

  const { toast } = useToast();

  const isClosed = jobStatus === "Closed";

  async function handleToggleStatus() {
    setIsTogglingStatus(true);
    const nextStatus = isClosed ? "Active" : "Closed";
    try {
      const res = await toggleJobStatusAction({
        jobId: jobItem.id,
        status: nextStatus,
      });

      if (res?.error) {
        toast({
          variant: "destructive",
          title: "Failed to update status",
          description: res.error,
        });
      } else {
        setJobStatus(nextStatus);
        toast({
          title: nextStatus === "Active" ? "Opening Reactivated" : "Opening Closed",
          description:
            nextStatus === "Active"
              ? "Candidates can now view and apply for this opening."
              : "Hiring paused. Candidates will no longer be able to submit new applications.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Status update failed",
        description: "Please try again later.",
      });
    } finally {
      setIsTogglingStatus(false);
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    setIsEditing(true);

    try {
      const result = await editJobAction(editFormData);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Failed to update job",
          description: result.error,
        });
      } else {
        toast({
          title: "Job Updated Successfully",
          description: `"${editFormData.title}" has been saved with the latest details.`,
        });
        setShowEditDialog(false);
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error saving job",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsEditing(false);
    }
  }

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
      <Card
        className={`group flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
          isClosed
            ? "border-slate-200/50 dark:border-slate-800/50 bg-slate-50/40 dark:bg-slate-950/40 opacity-85"
            : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-400/40 dark:hover:border-slate-600/40"
        }`}
      >
        <CardHeader className="p-5 pb-3">
          {/* Top Row: Company avatar + Name + Applicants Count Badge + Status Badge */}
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

            <div className="flex items-center gap-1.5 shrink-0">
              <Badge
                variant="outline"
                className={`text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 ${
                  isClosed
                    ? "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                }`}
              >
                {isClosed ? "Closed" : "Active"}
              </Badge>

              <Badge
                variant={applicantCount > 0 ? "default" : "secondary"}
                className={`font-semibold text-[11px] gap-1 px-2.5 py-0.5 ${
                  applicantCount > 0
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <Users className="h-3 w-3" />
                {applicantCount === 1 ? "1" : applicantCount}
              </Badge>
            </div>
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
        <CardFooter className="p-4 pt-3 flex items-center justify-between gap-1.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
          <Button
            size="sm"
            onClick={() => setShowApplicantsDrawer(true)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs gap-1.5 shadow-sm"
          >
            <UserCheck className="h-3.5 w-3.5" />
            Review Candidates ({applicantCount})
          </Button>

          {/* Toggle Active/Closed */}
          <Button
            variant="outline"
            size="icon"
            className={`h-8 w-8 shrink-0 border-slate-200 dark:border-slate-800 ${
              isClosed
                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                : "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            }`}
            onClick={handleToggleStatus}
            disabled={isTogglingStatus}
            title={isClosed ? "Reactivate Opening" : "Pause / Close Hiring"}
          >
            {isTogglingStatus ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isClosed ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <PauseCircle className="h-3.5 w-3.5" />
            )}
          </Button>

          {/* Edit Job */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800"
            onClick={() => setShowEditDialog(true)}
            title="Edit job opening details"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>

          {/* Delete Job */}
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

      {/* Edit Job Modal Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Job Opening</DialogTitle>
            <DialogDescription>
              Update the position title, requirements, or tech stack. Existing applicant submissions will be preserved.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-title">Job Title</Label>
              <Input
                id="edit-title"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-company">Company Name</Label>
                <Input
                  id="edit-company"
                  value={editFormData.companyName}
                  onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-type">Employment Type</Label>
                <Input
                  id="edit-type"
                  placeholder="e.g. Full Time, Contract"
                  value={editFormData.type}
                  onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-exp">Experience</Label>
                <Input
                  id="edit-exp"
                  placeholder="e.g. 3-5 years"
                  value={editFormData.experience}
                  onChange={(e) => setEditFormData({ ...editFormData, experience: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-skills">Required Skills (comma-separated)</Label>
              <Input
                id="edit-skills"
                placeholder="React, TypeScript, Node.js"
                value={editFormData.skills}
                onChange={(e) => setEditFormData({ ...editFormData, skills: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-desc">Job Description & Responsibilities</Label>
              <Textarea
                id="edit-desc"
                rows={4}
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                required
              />
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={isEditing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isEditing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                {isEditing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
