import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { postNewJobAction } from "actions/postNewJobAction";
import { initialPostNewJobFormData, postNewJobFormControls } from "lib/utils";
import { useState } from "react";
import { CommonForm } from "@/components/common-form"
import { toast } from "@/components/ui/use-toast";
import { DialogDescription } from "@radix-ui/react-dialog";

export const PostNewJob = ({ user, jobList }) => {
  // console.log("postNewJob user ",user);
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
    await postNewJobAction(
      {
        ...jobFormData,
        recruiterId: user?.id,
      },
      "/jobs"
    );

    setJobFormData({
      ...initialPostNewJobFormData,
      companyName: user?.recruiterInfo?.companyName,
    });
    setShowJobDialog(false);
  }
  return (
    <div>
      <Button
        onClick={handleAddNewJob}
        className="disabled:opacity-60 flex h-11 items-center justify-center px-5"
      >
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
        <DialogContent className="sm:max-w-screen-md h-[600px] overflow-auto">
          <DialogHeader>
            <DialogTitle>Post New Job</DialogTitle>
            <DialogDescription/>
            <div className="grid gap-4 py-4">
              <CommonForm
                buttonText={"Add"}
                formData={jobFormData}
                setFormData={setJobFormData}
                formControls={postNewJobFormControls}
                isBtnDisabled={!handlePostNewBtnValid()}
                action={createNewJob}
                btnType={undefined}
                handleFileChange={undefined}
              />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}






