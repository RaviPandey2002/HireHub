"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  MapPin,
  Briefcase,
  Clock,
  GraduationCap,
  Globe,
  ExternalLink,
  Loader2,
  UserCheck,
  Send,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { getResumeUrlAction } from "actions/getResumeUrlAction";
import { AppUser, JobOpening, CandidateInfo } from "types";

interface CandidateItem {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  candidateInfo?: CandidateInfo | null;
}

interface TalentViewProps {
  user: AppUser | null;
  candidates: CandidateItem[];
  recruiterJobs: JobOpening[];
}

const POPULAR_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Go",
  "Python",
  "Kubernetes",
  "PostgreSQL",
  "AWS",
];

export function TalentView({ user: _user, candidates, recruiterJobs }: TalentViewProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoticePeriod, setSelectedNoticePeriod] = useState("ALL");
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [inspectingCandidate, setInspectingCandidate] = useState<CandidateItem | null>(null);
  const [inviteCandidate, setInviteCandidate] = useState<CandidateItem | null>(null);
  const [selectedJobToInvite, setSelectedJobToInvite] = useState<string>(
    recruiterJobs[0]?.id || ""
  );
  const [isInviting, setIsInviting] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);

  // Dynamic locations from candidates
  const availableLocations = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => {
      const loc = c.candidateInfo?.preferedJobLocation || c.candidateInfo?.currentJobLocation;
      if (loc && typeof loc === "string") {
        set.add(loc.trim());
      }
    });
    return Array.from(set).slice(0, 10);
  }, [candidates]);

  // Multi-Filter Pipeline
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const info = c.candidateInfo || {};

      // 1. Notice period filter
      if (selectedNoticePeriod !== "ALL") {
        const notice = info.noticePeriod?.toLowerCase() || "";
        if (!notice.includes(selectedNoticePeriod.toLowerCase())) {
          return false;
        }
      }

      // 2. Location filter
      if (selectedLocation !== "ALL") {
        const prefLoc = info.preferedJobLocation?.toLowerCase() || "";
        const currLoc = info.currentJobLocation?.toLowerCase() || "";
        const qLoc = selectedLocation.toLowerCase();
        if (!prefLoc.includes(qLoc) && !currLoc.includes(qLoc)) {
          return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name?.toLowerCase().includes(q);
        const matchesEmail = c.email?.toLowerCase().includes(q);
        const matchesSkills = info.skills?.toLowerCase().includes(q);
        const matchesCompany = info.currentCompany?.toLowerCase().includes(q);
        const matchesCollege = info.collage?.toLowerCase().includes(q);

        if (!matchesName && !matchesEmail && !matchesSkills && !matchesCompany && !matchesCollege) {
          return false;
        }
      }

      return true;
    });
  }, [candidates, selectedNoticePeriod, selectedLocation, searchQuery]);

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
      const msg = err instanceof Error ? err.message : "Failed to retrieve resume.";
      toast({
        variant: "destructive",
        title: "Error",
        description: msg,
      });
    } finally {
      setIsLoadingResume(false);
    }
  }

  function handleSendInvite() {
    if (!selectedJobToInvite) {
      toast({
        variant: "destructive",
        title: "Please select an active job",
        description: "Choose which job opening you would like to invite this candidate to.",
      });
      return;
    }

    setIsInviting(true);
    const targetJob = recruiterJobs.find((j) => j.id === selectedJobToInvite);

    setTimeout(() => {
      setIsInviting(false);
      setInviteCandidate(null);
      toast({
        title: "Invitation Sent! 🚀",
        description: `Invited ${inviteCandidate?.name} to apply for "${targetJob?.title || "your open role"}".`,
      });
    }, 600);
  }

  const inspectingInfo = inspectingCandidate?.candidateInfo || {};

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Header Hero Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 dark:border-gray-800 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Talent Discovery Hub
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40"
            >
              Candidate Pool
            </Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-2xl">
            Proactively browse, screen, and invite verified software engineers and tech talent open to new roles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/applicants">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium border-gray-200 dark:border-gray-800">
              <UserCheck className="h-3.5 w-3.5 text-indigo-500" />
              View Pipeline
            </Button>
          </Link>
          <Link href="/jobs">
            <Button size="sm" className="gap-1.5 text-xs font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm">
              <Briefcase className="h-3.5 w-3.5" />
              Post A Role
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Popular Skills Quick Ticker ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-gray-400 dark:text-gray-500 font-semibold shrink-0">
          Popular Skills:
        </span>
        {POPULAR_SKILLS.map((skill) => (
          <button
            key={skill}
            onClick={() => setSearchQuery((prev) => (prev === skill ? "" : skill))}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all shrink-0 border ${
              searchQuery.toLowerCase() === skill.toLowerCase()
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200/80 dark:border-gray-800 hover:border-gray-300"
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            type="search"
            placeholder="Search candidates by name, skills, college, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-10 w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Notice Period Filter */}
          <Select value={selectedNoticePeriod} onValueChange={setSelectedNoticePeriod}>
            <SelectTrigger className="w-[160px] h-10 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <SelectValue placeholder="Notice Period" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">
                Any Notice Period
              </SelectItem>
              <SelectItem value="Immediate" className="text-xs">
                Immediate Joiner
              </SelectItem>
              <SelectItem value="15 days" className="text-xs">
                15 Days
              </SelectItem>
              <SelectItem value="30 days" className="text-xs">
                30 Days
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Location Filter */}
          {availableLocations.length > 0 && (
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[160px] h-10 text-xs">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <SelectValue placeholder="Location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">
                  All Locations
                </SelectItem>
                {availableLocations.map((loc) => (
                  <SelectItem key={loc} value={loc} className="text-xs truncate">
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {(searchQuery || selectedNoticePeriod !== "ALL" || selectedLocation !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedNoticePeriod("ALL");
                setSelectedLocation("ALL");
              }}
              className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white h-10"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* ── Candidates Grid ── */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span>
            Showing <strong className="font-semibold text-gray-900 dark:text-white">{filteredCandidates.length}</strong> verified{" "}
            {filteredCandidates.length === 1 ? "candidate" : "candidates"}
          </span>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center">
            <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              No candidates found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
              No talent profiles match your current search criteria. Try removing filters or searching for different skills.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedNoticePeriod("ALL");
                setSelectedLocation("ALL");
              }}
              className="mt-4 text-xs"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => {
              const info = candidate.candidateInfo || {};
              const monogram = (candidate.name || "C")
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase();

              const skillsList = (info.skills || "")
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean);

              const displaySkills = skillsList.slice(0, 4);
              const remainingCount = skillsList.length - displaySkills.length;

              return (
                <Card
                  key={candidate.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
                >
                  <div className="p-5 space-y-4">
                    {/* Header: Monogram + Name + Notice Pill */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-base shadow-sm">
                          {monogram}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                            {candidate.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {info.currentCompany ? `at ${info.currentCompany}` : "Independent Engineer"}
                          </p>
                        </div>
                      </div>

                      {info.noticePeriod && (
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800 gap-1 px-2 py-0.5"
                        >
                          <Clock className="h-3 w-3" />
                          {info.noticePeriod}
                        </Badge>
                      )}
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-1">
                      {info.preferedJobLocation && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          {info.preferedJobLocation}
                        </span>
                      )}
                      {info.preferedJobLocation && info.totalExperience && (
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                      )}
                      {info.totalExperience && (
                        <span className="inline-flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          {info.totalExperience} exp
                        </span>
                      )}
                    </div>

                    {/* Skills pills */}
                    {displaySkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {displaySkills.map((skill: string, i: number) => (
                          <span
                            key={i}
                            className="rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:text-gray-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {remainingCount > 0 && (
                          <span className="rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                            +{remainingCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-3 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-between gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInspectingCandidate(candidate)}
                      className="text-xs font-semibold gap-1.5 h-8 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      View Dossier
                    </Button>

                    {recruiterJobs.length > 0 && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setInviteCandidate(candidate);
                          setSelectedJobToInvite(recruiterJobs[0]?.id || "");
                        }}
                        className="h-8 px-3 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      >
                        <Send className="h-3 w-3" />
                        Invite
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Candidate Dossier Modal Dialog ── */}
      <Dialog
        open={!!inspectingCandidate}
        onOpenChange={(open) => !open && setInspectingCandidate(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-6">
          <DialogHeader className="pr-8 pb-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-base shadow-sm">
                  {(inspectingCandidate?.name || "C")
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {inspectingCandidate?.name}
                  </DialogTitle>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {inspectingCandidate?.email}
                  </p>
                </div>
              </div>

              {inspectingInfo.resume && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePreviewResume(inspectingCandidate!.id)}
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
              Candidate background, skills, and qualifications for {inspectingCandidate?.name}.
            </DialogDescription>
          </DialogHeader>

          {/* Dossier Body */}
          <div className="space-y-6 py-4">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3">
                <p className="text-[10px] uppercase font-bold text-gray-400">Total Experience</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                  {inspectingInfo.totalExperience || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3">
                <p className="text-[10px] uppercase font-bold text-gray-400">Notice Period</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                  {inspectingInfo.noticePeriod || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3">
                <p className="text-[10px] uppercase font-bold text-gray-400">Current Role / Co.</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 truncate">
                  {inspectingInfo.currentCompany || "Independent"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3">
                <p className="text-[10px] uppercase font-bold text-gray-400">Current Location</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 truncate">
                  {inspectingInfo.currentJobLocation || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3">
                <p className="text-[10px] uppercase font-bold text-gray-400">Preferred Location</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 truncate">
                  {inspectingInfo.preferedJobLocation || "Flexible"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3">
                <p className="text-[10px] uppercase font-bold text-gray-400">Current Salary</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                  {inspectingInfo.currentSalary || "Confidential"}
                </p>
              </div>
            </div>

            {/* Skills */}
            {inspectingInfo.skills && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Technical Skills & Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {inspectingInfo.skills
                    .split(",")
                    .map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
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
                Education & Work History
              </h4>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <GraduationCap className="h-4 w-4 text-emerald-600" />
                  <span>{inspectingInfo.collage || "University details available upon request"}</span>
                </div>
                {inspectingInfo.graduatedYear && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 pl-6">
                    Graduation Year: {inspectingInfo.graduatedYear} · {inspectingInfo.collageLocation || ""}
                  </p>
                )}
                {inspectingInfo.previousCompanies && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 pl-6 pt-1">
                    Previous Companies: <strong>{inspectingInfo.previousCompanies}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Links */}
            {(inspectingInfo.linkedinProfile || inspectingInfo.githubProfile) && (
              <div className="flex items-center gap-4 pt-1">
                {inspectingInfo.linkedinProfile && (
                  <a
                    href={inspectingInfo.linkedinProfile}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    LinkedIn Profile
                  </a>
                )}
                {inspectingInfo.githubProfile && (
                  <a
                    href={inspectingInfo.githubProfile}
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

          <DialogFooter className="border-t border-gray-200 dark:border-gray-800 pt-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInspectingCandidate(null)}
            >
              Close
            </Button>

            {recruiterJobs.length > 0 && (
              <Button
                size="sm"
                onClick={() => {
                  const target = inspectingCandidate;
                  setInspectingCandidate(null);
                  setInviteCandidate(target);
                  setSelectedJobToInvite(recruiterJobs[0]?.id || "");
                }}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                Invite to Apply
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Invite to Apply Modal Dialog ── */}
      <Dialog
        open={!!inviteCandidate}
        onOpenChange={(open) => !open && !isInviting && setInviteCandidate(null)}
      >
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Invite Candidate to Apply
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 pt-1">
              Select one of your active job openings to send an invitation to{" "}
              <strong>{inviteCandidate?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Select Open Role
              </label>
              <Select value={selectedJobToInvite} onValueChange={setSelectedJobToInvite}>
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue placeholder="Choose a job" />
                </SelectTrigger>
                <SelectContent>
                  {recruiterJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id} className="text-xs">
                      {job.title} ({job.companyName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInviteCandidate(null)}
              disabled={isInviting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSendInvite}
              disabled={isInviting || !selectedJobToInvite}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 text-xs"
            >
              {isInviting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

