import { CommonCard } from "../common/common-card";
import { Button } from "../ui/button";
import { JobIcon } from "./job-icon";



export const RecruiterJobCard = ({ jobItem, jobApplications }) => {
  return (<div>
    <CommonCard
      icon={<JobIcon />}
      title={jobItem?.title}
      footerContent={
        <Button className="flex h-11 items-center justify-center px-5">
          {
            jobApplications.filter((item) => item?.jobId === jobItem?.id).length > 1 ? `${jobApplications.filter((item) => item?.jobId === jobItem?.id).length} Applicants` :
              `${jobApplications.filter((item) => item?.jobId === jobItem?.id).length} Applicant`

          }
        </Button>
      }
      description={""}
    />
  </div>)
};
