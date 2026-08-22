"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createProfileAction } from "actions/dbActions";
import {
  candidateOnboardFormControls,
  initialCandidateFormData,
  initialRecruiterFormData,
  recruiterOnboardFormControls,
} from "lib/utils";
import { useState } from "react";
import { DEFAULT_LOGIN_REDIRECT } from "routes";
import supabaseClient from "lib/supabaseClient";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";

// ─── section groupings for the candidate form ────────────────────────────────
const candidateSections = [
  { heading: "Personal",        fields: ["name", "resume"] },
  { heading: "Current Role",    fields: ["currentCompany", "currentJobLocation", "currentSalary", "noticePeriod"] },
  { heading: "Career",          fields: ["totalExperience", "previousCompanies", "skills", "preferedJobLocation"] },
  { heading: "Education",       fields: ["collage", "collageLocation", "graduatedYear"] },
  { heading: "Online Presence", fields: ["linkedinProfile", "githubProfile"] },
];

export const OnBoarding = ({ currentUser }) => {
  const { update } = useSession();
  const [currentTab, setCurrentTab] = useState("candidate");
  const [recruiterFormData, setRecruiterFormData] = useState(initialRecruiterFormData);
  const [candidateFormData, setCandidateFormData] = useState(initialCandidateFormData);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // ── validation ──────────────────────────────────────────────────────────────
  const recruiterValid =
    recruiterFormData.name.trim() !== "" &&
    recruiterFormData.companyName.trim() !== "" &&
    recruiterFormData.companyRole.trim() !== "";

  const candidateValid =
    candidateFormData.name.trim() !== "" &&
    candidateFormData.currentCompany.trim() !== "" &&
    candidateFormData.currentJobLocation.trim() !== "" &&
    candidateFormData.preferedJobLocation.trim() !== "" &&
    candidateFormData.currentSalary.trim() !== "" &&
    candidateFormData.noticePeriod.trim() !== "" &&
    candidateFormData.skills.trim() !== "" &&
    candidateFormData.previousCompanies.trim() !== "" &&
    candidateFormData.totalExperience.trim() !== "" &&
    candidateFormData.collage.trim() !== "" &&
    candidateFormData.collageLocation.trim() !== "" &&
    candidateFormData.graduatedYear.trim() !== "" &&
    candidateFormData.linkedinProfile.trim() !== "" &&
    candidateFormData.githubProfile.trim() !== "";

  // ── file handling ────────────────────────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5 MB.");
      return;
    }
    setFile(selected);
    setFileName(selected.name);
  }

  async function uploadPdfToSupabase() {
    if (!file) return null;
    const filePath = `public/${currentUser.name}/${Date.now()}_${file.name}`;
    const { data, error } = await supabaseClient.storage
      .from("hirehub-bucket-public")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });
    if (data) return filePath;
    if (error?.message === "The resource already exists") return filePath;
    console.error("File upload error:", error);
    return null;
  }

  // ── submit ───────────────────────────────────────────────────────────────────
  async function createProfile() {
    setSubmitting(true);
    try {
      let resumePath = candidateFormData.resume;

      if (currentTab === "candidate" && file) {
        const uploaded = await uploadPdfToSupabase();
        if (!uploaded) { alert("Failed to upload resume."); return; }
        resumePath = uploaded;
      }

      const formData =
        currentTab === "candidate"
          ? {
              candidateInfo: { ...candidateFormData, resume: resumePath },
              role: "Candidate",
              isPremiumUser: false,
              id: currentUser?.id,
              email: currentUser?.email,
            }
          : {
              recruiterInfo: recruiterFormData,
              role: "Recruiter",
              isPremiumUser: false,
              id: currentUser?.id,
              email: currentUser?.email,
            };

      const response = await createProfileAction(currentTab, formData);
      if (response?.success) {
        await update();
        window.location.href = DEFAULT_LOGIN_REDIRECT;
      } else {
        console.error(response?.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ── field renderer ───────────────────────────────────────────────────────────
  function renderField(control, formData, setFormData) {
    if (control.componentType === "file") {
      return (
        <div key={control.name} className="flex flex-col gap-1.5">
          <Label htmlFor={control.name}>{control.label}</Label>
          <label
            htmlFor={control.name}
            className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 transition-colors hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Upload className="h-4 w-4 shrink-0" />
            <span className="truncate">{fileName || "Click to upload PDF (max 5 MB)"}</span>
            {fileName && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-green-500" />}
            <input
              id={control.name}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </div>
      );
    }

    return (
      <div key={control.name} className="flex flex-col gap-1.5">
        <Label htmlFor={control.name}>{control.label}</Label>
        <Input
          id={control.name}
          name={control.name}
          type="text"
          disabled={control.disabled}
          placeholder={control.placeholder}
          value={formData[control.name] ?? ""}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-black">
              H
            </span>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              HireHub
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mt-4">
            Complete your profile
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You&apos;re almost in. Tell us who you are so we can connect you with the right opportunities.
          </p>
        </div>

        {/* Tab card */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>

            {/* Tab switcher */}
            <div className="border-b border-gray-100 dark:border-gray-800 px-6 pt-6 pb-0">
              <TabsList className="w-full grid grid-cols-2 h-11">
                <TabsTrigger value="candidate" className="text-sm">
                  👤 Candidate
                </TabsTrigger>
                <TabsTrigger value="recruiter" className="text-sm">
                  🏢 Recruiter
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ── Candidate form ───────────────────────────── */}
            <TabsContent value="candidate" className="p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Looking for your next role? Fill in your details to get matched with relevant jobs.
              </p>
              <div className="space-y-8">
                {candidateSections.map((section) => {
                  const controls = candidateOnboardFormControls.filter((c) =>
                    section.fields.includes(c.name)
                  );
                  if (!controls.length) return null;
                  return (
                    <div key={section.heading}>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                        {section.heading}
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {controls.map((c) => renderField(c, candidateFormData, setCandidateFormData))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                <p className="text-xs text-gray-400">All fields are required</p>
                <Button
                  onClick={createProfile}
                  disabled={!candidateValid || submitting}
                  className="min-w-[160px]"
                >
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
                  ) : (
                    "Join as Candidate"
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* ── Recruiter form ───────────────────────────── */}
            <TabsContent value="recruiter" className="p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Hiring talent? Set up your recruiter profile to start posting jobs and reviewing candidates.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recruiterOnboardFormControls.map((c) =>
                  renderField(c, recruiterFormData, setRecruiterFormData)
                )}
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                <p className="text-xs text-gray-400">All fields are required</p>
                <Button
                  onClick={createProfile}
                  disabled={!recruiterValid || submitting}
                  className="min-w-[160px]"
                >
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
                  ) : (
                    "Join as Recruiter"
                  )}
                </Button>
              </div>
            </TabsContent>

          </Tabs>
        </div>

      </div>
    </div>
  );
};
