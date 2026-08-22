"use client";

import { getCandidateDetailsByIDAction } from "actions/getCandidateDetailsByIDAction";
import { updateJobApplicationAction } from "actions/updateJobApplicationAction";
import supabaseClient from "lib/supabaseClient";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

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
            (item) => item.candidateId === currentCandidateDetails?.id
        );
        const jobApplicantsToUpdate = {
            ...cpyJobApplicants[indexOfCurrentJobApplicant],
            status: ["Applied", getCurrentStatus]
        }
        await updateJobApplicationAction(jobApplicantsToUpdate, "/jobs");
    }

    const info = currentCandidateDetails?.candidateInfo;

    return (
        <>
            <div className="grid grid-cols-1 gap-3 p-6 md:grid-cols-2 lg:grid-cols-3">
                {jobApplications && jobApplications.length > 0
                    ? jobApplications.map((jobApplicantItem) => (
                        <div
                            key={jobApplicantItem.id}
                            className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3"
                        >
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {jobApplicantItem?.name}
                            </h3>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleFetchCandidateDetails(jobApplicantItem?.candidateId)}
                            >
                                View Profile
                            </Button>
                        </div>
                    ))
                    : <p className="col-span-full text-sm text-gray-500 dark:text-gray-400">No applicants yet.</p>
                }
            </div>

            <Dialog
                open={showCurrentCandidateDetailsModal}
                onOpenChange={() => {
                    setCurrentCandidateDetails(null);
                    setShowCurrentCandidateDetailsModal(false);
                }}
            >
                <DialogContent className="max-w-lg">
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {info?.name}
                    </DialogTitle>

                    <div className="space-y-4 mt-2">
                        {/* Identity */}
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{info?.currentCompany}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{currentCandidateDetails?.email} · {info?.currentJobLocation}</p>
                        </div>

                        {/* Quick stats */}
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{info?.totalExperience} yrs exp</Badge>
                            <Badge variant="outline">{info?.currentSalary} LPA</Badge>
                            <Badge variant="outline">{info?.noticePeriod} days notice</Badge>
                        </div>

                        {/* Skills */}
                        {info?.skills && (
                            <div>
                                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Skills</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {info.skills.split(",").map((s, i) => (
                                        <Badge key={i} variant="secondary">{s.trim()}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Previous companies */}
                        {info?.previousCompanies && (
                            <div>
                                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Previous Companies</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {info.previousCompanies.split(",").map((c, i) => (
                                        <Badge key={i} variant="outline">{c.trim()}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button variant="outline" onClick={handlePreviewResume}>
                            Resume
                        </Button>
                        <Button
                            onClick={() => handleUpdateJobStatus("Selected")}
                            disabled={
                                jobApplications
                                    .find((item) => item.candidateId === currentCandidateDetails?.id)
                                    ?.status.includes("Selected") ?? false
                            }
                        >
                            {jobApplications
                                .find((item) => item.candidateId === currentCandidateDetails?.id)
                                ?.status.includes("Selected")
                                ? "Selected ✓"
                                : "Select"}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleUpdateJobStatus("Rejected")}
                            disabled={
                                jobApplications
                                    .find((item) => item.candidateId === currentCandidateDetails?.id)
                                    ?.status.includes("Rejected") ?? false
                            }
                        >
                            {jobApplications
                                .find((item) => item.candidateId === currentCandidateDetails?.id)
                                ?.status.includes("Rejected")
                                ? "Rejected ✗"
                                : "Reject"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
