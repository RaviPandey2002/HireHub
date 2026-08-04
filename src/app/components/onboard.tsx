"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { createProfileAction } from "actions/dbActions";
import {
  candidateOnboardFormControls,
  initialCandidateFormData,
  initialRecruiterFormData,
  recruiterOnboardFormControls,
} from "lib/utils";
import { useState } from "react";
import { DEFAULT_LOGIN_REDIRECT } from "routes";
import { CommonForm } from "./common/common-form";

// SUPER-BASE-----------------------
import { createClient } from "@supabase/supabase-js";
import { useSession } from "next-auth/react";

const superbaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const superbaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY


const superbaseClient = createClient(superbaseUrl,
  superbaseKey)

export const OnBoarding = ({ currentUser }) => {
  const { data: session, update, status } = useSession();
  // console.log("session update status", session,status)
  // console.log("onboard current user",currentUser);
  const [currentTab, setCurrentTab] = useState("candidate");
  const [recruiterFormData, setRecruiterFormData] = useState(
    initialRecruiterFormData
  );
  const [candidateFormData, setCandidateFormData] = useState(
    initialCandidateFormData
  );
  const [file, setFile] = useState(null);

  const handleTabChange = (value) => {
    setCurrentTab(value);
  };
  function handleRecuiterFormValid() {
    return (
      recruiterFormData &&
      recruiterFormData.name.trim() !== "" &&
      recruiterFormData.companyName.trim() !== "" &&
      recruiterFormData.companyRole.trim() !== ""
    );
  }

  function handleCandidateFormValid() {
    return (
      candidateFormData &&
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
      candidateFormData.githubProfile.trim()
    );
  }

  function handleFileChange(e) {
    e.preventDefault();
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const allowedTypes = ["application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please upload a PDF file.");
      return;
    }

    if (selectedFile.size > maxSize) {
      alert("File size exceeds 5MB.");
      return;
    }

    setFile(selectedFile);
  }

  async function uploadPdfToSupabase() {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `public/${currentUser.name}/${fileName}`;

    const { data, error } = await superbaseClient.storage
      .from("hirehub-bucket-public")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (data) {
      return filePath;
    }

    if (error?.message === "The resource already exists") {
      return filePath;
    }

    console.error("File upload error:", error);
    return null;
  }
  // console.log("onboard FormData",candidateFormData);


  async function createProfile() {

    let resumePath = candidateFormData.resume;

    if (currentTab === "candidate" && file) {
      const uploadedPath = await uploadPdfToSupabase();

      if (uploadedPath) {
        resumePath = uploadedPath;
      } else {
        alert("Failed to upload resume.");
        return;
      }
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
    if (response && response.success) {
      // Refresh the JWT cookie so the new role (Candidate/Recruiter) is
      // written before we navigate. Use a full HTTP navigation so middleware
      // reads the updated cookie instead of bouncing back to /onboard.
      await update();
      window.location.href = DEFAULT_LOGIN_REDIRECT;
    } else {
      console.error(response.message);
    }
  }

  return (
    <div className="bg-white ml-7 mr-7">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="w-full">
          <div className="flex items-baseline justify-between border-b pb-6 pt-12 ">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Welcome to On-Board Page
            </h1>
            <TabsList>
              <TabsTrigger value="candidate">Candidate</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="candidate">
          <CommonForm
            formControls={candidateOnboardFormControls}
            action={createProfile}
            formData={candidateFormData}
            setFormData={setCandidateFormData}
            buttonText={"Onboard as candidate"}
            handleFileChange={handleFileChange}
            isBtnDisabled={!handleCandidateFormValid()}
            btnType={"submit"} />
        </TabsContent>
        <TabsContent value="recruiter">
          <CommonForm
            formControls={recruiterOnboardFormControls}
            action={createProfile}
            buttonText={"Onboard as recruiter"}
            formData={recruiterFormData}
            setFormData={setRecruiterFormData}
            isBtnDisabled={!handleRecuiterFormValid()}
            btnType="submit"
            handleFileChange={undefined} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
