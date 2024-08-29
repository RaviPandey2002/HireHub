import { CommonCard } from "../common/common-card";
import { Button } from "../ui/button";
import { JobIcon } from "./job-icon";



export const RecruiterJobCard = ({ jobItem }) => {
  return (<div>
    <CommonCard
    icon={<JobIcon/>}
    title={jobItem?.title}
    footerContent={
      <Button className="flex h-11 items-center justify-center px-5">
        10 Applicants
      </Button>
    }
    description={""}
    />
  </div>)
};
