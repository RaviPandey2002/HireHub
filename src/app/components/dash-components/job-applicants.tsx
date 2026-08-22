import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "../ui/drawer"
import { ScrollArea } from "../ui/scroll-area"
import { CandidateList } from "./candidate-list"


export const JobApplicants = ({ showApplicantsDrawer,
  setShowApplicantsDrawer,
  showCurrentCandidateDetailsModal,
  setShowCurrentCandidateDetailsModal,
  currentCandidateDetails,
  setCurrentCandidateDetails,
  jobItem,
  jobApplications
}) => {

  return (
    <Drawer open={showApplicantsDrawer} onOpenChange={setShowApplicantsDrawer}>
      <DrawerContent className="max-h-[70vh]">
        <DrawerTitle className="sr-only">Job Applicants</DrawerTitle>
        <DrawerDescription className="sr-only">List of candidates who applied to this job</DrawerDescription>
        <ScrollArea className="h-full overflow-y-auto">
          <CandidateList
            currentCandidateDetails={currentCandidateDetails}
            setCurrentCandidateDetails={setCurrentCandidateDetails}
            jobApplications={jobApplications}
            showCurrentCandidateDetailsModal={showCurrentCandidateDetailsModal}
            setShowCurrentCandidateDetailsModal={
              setShowCurrentCandidateDetailsModal
            }
          />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
} 