"use client"

import { useEffect, useState } from "react";
import { CommonForm } from "./common/common-form"
import { candidateOnboardFormControls, initialCandidateAccountFormData, initialCandidateFormData, initialRecruiterFormData, recruiterOnboardFormControls } from "lib/utils";
import { updateProfile } from "actions/updateProfile";

export const AccountInfo = ({ user }) => {
    const [candidateFormData, setCandidateFormData] = useState(
        initialCandidateAccountFormData
    );
    const [recruiterFormData, setRecruiterFormData] = useState(
        initialRecruiterFormData
    );

    useEffect(() => {
        if (user?.role === "Recruiter")
            setRecruiterFormData(user?.recruiterInfo);

        if (user?.role === "Candidate")
            setCandidateFormData(user?.candidateInfo);
    }, [user]);
    
    async function handleUpdateAccount() {
        await updateProfile( user, user?.role === "Candidate" ? candidateFormData : recruiterFormData , "/account")
    }

    return (<div className="mx-auto max-w-7xl">
        <div className="flex items-baseline dark:border-white justify-between pb-6 border-b pt-10">
            <h1 className="text-4xl font-bold dark:text-white tracking-tight text-gray-950">
                Account Details
            </h1>
        </div>
        <div className="py-20 pb-24 pt-6">
            <div className="container mx-auto p-0 space-y-8">
                <CommonForm
                    action={handleUpdateAccount}
                    formControls={user?.role === "Candidate"
                        ? candidateOnboardFormControls.filter(
                            (formControl) => formControl.name !== "resume"
                        )
                        : recruiterOnboardFormControls}
                    formData={user?.role === "Candidate"
                        ? candidateFormData
                        : recruiterFormData}
                    setFormData={user?.role === "Candidate"
                        ? setCandidateFormData
                        : setRecruiterFormData}
                    buttonText="Update Profile"
                    isBtnDisabled={undefined}
                    btnType={undefined}
                    handleFileChange={undefined} />

            </div>
        </div>
    </div>)
}