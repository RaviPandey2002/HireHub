"use client";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { OnBoardForm } from "@components/onboard-form";

import { useState } from "react";
import {
  initialRecruiterFormData,
  recruiterOnboardFormControls,
} from "lib/utils";

export const OnBoarding = () => {
  const [currentTab, setCurrentTab] = useState("candidate");
  const [recruiterFormData, setRecruiterFormData] = useState(
    initialRecruiterFormData
  );

  const handleTabChange = (value) => {
    setCurrentTab(value)
    console.log("Handled tab change!!");
  };

  return (
    <div className="bg-white">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="w-full">
          <div className="flex items-baseline justify-between border-b pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Welcome to onboarding
            </h1>
            <TabsList>
              <TabsTrigger value="candidate">Candidate</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </div>
        </div>
        {/* <TabsContent value="candidate">
          <OnBoardForm
            formControls={candidateOnboardFormControls}
            action={createProfile}
            formData={candidateFormData}
            setFormData={setCandidateFormData}
            buttonText={"Onboard as candidate"}
            handleFileChange={handleFileChange}
            isBtnDisabled={!handleCandidateFormValid()}
          />
        </TabsContent> */}
        <TabsContent value="candidate">Candidate!!</TabsContent>
        <TabsContent value="recruiter">
          <OnBoardForm
            formControls={recruiterOnboardFormControls}
            // action={createProfile}
            buttonText={"Onboard as recruiter"}
            formData={recruiterFormData}
            setFormData={setRecruiterFormData}
            // isBtnDisabled={!handleRecuiterFormValid()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
