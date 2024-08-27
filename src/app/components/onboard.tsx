"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

import { createProfileAction } from "actions/dbActions";
import { getUser } from "actions/getUser";
import {
  candidateOnboardFormControls,
  initialCandidateFormData,
  initialRecruiterFormData,
  recruiterOnboardFormControls,
} from "lib/utils";
import { useState } from "react";
import { CommonForm } from "./common-form";

export const OnBoarding = (currentUser) => {
  const [currentTab, setCurrentTab] = useState("candidate");
  const [recruiterFormData, setRecruiterFormData] = useState(
    initialRecruiterFormData
  );
  const [candidateFormData, setCandidateFormData] = useState(
    initialCandidateFormData
  );

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
      candidateFormData.college.trim() !== "" &&
      candidateFormData.collegeLocation.trim() !== "" &&
      candidateFormData.graduatedYear.trim() !== "" &&
      candidateFormData.linkedinProfile.trim() !== "" &&
      candidateFormData.githubProfile.trim()
    );
  }

  async function createProfile() {
    const currentUser = await getUser();
    const data =
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

    const result = await createProfileAction(
      currentTab,
      data,
      "/onboard",
      "/dashboard"
    );

    if ({ result }) {
      console.log("REsulT ", result);
      // Redirect client-side
      // redirect('/settings')
    } else {
      console.error(result.message);
    }
  }

  return (
    <div className="bg-white">
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
            // handleFileChange={handleFileChange}
            btnType={undefined}
            handleFileChange={undefined} 
            isBtnDisabled={!handleCandidateFormValid()}
          />
        </TabsContent>
        <TabsContent value="recruiter">
          <CommonForm
            formControls={recruiterOnboardFormControls}
            action={createProfile}
            buttonText={"Onboard as recruiter"}
            formData={recruiterFormData}
            setFormData={setRecruiterFormData}
            isBtnDisabled={!handleRecuiterFormValid()}
            btnType={undefined}
            handleFileChange={undefined}          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
