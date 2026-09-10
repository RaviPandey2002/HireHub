import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { postNewJobAction } from "actions/postNewJobAction";
import { initialPostNewJobFormData, postNewJobFormControls } from "lib/utils";
import { useState } from "react";
import { CommonForm } from "@/components/common/common-form";
import { toast } from "@/components/ui/use-toast";
import { AppUser, JobOpening } from "types";

export const PostNewJob = ({
  user,
  jobList,
  trigger,
}: {
  user: AppUser | null;
  jobList: JobOpening[];
  trigger?: React.ReactNode;
}) => {
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    ...initialPostNewJobFormData,
    companyName: user?.recruiterInfo?.companyName || "",
  });
  function handlePostNewBtnValid() {
    return Object.keys(jobFormData).every(
      (control) => jobFormData[control].trim() !== ""
    );
  }

  function handleAddNewJob() {
    if (!user?.isPremiumUser && jobList.length >= 2) {
      toast({
        variant: "destructive",
        title: "You can post max 2 jobs.",
        description: "Please opt for membership to post more jobs",
      });
      return;
    }
    setShowJobDialog(true);
  }

  async function createNewJob() {
    const result = await postNewJobAction(
      {
        ...jobFormData,
        recruiterId: user?.id,
      },
      "/jobs"
    );

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Failed to post job",
        description: result.error,
      });
      return;
    }

    toast({
      title: "Job posted successfully!",
    });

    setJobFormData({
      ...initialPostNewJobFormData,
      companyName: user?.recruiterInfo?.companyName || "",
    });
    setShowJobDialog(false);
  }
  return (
    <div>
      {trigger ? (
        <div onClick={handleAddNewJob} className="inline-block cursor-pointer">
          {trigger}
        </div>
      ) : (
        <Button onClick={handleAddNewJob}>
          Post A Job
        </Button>
      )}
      <Dialog
        open={showJobDialog}
        onOpenChange={(open) => {
          setShowJobDialog(open);
          if (!open) {
            setJobFormData({
              ...initialPostNewJobFormData,
              companyName: user?.recruiterInfo?.companyName || "",
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post New Job</DialogTitle>
            <DialogDescription>
              Fill in the role details, requirements, and tech stack to post a new job opening.
            </DialogDescription>
          </DialogHeader>
          <CommonForm
            buttonText="Add Job"
            formData={jobFormData}
            setFormData={setJobFormData}
            formControls={postNewJobFormControls}
            isBtnDisabled={!handlePostNewBtnValid()}
            action={createNewJob}
            btnType={undefined}
            handleFileChange={undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}






