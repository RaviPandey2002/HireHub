"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Briefcase,
  Sparkles,
  Eye,
  ExternalLink,
  Loader2,
  AlertCircle,
  GraduationCap,
  Globe,
  UserCheck,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { updateJobApplicationAction } from "actions/updateJobApplicationAction";
import { getResumeUrlAction } from "actions/getResumeUrlAction";

interface EnrichedApplicant {
  id: string;
  candidateId: string;
  jobId: string;
  name: string;
  email: string;
  status: string[];
  jobApplicationDate: string | Date;
  job?: {
    id: string;
    title: string;
    companyName: string;
    location?: string;
    type?: string;
  } | null;
  candidate?: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    candidateInfo?: any;
  } | null;
}

interface ApplicantsViewProps {
  user: any;
  initialApplicants: EnrichedApplicant[];
  jobs: any[];
}

function formatUtcDate(dateInput: string | Date) {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  } catch {
    return String(dateInput);
  }
}

function getStatusCategory(statusArr: string[]): "Selected" | "Rejected" | "Under Review" {
  if (statusArr.includes("Selected")) return "Selected";
  if (statusArr.includes("Rejected")) return "Rejected";
  return "Under Review";
}

export function ApplicantsView({ user: _user, initialApplicants, jobs }: ApplicantsViewProps) {
  const { toast } = useToast();
  const [applicants, setApplicants] = useState<EnrichedApplicant[]>(initialApplicants || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [inspectingApplicant, setInspectingApplicant] = useState<EnrichedApplicant | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [isLoadingResume, setIsLoadingResume] = useState(false);

  // Pipeline metrics
  const totalCount = applicants.length;
  const underReviewCount = applicants.filter(
    (a) => getStatusCategory(a.status) === "Under Review"
  ).length;
  const selectedCount = applicants.filter(
    (a) => getStatusCategory(a.status) === "Selected"
  ).length;
  const rejectedCount = applicants.filter(
    (a) => getStatusCategory(a.status) === "Rejected"
  ).length;

  // Filter pipeline
  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      // 1. Job Opening Filter
      if (selectedJobId !== "ALL" && app.jobId !== selectedJobId) {
        return false;
      }

      // 2. Status Tab Filter
      const category = getStatusCategory(app.status);
      if (activeTab === "under_review" && category !== "Under Review") return false;
      if (activeTab === "selected" && category !== "Selected") return false;
      if (activeTab === "rejected" && category !== "Rejected") return false;

      // 3. Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const candidateInfo = app.candidate?.candidateInfo || {};
        const matchesName = app.name?.toLowerCase().includes(q);
        const matchesEmail = app.email?.toLowerCase().includes(q);
        const matchesJob = app.job?.title?.toLowerCase().includes(q);
        const matchesSkills = candidateInfo.skills?.toLowerCase().includes(q);
        const matchesCompany = candidateInfo.currentCompany?.toLowerCase().includes(q);

        if (!matchesName && !matchesEmail && !matchesJob && !matchesSkills && !matchesCompany) {
          return false;
        }
      }

      return true;
    });
  }, [applicants, selectedJobId, activeTab, searchQuery]);

  async function handleUpdateStatus(
    applicationId: string,
    newStatus: "Selected" | "Rejected"
  ) {
    setIsUpdatingStatus(applicationId);

    try {
      const result = await updateJobApplicationAction(
        {
          id: applicationId,
          status: ["Applied", newStatus],
        },
        "/applicants"
      );

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: result.error,
        });
      } else {
        setApplicants((prev) =>
          prev.map((app) =>
            app.id === applicationId
              ? { ...app, status: ["Applied", newStatus] }
              : app
          )
        );

        if (inspectingApplicant?.id === applicationId) {
          setInspectingApplicant((prev) =>
            prev ? { ...prev, status: ["Applied", newStatus] } : null
          );
        }

        toast({
          title: newStatus === "Selected" ? "Candidate Selected! 🎉" : "Candidate Status Updated",
          description: `Application marked as ${newStatus.toLowerCase()}. Candidate notified.`,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status.";
      toast({
        variant: "destructive",
        title: "Error",
        description: msg,
      });
    } finally {
      setIsUpdatingStatus(null);
    }
  }

  async function handlePreviewResume(candidateId: string) {
    if (!candidateId) return;
    setIsLoadingResume(true);

    try {
      const result = await getResumeUrlAction(candidateId);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Resume unavailable",
          description: result.error,
        });
      } else if (result?.url) {
        window.open(result.url, "_blank");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not load resume.";
      toast({
        variant: "destructive",
        title: "Error",
        description: msg,
      });
    } finally {
      setIsLoadingResume(false);
    }
  }

  const inspectingCandidateInfo = inspectingApplicant?.candidate?.candidateInfo || {};

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Header Hero Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 dark:border-gray-800 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Candidate Pipeline
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40"
            >
              Recruiter Hub
            </Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-2xl">
            Track, evaluate, and manage candidate submissions across all your active job postings in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/jobs">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium border-gray-200 dark:border-gray-800">
              <Briefcase className="h-3.5 w-3.5" />
              Manage Jobs
            </Button>
          </Link>
          <Link href="/talent">
            <Button size="sm" className="gap-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Discover Talent
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 4 Pipeline Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>Total Candidates</span>
            <UserCheck className="h-4 w-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-blue-100 mt-2">
            {totalCount}
          </p>
          <p className="text-[11px] text-blue-600/70 dark:text-blue-400/70 mt-0.5">
            Across {jobs.length} open {jobs.length === 1 ? "role" : "roles"}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>Awaiting Review</span>
            <Clock className="h-4 w-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-950 dark:text-amber-100 mt-2">
            {underReviewCount}
          </p>
          <p className="text-[11px] text-amber-600/70 dark:text-amber-400/70 mt-0.5">
            Require your screening
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Selected / Offers</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-950 dark:text-emerald-100 mt-2">
            {selectedCount}
          </p>
          <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
            Advanced in pipeline
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span>Not Selected</span>
            <XCircle className="h-4 w-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-950 dark:text-rose-100 mt-2">
            {rejectedCount}
          </p>
          <p className="text-[11px] text-rose-600/70 dark:text-rose-400/70 mt-0.5">
            Archived applications
          </p>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            type="search"
            placeholder="Search applicants by name, email, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-10 w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Job Opening Dropdown */}
          <Select value={selectedJobId} onValueChange={setSelectedJobId}>
            <SelectTrigger className="w-full sm:w-[220px] h-10 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <Briefcase className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <SelectValue placeholder="All Openings" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">
                All Job Openings ({jobs.length})
              </SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id} className="text-xs truncate">
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Pipeline Status Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-900 p-1 rounded-xl h-auto flex-wrap gap-1">
          <TabsTrigger value="all" className="rounded-lg font-semibold text-xs sm:text-sm">
            All Candidates ({totalCount})
          </TabsTrigger>
          <TabsTrigger
            value="under_review"
            className="rounded-lg font-semibold text-xs sm:text-sm text-amber-600 dark:text-amber-400"
          >
            Awaiting Review ({underReviewCount})
          </TabsTrigger>
          <TabsTrigger
            value="selected"
            className="rounded-lg font-semibold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400"
          >
            Selected 🎉 ({selectedCount})
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="rounded-lg font-semibold text-xs sm:text-sm text-rose-600 dark:text-rose-400"
          >
            Not Selected ({rejectedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredApplicants.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center">
              <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No applicants match your criteria
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
                {searchQuery
                  ? `No candidates found matching "${searchQuery}". Try clearing search filters.`
                  : "No submissions in this pipeline stage yet."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-xs"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplicants.map((app) => {
                const statusCategory = getStatusCategory(app.status);
                const candidateInfo = app.candidate?.candidateInfo || {};
                const monogram = (app.name || "C")
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                const skillsList = (candidateInfo.skills || "")
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean)
                  .slice(0, 3);

                return (
                  <Card
                    key={app.id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
                  >
                    <div className="p-5 space-y-4">
                      {/* Top: Monogram + Candidate Name + Status Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-bold text-sm shadow-sm">
                            {monogram}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                              {app.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {app.email}
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant={
                            statusCategory === "Selected"
                              ? "default"
                              : statusCategory === "Rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className={`shrink-0 font-semibold text-[11px] gap-1 px-2 py-0.5 ${
                            statusCategory === "Selected"
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : statusCategory === "Under Review"
                              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                              : ""
                          }`}
                        >
                          {statusCategory === "Selected" && <CheckCircle2 className="h-3 w-3" />}
                          {statusCategory === "Under Review" && <Clock className="h-3 w-3" />}
                          {statusCategory === "Rejected" && <XCircle className="h-3 w-3" />}
                          {statusCategory === "Selected" ? "Selected 🎉" : statusCategory}
                        </Badge>
                      </div>

                      {/* Applied Role & Date */}
                      <div className="rounded-xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/70 dark:bg-gray-900/50 p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                          <Briefcase className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate">{app.job?.title || "Job Posting"}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-0.5">
                          <span className="truncate">{app.job?.companyName}</span>
                          <span className="flex items-center gap-1 shrink-0 ml-2" suppressHydrationWarning>
                            <Calendar className="h-3 w-3 text-gray-400" />
                            {formatUtcDate(app.jobApplicationDate)}
                          </span>
                        </div>
                      </div>

                      {/* Candidate Quick Snapshot */}
                      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                        {candidateInfo.currentCompany && (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">Current: <strong>{candidateInfo.currentCompany}</strong></span>
                          </div>
                        )}
                        {candidateInfo.totalExperience && (
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span>Experience: <strong>{candidateInfo.totalExperience}</strong></span>
                          </div>
                        )}

                        {/* Skills Chips */}
                        {skillsList.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            {skillsList.map((skill: string, i: number) => (
                              <span
                                key={i}
                                className="rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-700 dark:text-gray-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-between gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInspectingApplicant(app)}
                        className="text-xs font-semibold gap-1.5 h-8 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Dossier
                      </Button>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isUpdatingStatus === app.id || statusCategory === "Rejected"}
                          onClick={() => handleUpdateStatus(app.id, "Rejected")}
                          className="h-8 px-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-gray-200 dark:border-gray-800"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          disabled={isUpdatingStatus === app.id || statusCategory === "Selected"}
                          onClick={() => handleUpdateStatus(app.id, "Selected")}
                          className="h-8 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        >
                          {isUpdatingStatus === app.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Select 🎉"
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Candidate Dossier Review Modal Dialog ── */}
      <Dialog
        open={!!inspectingApplicant}
        onOpenChange={(open) => !open && setInspectingApplicant(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-6">
          <DialogHeader className="pr-8 pb-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-bold text-base shadow-sm">
                  {(inspectingApplicant?.name || "C")
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {inspectingApplicant?.name}
                  </DialogTitle>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {inspectingApplicant?.email} · Applied for <strong>{inspectingApplicant?.job?.title}</strong>
                  </p>
                </div>
              </div>

              {inspectingCandidateInfo.resume && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePreviewResume(inspectingApplicant!.candidateId)}
                  disabled={isLoadingResume}
                  className="gap-1.5 text-xs shrink-0"
                >
                  {isLoadingResume ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Resume
                    </>
                  )}
                </Button>
              )}
            </div>
            <DialogDescription className="sr-only">
              Candidate profile, experience, skills, and qualifications for {inspectingApplicant?.name}.
            </DialogDescription>
          </DialogHeader>

          {/* Dossier Body */}
          <div className="space-y-6 py-4">
            {/* Experience & Current Role Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3">
                <p className="text-[10px] uppercase font-bold text-gray-400">Total Experience</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                  {inspectingCandidateInfo.totalExperience || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3">
                <p className="text-[10px] uppercase font-bold text-gray-400">Current Role / Co.</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 truncate">
                  {inspectingCandidateInfo.currentCompany || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3">
                <p className="text-[10px] uppercase font-bold text-gray-400">Notice Period</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                  {inspectingCandidateInfo.noticePeriod || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3">
                <p className="text-[10px] uppercase font-bold text-gray-400">Location</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 truncate">
                  {inspectingCandidateInfo.currentJobLocation || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3">
                <p className="text-[10px] uppercase font-bold text-gray-400">Preferred Location</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 truncate">
                  {inspectingCandidateInfo.preferedJobLocation || "Flexible"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3">
                <p className="text-[10px] uppercase font-bold text-gray-400">Current Salary</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                  {inspectingCandidateInfo.currentSalary || "Confidential"}
                </p>
              </div>
            </div>

            {/* Skills */}
            {inspectingCandidateInfo.skills && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Technical Skills & Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {inspectingCandidateInfo.skills
                    .split(",")
                    .map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Education & Background */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Education & Background
              </h4>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <GraduationCap className="h-4 w-4 text-indigo-500" />
                  <span>{inspectingCandidateInfo.collage || "University information provided upon request"}</span>
                </div>
                {inspectingCandidateInfo.graduatedYear && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 pl-6">
                    Graduation Year: {inspectingCandidateInfo.graduatedYear} · {inspectingCandidateInfo.collageLocation || ""}
                  </p>
                )}
                {inspectingCandidateInfo.previousCompanies && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 pl-6 pt-1">
                    Previous Companies: <strong>{inspectingCandidateInfo.previousCompanies}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Online Links */}
            {(inspectingCandidateInfo.linkedinProfile || inspectingCandidateInfo.githubProfile) && (
              <div className="flex items-center gap-3 pt-1">
                {inspectingCandidateInfo.linkedinProfile && (
                  <a
                    href={inspectingCandidateInfo.linkedinProfile}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    LinkedIn Profile
                  </a>
                )}
                {inspectingCandidateInfo.githubProfile && (
                  <a
                    href={inspectingCandidateInfo.githubProfile}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    GitHub Portfolio
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Dossier Footer Actions */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInspectingApplicant(null)}
            >
              Close
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isUpdatingStatus === inspectingApplicant?.id}
                onClick={() => {
                  if (inspectingApplicant) {
                    handleUpdateStatus(inspectingApplicant.id, "Rejected");
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Reject Candidate
              </Button>
              <Button
                size="sm"
                disabled={isUpdatingStatus === inspectingApplicant?.id}
                onClick={() => {
                  if (inspectingApplicant) {
                    handleUpdateStatus(inspectingApplicant.id, "Selected");
                  }
                }}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Select Candidate 🎉
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

