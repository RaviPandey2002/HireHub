export type UserRole = "Candidate" | "Recruiter" | "OnBoarding";

export interface CandidateInfo {
  name?: string;
  currentCompany?: string;
  currentJobLocation?: string;
  preferedJobLocation?: string;
  currentSalary?: string;
  noticePeriod?: string;
  skills?: string;
  previousCompanies?: string;
  totalExperience?: string;
  collage?: string;
  collageLocation?: string;
  graduatedYear?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  resume?: string;
  savedJobs?: string[]; // array of saved Job IDs
}

export interface RecruiterInfo {
  name?: string;
  companyName?: string;
  companyRole?: string;
}

export interface AppUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
  isPremiumUser?: boolean | null;
  memberShipType?: string | null;
  memberShipStartDate?: string | null;
  memberShipEndDate?: string | null;
  candidateInfo?: CandidateInfo | null;
  recruiterInfo?: RecruiterInfo | null;
}

export interface JobOpening {
  id: string;
  companyName: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  skills: string;
  recruiterId: string;
  status?: string | null; // "Active" | "Closed"
  applicantCount?: number;
}

export interface JobApplication {
  id: string;
  recruiterId: string;
  candidateId: string;
  name: string;
  email: string;
  status: string[];
  jobId: string;
  jobApplicationDate: string | Date;
}

export interface EnrichedApplicant {
  id: string;
  candidateId: string;
  jobId: string;
  name: string;
  email: string;
  status: string[];
  jobApplicationDate: string | Date;
  job?: {
    id: string;
    title: string;
    companyName: string;
    location?: string;
    type?: string;
  } | null;
  candidate?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    candidateInfo?: CandidateInfo | null;
  } | null;
}

export interface RecruiterDashboardStats {
  totalJobs: number;
  totalApplications: number;
  selected: number;
  rejected: number;
  pending: number;
  recentApplications: Array<{
    id: string;
    name: string;
    email: string;
    jobId: string;
    status: string[];
    jobApplicationDate: string;
    job?: {
      title?: string;
      companyName?: string;
      location?: string;
      type?: string;
    } | null;
  }>;
  postedJobs?: JobOpening[];
}

export interface CandidateDashboardStats {
  total: number;
  selected: number;
  rejected: number;
  applied: number;
  recentApplications: Array<{
    id: string;
    jobId: string;
    status: string[];
    jobApplicationDate: string;
    job?: {
      id?: string;
      title: string;
      companyName: string;
      location?: string;
      type?: string;
    } | null;
  }>;
}

export interface CompanySummary {
  companyName: string;
  location: string;
  jobCount: number;
}
