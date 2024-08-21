"use client";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { OnBoardForm } from "@components/onboard-form";

import { useState } from "react";
import {
  initialRecruiterFormData,
  recruiterOnboardFormControls,
  candidateOnboardFormControls,
  initialCandidateFormData,
} from "lib/utils";
import { createProfileAction } from "actions/dbActions";
import { getUser } from "actions/getUser";

export const OnBoarding = () => {
  const [currentTab, setCurrentTab] = useState("candidate");
  const [recruiterFormData, setRecruiterFormData] = useState(
    initialRecruiterFormData
  );
  const [candidateFormData, setCandidateFormData] = useState(
    initialCandidateFormData
  );

  const handleTabChange = (value) => {
    setCurrentTab(value);
    console.log("Handled tab change!!");
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
    console.log("CURRNET_USER: ", currentUser);
    const data =
      currentTab === "candidate"
        ? {
            candidateInfo: candidateFormData,
            role: "Candidate",
            isPremiumUser: false,
            id: currentUser.id,
            email: currentUser.email,
          }
        : {
            recruiterInfo: recruiterFormData,
            role: "Recruiter",
            isPremiumUser: false,
            id: currentUser.id,
            email: currentUser.email,
          };

    await createProfileAction(currentTab, data, "/onboard", "/settings");
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
          <OnBoardForm
            formControls={candidateOnboardFormControls}
            action={createProfile}
            formData={candidateFormData}
            setFormData={setCandidateFormData}
            buttonText={"Onboard as candidate"}
            // handleFileChange={handleFileChange}
            isBtnDisabled={!handleCandidateFormValid()}
          />
        </TabsContent>
        <TabsContent value="recruiter">
          <OnBoardForm
            formControls={recruiterOnboardFormControls}
            action={createProfile}
            buttonText={"Onboard as recruiter"}
            formData={recruiterFormData}
            setFormData={setRecruiterFormData}
            isBtnDisabled={!handleRecuiterFormValid()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
