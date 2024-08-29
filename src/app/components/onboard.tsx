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
import { useState } from "react";
import { DEFAULT_LOGIN_REDIRECT } from "routes";
import { CommonForm } from "./common-form";

export const OnBoarding = ({ currentUser }) => {
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
    if(response && response.success)
    {
      router.refresh();
      router.push(DEFAULT_LOGIN_REDIRECT);
    }
    else{
      console.error(response.message);
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
            btnType="submit"
            handleFileChange={undefined} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
