"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Building2,
  MapPin,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Eye,
  Loader2,
  AlertCircle,
  Bookmark,
} from "lucide-react";
import CreateJobApplicationAction from "actions/createJobApplicationAction";
import { toggleSaveJobAction } from "actions/toggleSaveJobAction";
import { useToast } from "../ui/use-toast";
import { LinkedInJobDescription } from "./linkedin-job-description";
import { JobOpening, AppUser, JobApplication } from "types";

interface CandidateJobCardProps {
  jobItem: JobOpening;
  user: AppUser | null;
  jobApplications: JobApplication[];
  isBookmarked?: boolean;
  onBookmarkChange?: (jobId: string, isSaved: boolean) => void;
}

export const CandidateJobCard = ({
  jobItem,
  user,
  jobApplications,
  isBookmarked,
  onBookmarkChange,
}: CandidateJobCardProps) => {
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasAppliedLocally, setHasAppliedLocally] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const initialSaved = isBookmarked !== undefined
    ? isBookmarked
    : Array.isArray(user?.candidateInfo?.savedJobs)
    ? user?.candidateInfo?.savedJobs.includes(jobItem.id)
    : false;
  const [isSaved, setIsSaved] = useState(initialSaved);

  useEffect(() => {
    if (isBookmarked !== undefined) {
      setIsSaved(isBookmarked);
    }
  }, [isBookmarked]);

  const { toast } = useToast();

  const isAppliedFromProps =
    (jobApplications || []).findIndex((item) => item.jobId === jobItem?.id) > -1;
  const alreadyApplied = isAppliedFromProps || hasAppliedLocally;
  const isClosed = jobItem.status === "Closed";

  const isFreeQuotaExceeded =
    !user?.isPremiumUser && (jobApplications || []).length >= 2 && !alreadyApplied;

  async function handleToggleSave() {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in as a candidate to bookmark jobs.",
      });
      return;
    }

    const nextState = !isSaved;
    setIsSaved(nextState);
    setIsBookmarking(true);

    try {
      const res = await toggleSaveJobAction(jobItem.id);
      if (res?.error) {
        setIsSaved(!nextState); // rollback
        toast({
          variant: "destructive",
          title: "Failed to update bookmark",
          description: res.error,
        });
      } else {
        toast({
          title: nextState ? "Job Saved 🔖" : "Job Removed from Saved",
          description: nextState
            ? `"${jobItem.title}" was added to your bookmarked positions.`
            : `"${jobItem.title}" was removed from your bookmarks.`,
        });
        if (onBookmarkChange) {
          onBookmarkChange(jobItem.id, nextState);
        }
      }
    } catch {
      setIsSaved(!nextState);
    } finally {
      setIsBookmarking(false);
    }
  }

  async function handlejobApply() {
    if (alreadyApplied) return;

    if (isClosed) {
      toast({
        variant: "destructive",
        title: "Position Closed",
        description: "This company is no longer accepting new applications for this role.",
      });
      return;
    }

    if (!user?.isPremiumUser && (jobApplications || []).length >= 2) {
      toast({
        variant: "destructive",
        title: "Application limit reached",
        description:
          "Free accounts can apply to max 2 jobs. Please upgrade your membership to apply to more.",
      });
      return;
    }

    setIsApplying(true);
    try {
      const result = await CreateJobApplicationAction(
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

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Failed to apply",
          description: result.error,
        });
      } else {
        setHasAppliedLocally(true);
        toast({
          title: "Application submitted successfully! 🎉",
          description: `Your application for ${jobItem.title} at ${jobItem.companyName} has been received.`,
        });
        setShowJobDetailsModal(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast({
        variant: "destructive",
        title: "Error submitting application",
        description: msg,
      });
    } finally {
      setIsApplying(false);
    }
  }

  // Generate 1-2 letter monogram for company avatar
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
            ? "border-slate-200/60 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/40 opacity-85"
            : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-emerald-500/40 dark:hover:border-emerald-500/40"
        }`}
      >
        <CardHeader className="p-5 pb-3">
          {/* Top Row: Company avatar + Name + Status Badge + Bookmark */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-sm shadow-sm">
                {companyMonogram}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{jobItem?.companyName || "Hiring Company"}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {jobItem?.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Bookmark button */}
              {user?.role === "Candidate" && (
                <button
                  onClick={handleToggleSave}
                  disabled={isBookmarking}
                  title={isSaved ? "Remove bookmark" : "Save this job"}
                  className={`p-1.5 rounded-lg border transition-all ${
                    isSaved
                      ? "bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400"
                      : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-amber-500 text-amber-500" : ""}`} />
                </button>
              )}

              {alreadyApplied ? (
                <Badge className="shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-semibold text-[11px] gap-1 px-2 py-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                  Applied
                </Badge>
              ) : isClosed ? (
                <Badge
                  variant="outline"
                  className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                >
                  Closed
                </Badge>
              ) : (
                <Badge variant="outline" className="shrink-0 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  {jobItem?.type || "Full-time"}
                </Badge>
              )}
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
            {jobItem?.description || "No description provided for this role."}
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
            variant="ghost"
            size="sm"
            onClick={() => setShowJobDetailsModal(true)}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" />
            View Details
          </Button>

          {alreadyApplied ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 gap-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Applied
            </Button>
          ) : isClosed ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="text-xs font-semibold text-slate-400 border-slate-200 dark:border-slate-800"
            >
              Hiring Closed
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handlejobApply}
              disabled={isApplying}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1 shadow-sm"
            >
              {isApplying ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Applying...
                </>
              ) : (
                "Quick Apply"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Centered Job Details Modal Dialog */}
      <Dialog open={showJobDetailsModal} onOpenChange={setShowJobDetailsModal}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-6">
          <DialogHeader className="pr-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-extrabold text-base shadow-sm">
                {companyMonogram}
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {jobItem?.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span>{jobItem?.companyName}</span>
                </div>
              </div>
            </div>
            <DialogDescription className="sr-only">
              Job opening overview and application details for {jobItem?.title} at {jobItem?.companyName}
            </DialogDescription>

            {/* Badges in modal */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2">
              {isClosed ? (
                <Badge variant="outline" className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700">
                  Hiring Closed
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  {jobItem?.location}
                </Badge>
              )}
              {jobItem?.type && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <Briefcase className="h-3 w-3" />
                  {jobItem.type}
                </Badge>
              )}
              {jobItem?.experience && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <Sparkles className="h-3 w-3" />
                  {jobItem.experience} yr exp
                </Badge>
              )}
            </div>
          </DialogHeader>

          {/* Freemium Banner inside Modal */}
          {isFreeQuotaExceeded && (
            <Alert className="mt-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs text-amber-800 dark:text-amber-300">
                You have reached your 2-application limit on the free tier.{" "}
                <Link href="/membership" className="font-bold underline">
                  Upgrade your membership
                </Link>{" "}
                to unlock unlimited applications.
              </AlertDescription>
            </Alert>
          )}

          {/* LinkedIn Style Job Description */}
          <div className="mt-5">
            <LinkedInJobDescription
              description={jobItem?.description}
              skills={jobItem?.skills}
              type={jobItem?.type}
              location={jobItem?.location}
              experience={jobItem?.experience}
              companyName={jobItem?.companyName}
            />
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowJobDetailsModal(false)}
            >
              Close
            </Button>

            <div className="flex items-center gap-2">
              {alreadyApplied ? (
                <Button disabled variant="outline" className="text-emerald-700 border-emerald-300 gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Already Applied
                </Button>
              ) : isClosed ? (
                <Button disabled variant="outline" className="text-slate-400">
                  Hiring Closed
                </Button>
              ) : (
                <Button
                  onClick={handlejobApply}
                  disabled={isApplying}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
