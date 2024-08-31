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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DEFAULT_LOGIN_REDIRECT, SUPERBASE_URL } from "routes";
import { CommonForm } from "./common/common-form";

// SUPER-BASE-----------------------
import { createClient } from "@supabase/supabase-js";
import { useSession } from "next-auth/react";

const superbaseUrl = "https://mlrcuztzocwewzkujmtf.supabase.co";
const superbaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1scmN1enR6b2N3ZXd6a3VqbXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5MzA5MTIsImV4cCI6MjA0MDUwNjkxMn0.JGyDm2y1_m6e7zWVJs7IwpetN24Ybzm8bmjVxIwplpw"


const superbaseClient = createClient(superbaseUrl,
  superbaseKey)

export const OnBoarding = ({ currentUser }) => {
  const { data: session, update, status } = useSession();
  console.log("session update status", session,status)
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
    console.log("onboard file", e.target.files);
    setFile(e.target.files[0]);
  }

  async function handleUploadPdfToSuperbase() {
    const { data, error } = await superbaseClient.storage.from('job-board').upload(`/public/${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (data) {
      setCandidateFormData({
        ...candidateFormData,
        resume: data.path
      })
    }
  }

  useEffect(() => {
    if (file) handleUploadPdfToSuperbase();
  }, [file])


  const router = useRouter();
  async function createProfile() {
    const formData =
      currentTab === "candidate"
        ? {
          candidateInfo: candidateFormData,
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
      router.refresh();
      router.push(DEFAULT_LOGIN_REDIRECT);
    }
    else {
      console.error(response.message);
    }
  }


  return (
    <div className="bg-white ml-7 mr-7">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="w-full">
          <div className="flex items-baseline justify-between border-b pb-6 pt-24">
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
