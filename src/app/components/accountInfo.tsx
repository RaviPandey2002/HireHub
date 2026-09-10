"use client"

import { useEffect, useState, useTransition } from "react";
import { updateProfile } from "actions/updateProfile";
import { getResumeUrlAction } from "actions/getResumeUrlAction";
import { initialCandidateFormData, initialRecruiterFormData } from "lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import supabaseClient from "lib/supabaseClient";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Building,
  Briefcase,
  GraduationCap,
  Sparkles,
  FileText,
  Upload,
  Loader2,
  Lock,
  ExternalLink,
  CheckCircle2,
  Globe,
  MapPin,
  Calendar,
} from "lucide-react";
import { AppUser } from "types";

export const AccountInfo = ({ user }: { user: AppUser | null }) => {
  const { toast } = useToast();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const [candidateFormData, setCandidateFormData] = useState(initialCandidateFormData);
  const [recruiterFormData, setRecruiterFormData] = useState(initialRecruiterFormData);
  const [initialCandidateData, setInitialCandidateData] = useState(initialCandidateFormData);
  const [initialRecruiterData, setInitialRecruiterData] = useState(initialRecruiterFormData);

  const [newResumeFile, setNewResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);

  useEffect(() => {
    if (user?.role === "Recruiter" && user?.recruiterInfo) {
      const data = {
        ...initialRecruiterFormData,
        ...user.recruiterInfo,
        name: user.recruiterInfo.name || user.name || "",
      };
      setRecruiterFormData(data);
      setInitialRecruiterData(data);
    }

    if (user?.role === "Candidate" && user?.candidateInfo) {
      const data = {
        ...initialCandidateFormData,
        ...user.candidateInfo,
        name: user.candidateInfo.name || user.name || "",
      };
      setCandidateFormData(data);
      setInitialCandidateData(data);
    }
  }, [user]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const isCandidateDirty =
    user?.role === "Candidate" &&
    (newResumeFile !== null ||
      Object.keys(candidateFormData).some(
        (key) => (candidateFormData as any)[key] !== (initialCandidateData as any)[key]
      ));

  const isRecruiterDirty =
    user?.role === "Recruiter" &&
    Object.keys(recruiterFormData).some(
      (key) => (recruiterFormData as any)[key] !== (initialRecruiterData as any)[key]
    );

  const isDirty = isCandidateDirty || isRecruiterDirty;

  function handleDiscardChanges() {
    setCandidateFormData(initialCandidateData);
    setRecruiterFormData(initialRecruiterData);
    setNewResumeFile(null);
  }

  function handleCandidateFieldChange(field: string, value: string) {
    setCandidateFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleRecruiterFieldChange(field: string, value: string) {
    setRecruiterFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleDownloadResume() {
    if (!user?.id) return;
    setIsLoadingResume(true);

    try {
      const result = await getResumeUrlAction(user.id);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Resume unavailable",
          description: result.error,
        });
      } else if (result?.url) {
        window.open(result.url, "_blank");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to load secure resume link.",
      });
    } finally {
      setIsLoadingResume(false);
    }
  }

  async function handleUpdateAccount() {
    startTransition(async () => {
      try {
        const oldResumePath = candidateFormData.resume;
        let resumePath = candidateFormData.resume;

        if (newResumeFile) {
          setUploadingResume(true);
          const { data, error } = await supabaseClient.storage
            .from("hirehub-bucket-public")
            .upload(`public/${Date.now()}_${newResumeFile.name}`, newResumeFile, {
              cacheControl: "3600",
              upsert: true,
            });

          setUploadingResume(false);

          if (error || !data) {
            toast({
              variant: "destructive",
              title: "Resume upload failed",
              description: error?.message || "Could not upload new resume.",
            });
            return;
          }

          resumePath = data.path;
          setCandidateFormData((prev) => ({ ...prev, resume: data.path }));

          // Remove the previous resume file from Supabase storage to prevent orphaned files
          if (oldResumePath && oldResumePath !== data.path) {
            try {
              await supabaseClient.storage
                .from("hirehub-bucket-public")
                .remove([oldResumePath]);
            } catch (cleanupErr) {
              console.error("Failed to delete old resume from Supabase:", cleanupErr);
            }
          }
        }

        const payload =
          user?.role === "Candidate"
            ? { ...candidateFormData, resume: resumePath }
            : recruiterFormData;

        const result = await updateProfile(user, payload, "/account");

        if (result?.success) {
          await update();
          if (user?.role === "Candidate") {
            setInitialCandidateData({ ...candidateFormData, resume: resumePath });
            setCandidateFormData((prev) => ({ ...prev, resume: resumePath }));
          } else {
            setInitialRecruiterData(recruiterFormData);
          }
          setNewResumeFile(null);
          toast({
            title: "Profile updated!",
            description: "Your account details have been successfully saved.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: result?.message || "Something went wrong.",
          });
        }
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err?.message || "An unexpected error occurred.",
        });
      }
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ── Profile Summary Card ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 rounded-2xl border-2 border-gray-100 dark:border-gray-800 shadow-sm text-lg font-bold">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
            <AvatarFallback className="rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {user?.name || "Account Profile"}
              </h1>
              <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                {user?.role}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Membership Badge */}
        <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 dark:border-gray-800">
          {user?.isPremiumUser ? (
            <div className="flex flex-col items-start sm:items-end">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                {user?.memberShipType ? user.memberShipType.toUpperCase() : "PREMIUM"} MEMBER
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Active subscription
              </span>
            </div>
          ) : (
            <div className="flex items-center sm:flex-col sm:items-end gap-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                Free Plan
              </span>
              <Link href="/membership">
                <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Upgrade
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Form Section ── */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6 sm:p-8 space-y-8">
        {user?.role === "Recruiter" ? (
          /* ── Recruiter Profile Fields ── */
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Building className="h-5 w-5 text-gray-500" />
                Company & Recruiter Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Update the information candidates see when you post jobs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={recruiterFormData.name}
                  onChange={(e) => handleRecruiterFieldChange("name", e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  Registered Email <Lock className="h-3 w-3 text-gray-400" />
                </Label>
                <Input id="email" value={user?.email || ""} disabled className="bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-75" />
                <p className="text-xs text-gray-400">Email is linked to your authentication provider.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={recruiterFormData.companyName}
                  onChange={(e) => handleRecruiterFieldChange("companyName", e.target.value)}
                  placeholder="e.g. Acme Inc."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="companyRole">Your Role at Company</Label>
                <Input
                  id="companyRole"
                  value={recruiterFormData.companyRole}
                  onChange={(e) => handleRecruiterFieldChange("companyRole", e.target.value)}
                  placeholder="e.g. Talent Acquisition Lead"
                />
              </div>
            </div>
          </div>
        ) : (
          /* ── Candidate Profile Fields ── */
          <div className="space-y-8">
            {/* Section: Personal */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                  Personal & Current Position
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Your basic contact and current employment status.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={candidateFormData.name}
                    onChange={(e) => handleCandidateFieldChange("name", e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="flex items-center gap-1.5">
                    Registered Email <Lock className="h-3 w-3 text-gray-400" />
                  </Label>
                  <Input id="email" value={user?.email || ""} disabled className="bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-75" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="currentCompany">Current Company</Label>
                  <Input
                    id="currentCompany"
                    value={candidateFormData.currentCompany}
                    onChange={(e) => handleCandidateFieldChange("currentCompany", e.target.value)}
                    placeholder="Current company name"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="currentJobLocation">Current Job Location</Label>
                  <Input
                    id="currentJobLocation"
                    value={candidateFormData.currentJobLocation}
                    onChange={(e) => handleCandidateFieldChange("currentJobLocation", e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="currentSalary">Current Salary</Label>
                  <Input
                    id="currentSalary"
                    value={candidateFormData.currentSalary}
                    onChange={(e) => handleCandidateFieldChange("currentSalary", e.target.value)}
                    placeholder="e.g. $95,000 / year"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="noticePeriod">Notice Period</Label>
                  <Input
                    id="noticePeriod"
                    value={candidateFormData.noticePeriod}
                    onChange={(e) => handleCandidateFieldChange("noticePeriod", e.target.value)}
                    placeholder="e.g. 2 weeks / Immediate"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* Section: Career & Skills */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  Experience & Preferences
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Your experience, skills, and preferred work location.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="totalExperience">Total Experience</Label>
                  <Input
                    id="totalExperience"
                    value={candidateFormData.totalExperience}
                    onChange={(e) => handleCandidateFieldChange("totalExperience", e.target.value)}
                    placeholder="e.g. 4 years"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="preferedJobLocation">Preferred Job Location</Label>
                  <Input
                    id="preferedJobLocation"
                    value={candidateFormData.preferedJobLocation}
                    onChange={(e) => handleCandidateFieldChange("preferedJobLocation", e.target.value)}
                    placeholder="e.g. Remote / New York"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    value={candidateFormData.skills}
                    onChange={(e) => handleCandidateFieldChange("skills", e.target.value)}
                    placeholder="e.g. React, Next.js, Node.js, TypeScript, PostgreSQL"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="previousCompanies">Previous Companies</Label>
                  <Input
                    id="previousCompanies"
                    value={candidateFormData.previousCompanies}
                    onChange={(e) => handleCandidateFieldChange("previousCompanies", e.target.value)}
                    placeholder="e.g. Google, Microsoft, Meta"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* Section: Education */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-gray-500" />
                  Education
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Your academic background and graduation details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="collage">College / University</Label>
                  <Input
                    id="collage"
                    value={candidateFormData.collage}
                    onChange={(e) => handleCandidateFieldChange("collage", e.target.value)}
                    placeholder="e.g. Stanford University"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="graduatedYear">Graduation Year</Label>
                  <Input
                    id="graduatedYear"
                    value={candidateFormData.graduatedYear}
                    onChange={(e) => handleCandidateFieldChange("graduatedYear", e.target.value)}
                    placeholder="e.g. 2024"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-3">
                  <Label htmlFor="collageLocation">College Location</Label>
                  <Input
                    id="collageLocation"
                    value={candidateFormData.collageLocation}
                    onChange={(e) => handleCandidateFieldChange("collageLocation", e.target.value)}
                    placeholder="e.g. Stanford, California"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* Section: Online Presence */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gray-500" />
                  Online Profiles
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Links to your professional portfolios and profiles.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="linkedinProfile">LinkedIn Profile URL</Label>
                  <Input
                    id="linkedinProfile"
                    value={candidateFormData.linkedinProfile}
                    onChange={(e) => handleCandidateFieldChange("linkedinProfile", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="githubProfile">GitHub Profile URL</Label>
                  <Input
                    id="githubProfile"
                    value={candidateFormData.githubProfile}
                    onChange={(e) => handleCandidateFieldChange("githubProfile", e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* Section: Resume */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  Resume Document
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  View your current resume or upload an updated copy.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {newResumeFile ? newResumeFile.name : candidateFormData.resume ? "Resume.pdf" : "No resume uploaded"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {newResumeFile ? "Ready to upload on save" : candidateFormData.resume ? "Uploaded on file" : "Upload your resume in PDF format"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {newResumeFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewResumeFile(null)}
                      className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 h-8 px-2.5"
                    >
                      Clear Selection
                    </Button>
                  )}
                  {candidateFormData.resume && !newResumeFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadResume}
                      disabled={isLoadingResume}
                      className="gap-1.5 text-xs h-8"
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
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      {candidateFormData.resume ? "Replace PDF" : "Upload PDF"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="sr-only"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files[0]) {
                          if (files[0].size > 5 * 1024 * 1024) {
                            toast({
                              variant: "destructive",
                              title: "File too large",
                              description: "Resume PDF file size must be less than 5MB.",
                            });
                            return;
                          }
                          setNewResumeFile(files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex items-center justify-end gap-3">
          {isDirty && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending || uploadingResume}
              onClick={handleDiscardChanges}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Discard Changes
            </Button>
          )}
          <Button
            onClick={handleUpdateAccount}
            disabled={!isDirty || isPending || uploadingResume}
            className="min-w-[140px]"
          >
            {isPending || uploadingResume ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      {/* ── Sticky Unsaved Changes Floating Bar ── */}
      {isDirty && (
        <div className="sticky bottom-6 z-30 flex items-center justify-between gap-4 rounded-2xl border border-amber-300 dark:border-amber-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 py-3.5 shadow-xl shadow-amber-500/5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
              You have unsaved changes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending || uploadingResume}
              onClick={handleDiscardChanges}
              className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Discard
            </Button>
            <Button
              size="sm"
              onClick={handleUpdateAccount}
              disabled={isPending || uploadingResume}
              className="text-xs font-semibold min-w-[110px]"
            >
              {isPending || uploadingResume ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};