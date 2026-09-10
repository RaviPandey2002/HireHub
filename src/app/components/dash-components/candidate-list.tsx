"use client";

import { useState } from "react";
import { getCandidateDetailsByIDAction } from "actions/getCandidateDetailsByIDAction";
import { updateJobApplicationAction } from "actions/updateJobApplicationAction";
import { getResumeUrlAction } from "actions/getResumeUrlAction";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ExternalLink } from "lucide-react";

export const CandidateList = ({
    currentCandidateDetails,
    setCurrentCandidateDetails,
    jobApplications,
    showCurrentCandidateDetailsModal,
    setShowCurrentCandidateDetailsModal
}: {
    currentCandidateDetails: any;
    setCurrentCandidateDetails: (d: any) => void;
    jobApplications: any[];
    showCurrentCandidateDetailsModal: boolean;
    setShowCurrentCandidateDetailsModal: (b: boolean) => void;
}) => {
    const { toast } = useToast();
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
    const [isLoadingResume, setIsLoadingResume] = useState(false);

    async function handleOpenCandidateModal(applicantItem: any) {
        setSelectedApplication(applicantItem);
        const data = await getCandidateDetailsByIDAction(applicantItem?.candidateId);
        if (data) {
            setCurrentCandidateDetails(data);
            setShowCurrentCandidateDetailsModal(true);
        }
    }

    async function handlePreviewResume() {
        if (!currentCandidateDetails?.id) return;
        setIsLoadingResume(true);

        try {
            const result = await getResumeUrlAction(currentCandidateDetails.id);
            if (result?.error) {
                toast({
                    variant: "destructive",
                    title: "Resume unavailable",
                    description: result.error,
                });
            } else if (result?.url) {
                window.open(result.url, "_blank");
            }
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err?.message || "Failed to retrieve secure resume link.",
            });
        } finally {
            setIsLoadingResume(false);
        }
    }

    async function handleUpdateJobStatus(getCurrentStatus: "Selected" | "Rejected") {
        if (!selectedApplication?.id) return;
        setIsUpdatingStatus(getCurrentStatus);

        try {
            const result = await updateJobApplicationAction(
                {
                    id: selectedApplication.id,
                    status: ["Applied", getCurrentStatus],
                },
                "/jobs"
            );

            if (result?.error) {
                toast({
                    variant: "destructive",
                    title: "Failed to update status",
                    description: result.error,
                });
            } else {
                setSelectedApplication((prev: any) => ({
                    ...prev,
                    status: ["Applied", getCurrentStatus],
                }));
                toast({
                    title: `Candidate ${getCurrentStatus.toLowerCase()}!`,
                    description: `Application status updated to ${getCurrentStatus}.`,
                });
            }
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err?.message || "Something went wrong.",
            });
        } finally {
            setIsUpdatingStatus(null);
        }
    }

    const info = currentCandidateDetails?.candidateInfo;
    const currentStatus = selectedApplication?.status ?? [];
    const isSelected = currentStatus.includes("Selected");
    const isRejected = currentStatus.includes("Rejected");

    return (
        <>
            <div className="grid grid-cols-1 gap-3 p-6 md:grid-cols-2 lg:grid-cols-3">
                {jobApplications && jobApplications.length > 0
                    ? jobApplications.map((jobApplicantItem) => {
                        const appStatus = jobApplicantItem?.status ?? [];
                        const itemSelected = appStatus.includes("Selected");
                        const itemRejected = appStatus.includes("Rejected");

                        return (
                            <div
                                key={jobApplicantItem.id}
                                className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3"
                            >
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {jobApplicantItem?.name}
                                    </h3>
                                    <div>
                                        {itemSelected ? (
                                            <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                                Selected ✓
                                            </span>
                                        ) : itemRejected ? (
                                            <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
                                                Rejected ✗
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                                                Applied
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleOpenCandidateModal(jobApplicantItem)}
                                >
                                    View Profile
                                </Button>
                            </div>
                        );
                    })
                    : <p className="col-span-full text-sm text-gray-500 dark:text-gray-400">No applicants yet.</p>
                }
            </div>

            <Dialog
                open={showCurrentCandidateDetailsModal}
                onOpenChange={() => {
                    setCurrentCandidateDetails(null);
                    setSelectedApplication(null);
                    setShowCurrentCandidateDetailsModal(false);
                }}
            >
                <DialogContent className="max-w-lg">
                    <DialogDescription className="sr-only">
                        Candidate profile and resume review
                    </DialogDescription>
                    <div className="flex items-center justify-between gap-3 pr-6">
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            {info?.name}
                        </DialogTitle>
                        {isSelected ? (
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Selected ✓</Badge>
                        ) : isRejected ? (
                            <Badge variant="destructive">Rejected ✗</Badge>
                        ) : (
                            <Badge variant="outline">Applied</Badge>
                        )}
                    </div>

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
                                    {info.skills.split(",").map((s: string, i: number) => (
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
                                    {info.previousCompanies.split(",").map((c: string, i: number) => (
                                        <Badge key={i} variant="outline">{c.trim()}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={handlePreviewResume}
                            disabled={isLoadingResume}
                            className="gap-1.5"
                        >
                            {isLoadingResume ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Resume
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={() => handleUpdateJobStatus("Selected")}
                            disabled={isSelected || isUpdatingStatus !== null}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {isUpdatingStatus === "Selected" ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Selecting...
                                </>
                            ) : isSelected ? (
                                "Selected ✓"
                            ) : (
                                "Select"
                            )}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleUpdateJobStatus("Rejected")}
                            disabled={isRejected || isUpdatingStatus !== null}
                        >
                            {isUpdatingStatus === "Rejected" ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Rejecting...
                                </>
                            ) : isRejected ? (
                                "Rejected ✗"
                            ) : (
                                "Reject"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
