"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
    AlertCircle,
    Building2,
    MapPin,
    Briefcase,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    CircleDashed,
    Trash2,
    Loader2,
    Eye,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import { withdrawApplicationAction } from "actions/withdrawApplicationAction";
import { LinkedInJobDescription } from "./linkedin-job-description";
import { JobOpening, JobApplication } from "types";

export type Job = JobOpening;
export type JobApplicant = JobApplication;

interface CandidateActivityProps {
    jobList: JobOpening[];
    jobApplicants: JobApplication[];
}

function formatUtcDate(dateInput: string | Date) {
    try {
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return String(dateInput);
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
    } catch {
        return String(dateInput);
    }
}

function getApplicationStatus(statusArr: string[]): "Selected" | "Rejected" | "Under Review" {
    if (statusArr.includes("Selected")) return "Selected";
    if (statusArr.includes("Rejected")) return "Rejected";
    return "Under Review";
}

function ApplicationPipeline({
    status,
    appliedDate,
}: {
    status: "Selected" | "Rejected" | "Under Review";
    appliedDate: string | Date;
}) {
    const isSelected = status === "Selected";
    const isRejected = status === "Rejected";
    const isPending = !isSelected && !isRejected;

    const formattedDate = formatUtcDate(appliedDate);

    return (
        <div className="w-full py-3 px-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 px-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Application Pipeline</span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1" suppressHydrationWarning>
                    <Calendar className="h-3 w-3" />
                    Applied {formattedDate}
                </span>
            </div>

            <div className="relative flex items-center justify-between px-2">
                {/* Background connecting track */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-slate-200 dark:bg-slate-800 -z-0" />
                {/* Progress colored track */}
                <div
                    className={`absolute left-6 top-1/2 -translate-y-1/2 h-[2px] transition-all duration-500 -z-0 ${
                        isSelected
                            ? "w-[calc(100%-48px)] bg-emerald-500"
                            : isRejected
                            ? "w-[calc(100%-48px)] bg-rose-500"
                            : "w-1/2 bg-blue-500"
                    }`}
                />

                {/* Step 1: Submitted */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-4 ring-white dark:ring-slate-900">
                        <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="mt-1.5 text-[11px] font-semibold text-slate-900 dark:text-slate-100">
                        Applied
                    </span>
                </div>

                {/* Step 2: Under Review */}
                <div className="relative z-10 flex flex-col items-center">
                    <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm ring-4 ring-white dark:ring-slate-900 ${
                            isSelected || isRejected
                                ? "bg-emerald-500"
                                : "bg-blue-600 shadow-blue-500/50 shadow-md"
                        }`}
                    >
                        {isSelected || isRejected ? (
                            <CheckCircle2 className="h-4 w-4" />
                        ) : (
                            <Clock className="h-4 w-4" />
                        )}
                    </div>
                    <span
                        className={`mt-1.5 text-[11px] font-semibold ${
                            isPending
                                ? "text-blue-600 dark:text-blue-400 font-bold"
                                : "text-slate-900 dark:text-slate-100"
                        }`}
                    >
                        Under Review
                    </span>
                </div>

                {/* Step 3: Decision */}
                <div className="relative z-10 flex flex-col items-center">
                    <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm ring-4 ring-white dark:ring-slate-900 ${
                            isSelected
                                ? "bg-emerald-500 text-white"
                                : isRejected
                                ? "bg-rose-500 text-white"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                        }`}
                    >
                        {isSelected ? (
                            <CheckCircle2 className="h-4 w-4" />
                        ) : isRejected ? (
                            <XCircle className="h-4 w-4" />
                        ) : (
                            <CircleDashed className="h-4 w-4 text-slate-400" />
                        )}
                    </div>
                    <span
                        className={`mt-1.5 text-[11px] font-semibold ${
                            isSelected
                                ? "text-emerald-600 dark:text-emerald-400"
                                : isRejected
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-slate-400"
                        }`}
                    >
                        {isSelected ? "Selected 🎉" : isRejected ? "Not Selected" : "Decision Pending"}
                    </span>
                </div>
            </div>
        </div>
    );
}

export const CandidateActivity = ({ jobList, jobApplicants }: CandidateActivityProps) => {
    const [applicants, setApplicants] = useState<JobApplicant[]>(jobApplicants);
    const [applicationToWithdraw, setApplicationToWithdraw] = useState<{
        applicant: JobApplicant;
        job?: Job;
    } | null>(null);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [selectedJobForModal, setSelectedJobForModal] = useState<Job | null>(null);
    const { toast } = useToast();

    // Sync applicants when jobApplicants prop updates
    useEffect(() => {
        setApplicants(jobApplicants || []);
    }, [jobApplicants]);

    // Map jobs by ID for O(1) lookup
    const jobMap = useMemo(() => {
        const map = new Map<string, Job>();
        (jobList || []).forEach((j) => map.set(j.id, j));
        return map;
    }, [jobList]);

    // Categorize applications
    const { underReviewList, selectedList, rejectedList } = useMemo(() => {
        const underReview: JobApplicant[] = [];
        const selected: JobApplicant[] = [];
        const rejected: JobApplicant[] = [];

        applicants.forEach((app) => {
            const status = getApplicationStatus(app.status);
            if (status === "Selected") selected.push(app);
            else if (status === "Rejected") rejected.push(app);
            else underReview.push(app);
        });

        return { underReviewList: underReview, selectedList: selected, rejectedList: rejected };
    }, [applicants]);

    async function handleConfirmWithdraw() {
        if (!applicationToWithdraw) return;
        const appId = applicationToWithdraw.applicant.id;
        setIsWithdrawing(true);

        try {
            const res = await withdrawApplicationAction({ applicationId: appId });
            if (res?.error) {
                toast({
                    variant: "destructive",
                    title: "Withdrawal Failed",
                    description: res.error,
                });
            } else {
                setApplicants((prev) => prev.filter((a) => a.id !== appId));
                toast({
                    title: "Application Withdrawn",
                    description: `Your application for ${
                        applicationToWithdraw.job?.title || "this position"
                    } was successfully removed and 1 slot was restored.`,
                });
                setApplicationToWithdraw(null);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Please try again later.";
            toast({
                variant: "destructive",
                title: "An unexpected error occurred",
                description: message,
            });
        } finally {
            setIsWithdrawing(false);
        }
    }

    const renderApplicationCard = (app: JobApplicant) => {
        const job = jobMap.get(app.jobId);
        const status = getApplicationStatus(app.status);

        return (
            <Card
                key={app.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-shadow"
            >
                <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                                {job?.title || "Job Posting (Archived)"}
                            </h3>
                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                                <Building2 className="h-4 w-4 text-slate-400" />
                                <span>{job?.companyName || "Confidential"}</span>
                            </div>
                        </div>
                        <Badge
                            variant={
                                status === "Selected"
                                    ? "default"
                                    : status === "Rejected"
                                    ? "destructive"
                                    : "secondary"
                            }
                            className={`shrink-0 font-semibold px-2.5 py-0.5 text-xs ${
                                status === "Selected"
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : status === "Under Review"
                                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                                    : ""
                            }`}
                        >
                            {status === "Selected" ? "Selected 🎉" : status}
                        </Badge>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        {job?.location && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                            </span>
                        )}
                        {job?.type && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <Briefcase className="h-3 w-3" />
                                {job.type}
                            </span>
                        )}
                        {job?.experience && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <Sparkles className="h-3 w-3" />
                                {job.experience} yr exp
                            </span>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-5 pt-2 space-y-4">
                    <ApplicationPipeline status={status} appliedDate={app.jobApplicationDate} />
                </CardContent>

                <CardFooter className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80 mt-2 bg-slate-50/50 dark:bg-slate-900/30">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => job && setSelectedJobForModal(job)}
                        disabled={!job}
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900"
                    >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View Job Details
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setApplicationToWithdraw({ applicant: app, job })}
                        disabled={isWithdrawing}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Withdraw
                    </Button>
                </CardFooter>
            </Card>
        );
    };

    const modalMonogram = (selectedJobForModal?.companyName || "C")
        .split(" ")
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Header section */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            Application Activity
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Track the real-time hiring status of all your submitted applications.
                        </p>
                    </div>
                    <Link href="/jobs">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm">
                            Browse Open Roles
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Empty state when user has zero applications */}
            {!applicants.length ? (
                <div className="pt-10">
                    <Alert className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl">
                        <AlertCircle className="h-5 w-5 text-emerald-600" />
                        <AlertTitle className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                            No active applications
                        </AlertTitle>
                        <AlertDescription className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            You haven&apos;t applied to any roles yet. Explore hundreds of verified tech
                            opportunities and submit your application to track your progress here.
                        </AlertDescription>
                        <Link href="/jobs">
                            <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white" size="sm">
                                Explore Jobs Now
                            </Button>
                        </Link>
                    </Alert>
                </div>
            ) : (
                <Tabs defaultValue="all" className="w-full mt-6">
                    <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl h-auto flex-wrap gap-1">
                        <TabsTrigger value="all" className="rounded-lg font-semibold text-xs sm:text-sm">
                            All Applications ({applicants.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="under_review"
                            className="rounded-lg font-semibold text-xs sm:text-sm"
                        >
                            Under Review ({underReviewList.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="selected"
                            className="rounded-lg font-semibold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400"
                        >
                            Selected 🎉 ({selectedList.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="rejected"
                            className="rounded-lg font-semibold text-xs sm:text-sm"
                        >
                            Not Selected ({rejectedList.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* All Applications Tab */}
                    <TabsContent value="all" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {applicants.map((app) => renderApplicationCard(app))}
                        </div>
                    </TabsContent>

                    {/* Under Review Tab */}
                    <TabsContent value="under_review" className="mt-6">
                        {underReviewList.length === 0 ? (
                            <div className="text-center py-16 text-slate-500">
                                <Clock className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                                <p className="font-semibold text-base">No applications currently under review.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {underReviewList.map((app) => renderApplicationCard(app))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Selected Tab */}
                    <TabsContent value="selected" className="mt-6">
                        {selectedList.length === 0 ? (
                            <div className="text-center py-16 text-slate-500">
                                <Sparkles className="h-10 w-10 mx-auto text-emerald-500 mb-2" />
                                <p className="font-semibold text-base">No offers or selections yet.</p>
                                <p className="text-xs text-slate-400 mt-1">Keep applying to increase your chances!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {selectedList.map((app) => renderApplicationCard(app))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Not Selected Tab */}
                    <TabsContent value="rejected" className="mt-6">
                        {rejectedList.length === 0 ? (
                            <div className="text-center py-16 text-slate-500">
                                <CheckCircle2 className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                                <p className="font-semibold text-base">No rejected applications.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {rejectedList.map((app) => renderApplicationCard(app))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            )}

            {/* Withdraw Application Confirmation Modal */}
            <Dialog
                open={!!applicationToWithdraw}
                onOpenChange={(open) => !open && !isWithdrawing && setApplicationToWithdraw(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                            Withdraw Application?
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 pt-2">
                            Are you sure you want to withdraw your application for{" "}
                            <span className="font-bold text-slate-900 dark:text-white">
                                {applicationToWithdraw?.job?.title || "this position"}
                            </span>{" "}
                            at{" "}
                            <span className="font-bold text-slate-900 dark:text-white">
                                {applicationToWithdraw?.job?.companyName || "the hiring company"}
                            </span>
                            ?
                            <br />
                            <br />
                            This will remove your submission from the recruiter&apos;s pipeline and{" "}
                            <span className="text-emerald-600 font-semibold">
                                restore 1 application slot
                            </span>{" "}
                            to your account.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-end mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setApplicationToWithdraw(null)}
                            disabled={isWithdrawing}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmWithdraw}
                            disabled={isWithdrawing}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                        >
                            {isWithdrawing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Withdrawing...
                                </>
                            ) : (
                                "Confirm Withdrawal"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Centered Job Details Modal Dialog */}
            <Dialog
                open={!!selectedJobForModal}
                onOpenChange={(open) => !open && setSelectedJobForModal(null)}
            >
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-6">
                    <DialogHeader className="pr-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-start gap-3.5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-extrabold text-base shadow-sm">
                                {modalMonogram}
                            </div>
                            <div className="min-w-0 flex-1">
                                <DialogTitle className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {selectedJobForModal?.title}
                                </DialogTitle>
                                <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-600 dark:text-slate-400">
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                    <span>{selectedJobForModal?.companyName}</span>
                                </div>
                            </div>
                        </div>
                        <DialogDescription className="sr-only">
                            Detailed requirements and description for {selectedJobForModal?.title} at {selectedJobForModal?.companyName}
                        </DialogDescription>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-2">
                            {selectedJobForModal?.location && (
                                <Badge variant="secondary" className="gap-1 text-xs">
                                    <MapPin className="h-3 w-3" />
                                    {selectedJobForModal.location}
                                </Badge>
                            )}
                            {selectedJobForModal?.type && (
                                <Badge variant="outline" className="gap-1 text-xs">
                                    <Briefcase className="h-3 w-3" />
                                    {selectedJobForModal.type}
                                </Badge>
                            )}
                            {selectedJobForModal?.experience && (
                                <Badge variant="outline" className="gap-1 text-xs">
                                    <Sparkles className="h-3 w-3" />
                                    {selectedJobForModal.experience} yr exp
                                </Badge>
                            )}
                        </div>
                    </DialogHeader>

                    {/* LinkedIn Style Job Description & Highlights */}
                    <div className="mt-5">
                        <LinkedInJobDescription
                            description={selectedJobForModal?.description || ""}
                            skills={selectedJobForModal?.skills}
                            type={selectedJobForModal?.type}
                            location={selectedJobForModal?.location}
                            experience={selectedJobForModal?.experience}
                            companyName={selectedJobForModal?.companyName}
                        />
                    </div>

                    <DialogFooter className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedJobForModal(null)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

