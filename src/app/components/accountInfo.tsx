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

    return (<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-baseline dark:border-white justify-between pb-6 border-b pt-2">
            <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold dark:text-white tracking-tight text-gray-950">
                    Account Details
                </h1>
                <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {user?.role}
                </span>
            </div>
        </div>
        <div className="pt-6 pb-24">
            <div className="container mx-auto p-0 max-w-2xl">
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