import * as z from "zod"

// ── Job posting ─────────────────────────────────────────────────────────────
export const PostNewJobSchema = z.object({
    companyName: z.string().min(1, "Company name is required").max(100),
    title:       z.string().min(1, "Title is required").max(100),
    type:        z.string().min(1, "Job type is required").max(50),
    location:    z.string().min(1, "Location is required").max(100),
    experience:  z.string().min(1, "Experience is required").max(50),
    description: z.string().min(1, "Description is required").max(5000),
    skills:      z.string().min(1, "Skills are required").max(500),
    recruiterId: z.string().min(1),
})

// ── Job application ──────────────────────────────────────────────────────────
export const CreateJobApplicationSchema = z.object({
    recruiterId:        z.string().min(1),
    candidateId:        z.string().min(1),
    name:               z.string().min(1, "Name is required").max(100),
    email:              z.string().email("Invalid email"),
    status:             z.array(z.string()).min(1),
    jobId:              z.string().min(1),
    jobApplicationDate: z.date(),
})

// ── Update application status ────────────────────────────────────────────────
export const UpdateJobApplicationSchema = z.object({
    id:     z.string().min(1),
    status: z.array(z.string()).min(1),
})

// ── Onboarding profile ───────────────────────────────────────────────────────
export const RecruiterProfileSchema = z.object({
    name:        z.string().min(1, "Name is required").max(100),
    companyName: z.string().min(1, "Company name is required").max(100),
    companyRole: z.string().min(1, "Company role is required").max(100),
})

export const CandidateProfileSchema = z.object({
    resume:              z.string(),
    name:                z.string().min(1, "Name is required").max(100),
    currentCompany:      z.string().min(1).max(100),
    currentJobLocation:  z.string().min(1).max(100),
    preferedJobLocation: z.string().min(1).max(100),
    currentSalary:       z.string().min(1).max(50),
    noticePeriod:        z.string().min(1).max(50),
    skills:              z.string().min(1).max(500),
    previousCompanies:   z.string().min(1).max(500),
    totalExperience:     z.string().min(1).max(50),
    collage:             z.string().min(1).max(100),
    collageLocation:     z.string().min(1).max(100),
    graduatedYear:       z.string().min(1).max(10),
    linkedinProfile:     z.string().url("Invalid LinkedIn URL"),
    githubProfile:       z.string().url("Invalid GitHub URL"),
})

// ── Auth ─────────────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" })
        .transform((val) => val.toLowerCase().trim()),
    password: z.string()
        .min(1, { message: "Password is required" }),
})

export const RegisterSchema = z.object({
    name: z.string()
        .min(1, { message: "Name is required" })
        .trim(),
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" })
        .transform((val) => val.toLowerCase().trim()),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters" }),
})
