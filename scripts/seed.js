const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Load .env if present
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const prisma = new PrismaClient();

// ─── 1. DUMMY USERS CONFIGURATION ────────────────────────────────────────────
const DEFAULT_PASSWORD = "password123";

const sampleUsers = [
  {
    email: "recruiter@test.com",
    name: "Sarah Recruiter",
    role: "Recruiter",
    isPremiumUser: false,
    recruiterInfo: {
      name: "Sarah Recruiter",
      companyName: "Stripe",
      companyRole: "Head of Tech Recruiting",
    },
  },
  {
    email: "premium.recruiter@test.com",
    name: "David Talent",
    role: "Recruiter",
    isPremiumUser: true,
    memberShipType: "enterprise",
    memberShipStartDate: "2026-01-01",
    memberShipEndDate: "2027-01-01",
    recruiterInfo: {
      name: "David Talent",
      companyName: "Google",
      companyRole: "Director of Global Talent",
    },
  },
  {
    email: "candidate@test.com",
    name: "Alex Candidate",
    role: "Candidate",
    isPremiumUser: false,
    candidateInfo: {
      name: "Alex Candidate",
      currentCompany: "TechCorp Inc.",
      currentJobLocation: "San Francisco, CA",
      preferedJobLocation: "Remote / San Francisco",
      currentSalary: "12 LPA",
      noticePeriod: "30 days",
      skills: "React, TypeScript, Next.js, Node.js, Tailwind CSS, PostgreSQL",
      previousCompanies: "StartupXYZ, WebAgency",
      totalExperience: "3 years",
      collage: "UC Berkeley",
      collageLocation: "Berkeley, CA",
      graduatedYear: "2022",
      linkedinProfile: "https://linkedin.com/in/alexcandidate",
      githubProfile: "https://github.com/alexcandidate",
      resume: "",
    },
  },
  {
    email: "premium.candidate@test.com",
    name: "Elena SeniorDev",
    role: "Candidate",
    isPremiumUser: true,
    memberShipType: "teams",
    memberShipStartDate: "2026-01-01",
    memberShipEndDate: "2027-01-01",
    candidateInfo: {
      name: "Elena SeniorDev",
      currentCompany: "CloudScale Systems",
      currentJobLocation: "New York, NY",
      preferedJobLocation: "Remote",
      currentSalary: "35 LPA",
      noticePeriod: "15 days",
      skills: "Go, Kubernetes, Distributed Systems, AWS, Python, Kafka, Docker",
      previousCompanies: "Amazon, Bloomberg",
      totalExperience: "7 years",
      collage: "Columbia University",
      collageLocation: "New York, NY",
      graduatedYear: "2018",
      linkedinProfile: "https://linkedin.com/in/elenaseniordev",
      githubProfile: "https://github.com/elenaseniordev",
      resume: "",
    },
  },
];

// ─── 2. DUMMY JOBS CONFIGURATION ─────────────────────────────────────────────
const sampleJobs = [
  {
    companyName: "Google",
    title: "Senior Full Stack Engineer",
    location: "Mountain View, CA",
    type: "Full Time",
    experience: "4-6 yr",
    description: "Join Google Core Workspace team to build high-performance web applications serving billions of users worldwide.",
    skills: "React, TypeScript, Node.js, Google Cloud, GraphQL, Distributed Systems",
  },
  {
    companyName: "Stripe",
    title: "Staff Infrastructure Engineer",
    location: "San Francisco, CA",
    type: "Full Time",
    experience: "6+ yr",
    description: "Architect global payment processing infrastructure with 99.999% uptime guarantees and high throughput.",
    skills: "Go, Kubernetes, AWS, Terraform, Docker, Microservices, Distributed Systems",
  },
  {
    companyName: "Vercel",
    title: "Next.js Core Framework Engineer",
    location: "Remote",
    type: "Remote",
    experience: "3+ yr",
    description: "Design and implement features for Next.js, Turbopack, and edge computing primitives used by millions of developers.",
    skills: "Next.js, React, TypeScript, Rust, Edge Runtime, Web Performance",
  },
  {
    companyName: "Meta",
    title: "Product Designer (UI/UX)",
    location: "Menlo Park, CA",
    type: "Full Time",
    experience: "3-5 yr",
    description: "Create next-generation collaborative interfaces for Instagram and Meta platforms with clean, accessible design systems.",
    skills: "Figma, Prototyping, Design Systems, User Research, Interaction Design",
  },
  {
    companyName: "Netflix",
    title: "Senior Backend Engineer - Streaming",
    location: "Los Gatos, CA",
    type: "Full Time",
    experience: "5+ yr",
    description: "Scale high-concurrency video delivery microservices handling terabits per second of real-time media streams.",
    skills: "Java, Spring Boot, Microservices, Apache Kafka, Cassandra, AWS",
  },
  {
    companyName: "Apple",
    title: "iOS Software Engineer",
    location: "Cupertino, CA",
    type: "Full Time",
    experience: "4+ yr",
    description: "Build immersive experiences for iOS and visionOS with cutting-edge Swift and SwiftUI engineering standards.",
    skills: "Swift, SwiftUI, iOS SDK, CoreData, Objective-C, Instruments",
  },
  {
    companyName: "OpenAI",
    title: "Machine Learning Platform Engineer",
    location: "San Francisco, CA",
    type: "Full Time",
    experience: "4+ yr",
    description: "Build and maintain the distributed training and inference clusters powering state-of-the-art AI models.",
    skills: "Python, PyTorch, CUDA, Kubernetes, Ray, Triton, Distributed Training",
  },
  {
    companyName: "Airbnb",
    title: "Frontend Performance Engineer",
    location: "Remote",
    type: "Remote",
    experience: "3-5 yr",
    description: "Optimize web performance, Core Web Vitals, and client bundle sizes for millions of global travelers.",
    skills: "React, Web Performance, CSS, TypeScript, GraphQL, Lighthouse",
  },
  {
    companyName: "Linear",
    title: "Senior Product Engineer",
    location: "Remote",
    type: "Remote",
    experience: "4+ yr",
    description: "Craft extraordinarily fast, keyboard-first issue tracking software with offline-first synchronization architecture.",
    skills: "TypeScript, React, Electron, GraphQL, SQLite, Sync Engines",
  },
  {
    companyName: "Spotify",
    title: "Data Engineer - Music Discovery",
    location: "New York, NY",
    type: "Full Time",
    experience: "3+ yr",
    description: "Build batch and real-time streaming data pipelines powering personalized algorithmic playlist recommendations.",
    skills: "Python, Apache Spark, Scala, Google Cloud Platform, BigQuery, Kafka",
  },
  {
    companyName: "Microsoft",
    title: "Cloud Solutions Architect",
    location: "Redmond, WA",
    type: "Full Time",
    experience: "5+ yr",
    description: "Help enterprise customers migrate mission-critical applications to Azure with high security and resilient patterns.",
    skills: "Azure, Kubernetes, Terraform, Python, DevOps, Enterprise Architecture",
  },
  {
    companyName: "GitHub",
    title: "Site Reliability Engineer (SRE)",
    location: "Remote",
    type: "Remote",
    experience: "3+ yr",
    description: "Ensure the reliability, security, and scalability of GitHub Actions and core git repositories worldwide.",
    skills: "Docker, Kubernetes, Ruby, Go, Terraform, Linux, CI/CD, Observability",
  },
  {
    companyName: "Figma",
    title: "Web Graphics & Canvas Engineer",
    location: "San Francisco, CA",
    type: "Full Time",
    experience: "4+ yr",
    description: "Push the boundaries of in-browser rendering with WebAssembly, C++, and custom 2D vector graphics rasterization.",
    skills: "WebGL, WebAssembly, C++, TypeScript, HTML5 Canvas, Shaders",
  },
  {
    companyName: "Datadog",
    title: "Senior SRE / Observability Engineer",
    location: "New York, NY",
    type: "Full Time",
    experience: "3+ yr",
    description: "Scale high-volume telemetry ingestion engines handling trillions of events and metrics each day.",
    skills: "Go, Python, Linux Internals, Prometheus, eBPF, Time Series Databases",
  },
  {
    companyName: "Cloudflare",
    title: "Network Security Engineer",
    location: "Austin, TX",
    type: "Full Time",
    experience: "4+ yr",
    description: "Build edge security filters, WAF rules, and automated DDoS mitigation systems protecting millions of websites.",
    skills: "Rust, Go, BGP, DNS, Linux Kernel, Network Protocols, DDoS Mitigation",
  },
  {
    companyName: "Notion",
    title: "Mobile Engineer (React Native)",
    location: "San Francisco, CA",
    type: "Full Time",
    experience: "3+ yr",
    description: "Deliver snappy, native-feeling document editing and organization features on iOS and Android.",
    skills: "React Native, TypeScript, iOS, Android, Native Modules, Performance",
  },
  {
    companyName: "Amazon",
    title: "Software Development Engineer II (SDE II)",
    location: "Seattle, WA",
    type: "Full Time",
    experience: "3-5 yr",
    description: "Build robust backend microservices powering AWS developer tools and cloud orchestration services.",
    skills: "Java, AWS, DynamoDB, Systems Design, Microservices, CI/CD",
  },
  {
    companyName: "Uber",
    title: "Distributed Systems Engineer",
    location: "Sunnyvale, CA",
    type: "Full Time",
    experience: "5+ yr",
    description: "Architect low-latency matching and geospatial tracking algorithms for real-time mobility dispatching.",
    skills: "Go, Java, Apache Kafka, Redis, Geospatial Algorithms, Microservices",
  },
];

// ─── 3. MASTER SEED FUNCTION ──────────────────────────────────────────────────
async function main() {
  console.log("\n=======================================================");
  console.log("             HIREHUB MASTER SEED SCRIPT                ");
  console.log("=======================================================\n");

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // 1. Seed / Upsert Users
  console.log("--- 1. Seeding Users ---");
  const seededUsers = {};
  for (const userConfig of sampleUsers) {
    const user = await prisma.user.upsert({
      where: { email: userConfig.email },
      update: {
        name: userConfig.name,
        role: userConfig.role,
        isPremiumUser: userConfig.isPremiumUser,
        memberShipType: userConfig.memberShipType,
        memberShipStartDate: userConfig.memberShipStartDate,
        memberShipEndDate: userConfig.memberShipEndDate,
        recruiterInfo: userConfig.recruiterInfo,
        candidateInfo: userConfig.candidateInfo,
        password: hashedPassword,
      },
      create: {
        ...userConfig,
        password: hashedPassword,
      },
    });
    seededUsers[user.email] = user;
    console.log(`✓ [User] ${user.name.padEnd(20)} | Role: ${user.role.padEnd(10)} | Email: ${user.email}`);
  }

  // 2. Seed Jobs
  console.log("\n--- 2. Seeding Jobs ---");
  const defaultRecruiter = seededUsers["recruiter@test.com"] || seededUsers["premium.recruiter@test.com"];
  const premiumRecruiter = seededUsers["premium.recruiter@test.com"] || defaultRecruiter;

  let newJobsCount = 0;
  const seededJobs = [];

  for (let i = 0; i < sampleJobs.length; i++) {
    const jobConfig = sampleJobs[i];
    const recruiterId = i % 2 === 0 ? defaultRecruiter.id : premiumRecruiter.id;

    let job = await prisma.jobs.findFirst({
      where: {
        companyName: jobConfig.companyName,
        title: jobConfig.title,
      },
    });

    if (!job) {
      job = await prisma.jobs.create({
        data: {
          ...jobConfig,
          recruiterId,
        },
      });
      newJobsCount++;
      console.log(`+ Added Job: [${job.companyName}] ${job.title} (${job.location})`);
    } else {
      console.log(`= Existing Job: [${job.companyName}] ${job.title}`);
    }
    seededJobs.push(job);
  }

  // 3. Seed Applications
  console.log("\n--- 3. Seeding Applications ---");
  const candidateUser = seededUsers["candidate@test.com"];
  const premiumCandidateUser = seededUsers["premium.candidate@test.com"];

  const appPlan = [
    { candidate: candidateUser, jobIdx: 0, status: ["Applied"] },
    { candidate: candidateUser, jobIdx: 1, status: ["Applied", "Selected"] },
    { candidate: candidateUser, jobIdx: 2, status: ["Applied", "Rejected"] },
    { candidate: premiumCandidateUser, jobIdx: 3, status: ["Applied"] },
    { candidate: premiumCandidateUser, jobIdx: 4, status: ["Applied", "Selected"] },
    { candidate: premiumCandidateUser, jobIdx: 5, status: ["Applied"] },
  ];

  let newAppsCount = 0;
  for (const item of appPlan) {
    if (!item.candidate || !seededJobs[item.jobIdx]) continue;
    const targetJob = seededJobs[item.jobIdx];

    const existingApp = await prisma.application.findFirst({
      where: {
        candidateId: item.candidate.id,
        jobId: targetJob.id,
      },
    });

    if (!existingApp) {
      await prisma.application.create({
        data: {
          candidateId: item.candidate.id,
          recruiterId: targetJob.recruiterId,
          jobId: targetJob.id,
          name: item.candidate.name,
          email: item.candidate.email,
          status: item.status,
          jobApplicationDate: new Date(Date.now() - (item.jobIdx + 1) * 86400000),
        },
      });
      newAppsCount++;
      console.log(`+ Seeded Application: ${item.candidate.name} -> [${targetJob.companyName}] ${targetJob.title} (${item.status.join(", ")})`);
    } else {
      console.log(`= Existing Application: ${item.candidate.name} -> [${targetJob.companyName}] ${targetJob.title}`);
    }
  }

  // 4. Print Summary
  const totalUsers = await prisma.user.count();
  const totalJobs = await prisma.jobs.count();
  const totalApplications = await prisma.application.count();

  console.log("\n=======================================================");
  console.log("                  SEED SUMMARY                         ");
  console.log("=======================================================");
  console.log(`Total Users in DB:        ${totalUsers}`);
  console.log(`Total Jobs in DB:         ${totalJobs} (${newJobsCount} newly added)`);
  console.log(`Total Applications in DB: ${totalApplications} (${newAppsCount} newly added)`);
  console.log("\n---------------- TEST ACCOUNTS READY ------------------");
  console.log("1. Free Candidate:     candidate@test.com         | password: password123");
  console.log("2. Premium Candidate:  premium.candidate@test.com | password: password123");
  console.log("3. Free Recruiter:     recruiter@test.com         | password: password123");
  console.log("4. Premium Recruiter:  premium.recruiter@test.com | password: password123");
  console.log("=======================================================\n");
}

main()
  .catch((e) => {
    console.error("Master seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
