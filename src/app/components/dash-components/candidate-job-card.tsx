"use client";

import { useState } from "react";
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
  ArrowUpRight,
  Eye,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import CreateJobApplicationAction from "actions/createJobApplicationAction";
import { useToast } from "../ui/use-toast";
import { LinkedInJobDescription } from "./linkedin-job-description";

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

interface User {
  id: string;
  name?: string;
  email?: string;
  role: string;
  isPremiumUser?: boolean;
}

interface JobApplication {
  jobId: string;
  status: string[];
}

interface CandidateJobCardProps {
  jobItem: JobItem;
  user: User;
  jobApplications: JobApplication[];
}

export const CandidateJobCard = ({
  jobItem,
  user,
  jobApplications,
}: CandidateJobCardProps) => {
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasAppliedLocally, setHasAppliedLocally] = useState(false);
  const { toast } = useToast();

  const isAppliedFromProps =
    (jobApplications || []).findIndex((item) => item.jobId === jobItem?.id) > -1;
  const alreadyApplied = isAppliedFromProps || hasAppliedLocally;

  const isFreeQuotaExceeded =
    !user?.isPremiumUser && (jobApplications || []).length >= 2 && !alreadyApplied;

  async function handlejobApply() {
    if (alreadyApplied) return;

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
      <Card className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200">
        <CardHeader className="p-5 pb-3">
          {/* Top Row: Company avatar + Name + Status Badge */}
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

            {alreadyApplied ? (
              <Badge className="shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-semibold text-[11px] gap-1 px-2 py-0.5">
                <CheckCircle2 className="h-3 w-3" />
                Applied
              </Badge>
            ) : (
              <Badge variant="outline" className="shrink-0 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                {jobItem?.type || "Full-time"}
              </Badge>
            )}
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
                <>
                  Apply Now
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Centered Job Details Modal Dialog */}
      <Dialog open={showJobDetailsModal} onOpenChange={setShowJobDetailsModal}>
        <DialogContent className="p-6 sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="px-0 pr-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-extrabold text-base shadow-sm">
                  {companyMonogram}
                </div>
                <div>
                  <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {jobItem?.title}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <span>{jobItem?.companyName}</span>
                  </div>
                </div>
              </div>
              <DialogDescription className="sr-only">
                Detailed job requirements and description for {jobItem?.title} at {jobItem?.companyName}
              </DialogDescription>

              {/* Action in header */}
              <div className="flex items-center gap-2 shrink-0">
                {alreadyApplied ? (
                  <Button variant="outline" disabled className="gap-1 text-xs text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Already Applied
                  </Button>
                ) : (
                  <Button
                    onClick={handlejobApply}
                    disabled={isApplying}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1"
                  >
                    {isApplying ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        Apply Now
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Specs Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Badge variant="secondary" className="gap-1 text-xs font-medium">
                <MapPin className="h-3 w-3" />
                {jobItem?.location}
              </Badge>
              <Badge variant="outline" className="gap-1 text-xs font-medium">
                <Briefcase className="h-3 w-3" />
                {jobItem?.type}
              </Badge>
              <Badge variant="outline" className="gap-1 text-xs font-medium">
                <Sparkles className="h-3 w-3" />
                {jobItem?.experience?.toLowerCase().includes("yr") || jobItem?.experience?.toLowerCase().includes("year")
                  ? `${jobItem.experience} exp required`
                  : `${jobItem?.experience} yr exp required`}
              </Badge>
            </div>
          </DialogHeader>

          {/* Quota Limit Notice if applicable */}
          {isFreeQuotaExceeded && (
            <Alert className="mt-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-xs text-amber-800 dark:text-amber-200">
                You have reached the free application limit (2/2 applied).{" "}
                <Link href="/membership" className="font-bold underline underline-offset-2">
                  Upgrade to Premium
                </Link>{" "}
                for unlimited applications.
              </AlertDescription>
            </Alert>
          )}

          {/* LinkedIn Style Job Description & Highlights */}
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

          {/* Hiring Workflow Info */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Typical response turnaround within <strong>24–48 hours</strong></span>
            </div>
            <Link href="/activity" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              View Your Activity
            </Link>
          </div>

          <DialogFooter className="px-0 pt-6 mt-4 border-t border-slate-200 dark:border-slate-800 flex flex-row items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowJobDetailsModal(false)}
            >
              Close
            </Button>
            {!alreadyApplied && (
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

