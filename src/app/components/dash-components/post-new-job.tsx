import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { postNewJobAction } from "actions/postNewJobAction";
import { initialPostNewJobFormData, postNewJobFormControls } from "lib/utils";
import { useState } from "react";
import { CommonForm } from "@/components/common/common-form"
import { toast } from "@/components/ui/use-toast";

export const PostNewJob = ({ user, jobList }) => {

  const [showJobDialog, setShowJobDialog] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    ...initialPostNewJobFormData,
    companyName: user?.recruiterInfo?.companyName,
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
      companyName: user?.recruiterInfo?.companyName,
    });
    setShowJobDialog(false);
  }
  return (
    <div>
      <Button onClick={handleAddNewJob}>
        Post A Job
      </Button>
      <Dialog
        open={showJobDialog}
        onOpenChange={() => {
          setShowJobDialog(false);
          setJobFormData({
            ...initialPostNewJobFormData,
            companyName: user.recruiterInfo.companyName,
          });
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post New Job</DialogTitle>
            <DialogDescription />
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






