import { getCandidateDetailsByIDAction } from "actions/getCandidateDetailsByIDAction";
import { updateJobApplicationAction } from "actions/updateJobApplicationAction";
import supabaseClient from "lib/supabaseClient";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { DrawerDescription } from "../ui/drawer";

export const CandidateList = ({
    currentCandidateDetails,
    setCurrentCandidateDetails,
    jobApplications,
    showCurrentCandidateDetailsModal,
    setShowCurrentCandidateDetailsModal
}) => {

    async function handleFetchCandidateDetails(candidateId) {
        const data = await getCandidateDetailsByIDAction(candidateId);
        if (data) {
            setCurrentCandidateDetails(data);
            setShowCurrentCandidateDetailsModal(true);
        }
    }

    // console.log("currentCandidateDetails?.candidateInfo?.resume ", currentCandidateDetails?.candidateInfo?.resume);

    function handlePreviewResume() {
        const { data } = supabaseClient.storage
            .from("hirehub-bucket-public")
            .getPublicUrl(currentCandidateDetails?.candidateInfo?.resume);

        const a = document.createElement("a");
        a.href = data?.publicUrl;
        a.setAttribute("download", "Resume.pdf");
        a.setAttribute("target", "_blank");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    async function handleUpdateJobStatus(getCurrentStatus) {
        let cpyJobApplicants = [...jobApplications];
        const indexOfCurrentJobApplicant = cpyJobApplicants.findIndex(
            (item) => item.candidateId
                === currentCandidateDetails?.id
        );
        const jobApplicantsToUpdate = {
            ...cpyJobApplicants[indexOfCurrentJobApplicant],
            status: ["Applied", getCurrentStatus]
        }
        console.log("jobApplicantsToUpdate", jobApplicantsToUpdate)

        await updateJobApplicationAction(jobApplicantsToUpdate, "/jobs");
    }

    console.log("candidateList jobApplications", jobApplications);

    return (
        <>
            <div className="grid grid-cols-1 gap-3 p-10 md:grid-cols-2 lg:grid-cols-3">
                {jobApplications && jobApplications.length > 0
                    ? jobApplications.map((jobApplicantItem) => (
                        <div key={jobApplicantItem.id} className="bg-white shadow-lg w-full max-w-sm rounded-lg overflow-hidden mx-auto mt-4">
                            <div className="px-4 my-6 flex justify-between items-center">
                                <h3 className="text-lg font-bold dark:text-black">
                                    {jobApplicantItem?.name}
                                </h3>
                                <Button
                                    onClick={() =>
                                        handleFetchCandidateDetails(
                                            jobApplicantItem?.candidateId
                                        )
                                    }
                                    className="dark:bg-[#fffa27]  flex h-11 items-center justify-center px-5"
                                >
                                    View Profile
                                </Button>
                            </div>
                        </div>
                    ))
                    :
                    <> No Applicants</>
                }
            </div>
            <Dialog
                open={showCurrentCandidateDetailsModal}
                onOpenChange={() => {
                    setCurrentCandidateDetails(null);
                    setShowCurrentCandidateDetailsModal(false);
                }}
            >
                <DrawerDescription />
                <DialogContent>
                    <DialogTitle />
                    <div>
                        <h1 className="text-2xl font-bold dark:text-white text-black">
                            {currentCandidateDetails?.candidateInfo?.name},{" "}
                            {currentCandidateDetails?.email}
                        </h1>
                        <p className="text-xl font-medium dark:text-white text-black">
                            {currentCandidateDetails?.candidateInfo?.currentCompany}
                        </p>
                        <p className="text-sm font-normal dark:text-white text-black">
                            {currentCandidateDetails?.candidateInfo?.currentJobLocation}
                        </p>
                        <p className="dark:text-white">
                            Total Experience:
                            {currentCandidateDetails?.candidateInfo?.totalExperience} Years
                        </p>
                        <p className="dark:text-white">
                            Salary: {currentCandidateDetails?.candidateInfo?.currentSalary}{" "}
                            LPA
                        </p>
                        <p className="dark:text-white">
                            Notice Period:{" "}
                            {currentCandidateDetails?.candidateInfo?.noticePeriod} Days
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                            <h1 className="dark:text-white">Previous Companies</h1>
                            <div className="flex flex-wrap items-center gap-4">
                                {currentCandidateDetails?.candidateInfo?.previousCompanies
                                    .split(",")
                                    .map((skillItem, index) => (
                                        <div key={index} className="w-[100px] dark:bg-white flex justify-center items-center h-[35px] bg-black rounded-[4px]">
                                            <h2 className="text-[13px]  dark:text-black font-medium text-white">
                                                {skillItem}
                                            </h2>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-6">
                            {currentCandidateDetails?.candidateInfo?.skills
                                .split(",")
                                .map((skillItem, index) => (
                                    <div key={index} className="w-[100px] dark:bg-white flex justify-center items-center h-[35px] bg-black rounded-[4px]">
                                        <h2 className="text-[13px] dark:text-black font-medium text-white">
                                            {skillItem}
                                        </h2>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handlePreviewResume}
                            className=" flex h-11 items-center justify-center px-5"
                        >
                            Resume
                        </Button>
                        <Button
                            onClick={() => handleUpdateJobStatus("Selected")}
                            className=" disabled:opacity-65 flex h-11 items-center justify-center px-5"
                            disabled={
                                jobApplications
                                    .find(
                                        (item) =>
                                            item.candidateId === currentCandidateDetails?.id
                                    )
                                    ?.status.includes("Selected")
                                    ? true
                                    : false
                            }
                        >
                            {jobApplications
                                .find(
                                    (item) =>
                                        item.candidateId === currentCandidateDetails?.id
                                )
                                ?.status.includes("Selected")
                                ? "Selected"
                                : "Select"}
                        </Button>
                        <Button
                            onClick={() => handleUpdateJobStatus("Rejected")}
                            className=" disabled:opacity-65 flex h-11 items-center justify-center px-5"
                            disabled={
                                jobApplications
                                    .find(
                                        (item) =>
                                            item.candidateId === currentCandidateDetails?.id
                                    )
                                    ?.status.includes("Rejected")
                                    ? true
                                    : false
                            }
                        >
                            {jobApplications
                                .find(
                                    (item) =>
                                        item.candidateId === currentCandidateDetails?.id
                                )
                                ?.status.includes("Rejected")
                                ? "Rejected"
                                : "Reject"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}