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
    description: `About the Role:
Join Google's Core Workspace team to engineer high-performance web applications serving billions of users worldwide. You will collaborate with cross-functional teams of designers, researchers, and product managers to define and deliver the future of cloud productivity.

Key Responsibilities:
• Architect, build, and maintain mission-critical web applications with low latency and high availability.
• Collaborate with design and product teams to build accessible, delightful user experiences.
• Drive code health, test automation, and engineering excellence across distributed services.
• Mentor junior engineers and champion best practices in web platform development.

Qualifications & Requirements:
• 4+ years of professional software development experience with React, TypeScript, and Node.js.
• Strong foundation in algorithms, data structures, and distributed cloud systems.
• Proven track record delivering large-scale, production-ready web applications.
• Bachelor's or Master's degree in Computer Science or equivalent practical experience.`,
    skills: "React, TypeScript, Node.js, Google Cloud, GraphQL, Distributed Systems",
  },
  {
    companyName: "Stripe",
    title: "Staff Infrastructure Engineer",
    location: "San Francisco, CA",
    type: "Full Time",
    experience: "6+ yr",
    description: `About the Role:
Stripe builds economic infrastructure for the internet. As a Staff Infrastructure Engineer, you will architect and scale global payment processing infrastructure with 99.999% uptime guarantees, ensuring millions of businesses transact seamlessly across 195+ countries.

Key Responsibilities:
• Lead the architectural direction of Stripe's distributed payment ingestion and settlement engines.
• Harden reliability, disaster recovery, and multi-region failover across AWS and Kubernetes clusters.
• Partner with security and compliance teams to ensure strict PCI-DSS and financial regulatory adherence.
• Elevate team engineering velocity through tooling, automated canary deployments, and chaos engineering.

Qualifications & Requirements:
• 6+ years of experience engineering high-throughput, distributed infrastructure in Go or Java.
• Deep expertise with Kubernetes, Terraform, AWS, and Linux network virtualization.
• Demonstrated success operating zero-downtime distributed databases and microservices at scale.
• Passion for building robust systems with meticulous operational rigor.`,
    skills: "Go, Kubernetes, AWS, Terraform, Docker, Microservices, Distributed Systems",
  },
  {
    companyName: "Vercel",
    title: "Next.js Core Framework Engineer",
    location: "Remote",
    type: "Remote",
    experience: "3+ yr",
    description: `About the Role:
At Vercel, we make the web faster and more collaborative. You will join the Next.js Core Framework team, directly designing and implementing features for Next.js, Turbopack, and edge computing primitives utilized by millions of developers globally.

Key Responsibilities:
• Research, design, and implement core framework features in Next.js, React Server Components, and Turbopack.
• Optimize bundling performance, compilation speeds, and streaming SSR latencies.
• Triage community issues and collaborate with open-source contributors on GitHub.
• Author comprehensive technical documentation and RFCs guiding future web standards.

Qualifications & Requirements:
• 3+ years experience with React internals, TypeScript, and modern JavaScript bundlers.
• Working knowledge of Rust or systems programming is a strong plus for Turbopack development.
• Deep understanding of browser networking, HTTP/3, and Edge Computing architectures.
• Active contributor or enthusiasm for open-source developer tooling.`,
    skills: "Next.js, React, TypeScript, Rust, Edge Runtime, Web Performance",
  },
  {
    companyName: "Meta",
    title: "Product Designer (UI/UX)",
    location: "Menlo Park, CA",
    type: "Full Time",
    experience: "3-5 yr",
    description: `About the Role:
Join Meta's Instagram product design group to craft next-generation collaborative interfaces. You will solve complex interaction challenges, balance simplicity with power, and evolve the design systems that connect over 3 billion people.

Key Responsibilities:
• Own end-to-end product design from generative user research to high-fidelity prototyping and QA.
• Partner with product managers and engineers to launch intuitive cross-platform features.
• Champion accessibility, inclusive design principles, and visual consistency across interfaces.
• Build reusable UI components, motion specifications, and interaction guidelines in Figma.

Qualifications & Requirements:
• 3-5 years of product design experience designing consumer-facing mobile and web applications.
• Mastery of Figma, interactive prototyping tools, and scalable design systems.
• Strong portfolio demonstrating structured design thinking and measurable product impact.
• Exceptional communication skills and ability to articulate design rationales clearly.`,
    skills: "Figma, Prototyping, Design Systems, User Research, Interaction Design",
  },
  {
    companyName: "Netflix",
    title: "Senior Backend Engineer - Streaming",
    location: "Los Gatos, CA",
    type: "Full Time",
    experience: "5+ yr",
    description: `About the Role:
Netflix streams entertainment to over 260 million members across 190 countries. You will join the Streaming Client Data and Delivery team to scale high-concurrency microservices handling terabits per second of real-time media streams with sub-second latency.

Key Responsibilities:
• Design and scale fault-tolerant microservices utilizing Java, Spring Boot, and Apache Kafka.
• Analyze streaming telemetry to optimize adaptive bitrate algorithms and video buffer health.
• Conduct load tests, resilience simulations, and automated recovery across AWS multi-region setups.
• Partner with mobile, TV, and web engineering teams to define performant client-server protocols.

Qualifications & Requirements:
• 5+ years of software development experience specializing in high-throughput backend services.
• Deep proficiency in Java, distributed caching (Redis/Memcached), and Cassandra or NoSQL datastores.
• Solid background in concurrency, asynchronous programming, and reactive systems.
• Strong problem-solving mindset with a passion for streaming media technology.`,
    skills: "Java, Spring Boot, Microservices, Apache Kafka, Cassandra, AWS",
  },
  {
    companyName: "Apple",
    title: "iOS Software Engineer",
    location: "Cupertino, CA",
    type: "Full Time",
    experience: "4+ yr",
    description: `About the Role:
Apple's Human Interface and Applications organization is seeking a talented iOS Software Engineer to build delightful, fluid experiences across iOS, iPadOS, and visionOS. You will work on cutting-edge features that set the standard for mobile operating systems.

Key Responsibilities:
• Build and polish user-facing applications using Swift, SwiftUI, and modern iOS SDK frameworks.
• Optimize rendering performance, frame rates, and memory consumption with Apple Instruments.
• Collaborate closely with Apple design teams to implement pixel-perfect user interfaces and animations.
• Uphold Apple's stringent standards for user privacy, on-device security, and software durability.

Qualifications & Requirements:
• 4+ years of professional iOS application development with Swift and Objective-C.
• Deep understanding of UIKit, SwiftUI, Core Animation, and concurrency paradigms (async/await).
• Strong debugging skills utilizing Instruments, LLDB, and memory leak analyzers.
• High attention to detail and appreciation for elegant UI and user privacy.`,
    skills: "Swift, SwiftUI, iOS SDK, CoreData, Objective-C, Instruments",
  },
  {
    companyName: "OpenAI",
    title: "Machine Learning Platform Engineer",
    location: "San Francisco, CA",
    type: "Full Time",
    experience: "4+ yr",
    description: `About the Role:
OpenAI is dedicated to ensuring that artificial general intelligence benefits all of humanity. As an ML Platform Engineer, you will build and maintain the distributed training and inference clusters powering state-of-the-art foundation models like GPT and Sora.

Key Responsibilities:
• Build scalable infrastructure for distributed training across thousands of interconnected GPUs.
• Optimize inference throughput and latency with Triton, CUDA kernels, and custom model runtimes.
• Design automated health checking, fault detection, and checkpoint restoration for long-running jobs.
• Partner with research scientists to deploy experimental architectures into production seamlessly.

Qualifications & Requirements:
• 4+ years of software engineering experience in distributed systems and high-performance computing.
• Proficient in Python, C++, PyTorch, and distributed training frameworks (Ray, DeepSpeed, Megatron).
• Experience managing large-scale Kubernetes clusters with GPU accelerators (H100/A100).
• Solid grounding in operating systems, networking, and memory hierarchy optimization.`,
    skills: "Python, PyTorch, CUDA, Kubernetes, Ray, Triton, Distributed Training",
  },
  {
    companyName: "Airbnb",
    title: "Frontend Performance Engineer",
    location: "Remote",
    type: "Remote",
    experience: "3-5 yr",
    description: `About the Role:
Airbnb connects millions of guests and hosts around the world. As a Frontend Performance Engineer, you will lead company-wide initiatives to optimize web performance, Core Web Vitals, and client bundle architectures across all global traveler touchpoints.

Key Responsibilities:
• Profile and diagnose client-side performance bottlenecks using Chrome DevTools and real-user monitoring.
• Build automated performance budgets, bundle size regression alerts, and CI/CD quality gates.
• Optimize critical rendering paths, code splitting strategies, and image delivery pipelines.
• Educate frontend product engineers on performance-first development practices and patterns.

Qualifications & Requirements:
• 3-5 years of experience building and tuning large-scale React and Next.js applications.
• Mastery of Core Web Vitals (LCP, INP, CLS), browser rendering engines, and network waterfalls.
• Strong command of modern JavaScript/TypeScript, Webpack/Vite bundlers, and CSS optimization.
• Data-driven approach to engineering with experience interpreting A/B test telemetry.`,
    skills: "React, Web Performance, CSS, TypeScript, GraphQL, Lighthouse",
  },
  {
    companyName: "Linear",
    title: "Senior Product Engineer",
    location: "Remote",
    type: "Remote",
    experience: "4+ yr",
    description: `About the Role:
Linear is rebuilding modern software project management. We build tools that are blazing fast, delightfully crafted, and keyboard-first. As a Product Engineer, you will own features end-to-end with high autonomy, shaping both UX and client-server sync architecture.

Key Responsibilities:
• Design and build keyboard-first product features across web, desktop (Electron), and mobile.
• Optimize our local-first offline synchronization engine powered by SQLite and WebSockets.
• Collaborate on product direction directly with founders, designers, and customers.
• Maintain sub-50ms UI response times across complex graph queries and real-time state changes.

Qualifications & Requirements:
• 4+ years building high-quality software products with TypeScript, React, and GraphQL.
• Experience with local-first software, CRDTs, or reactive state management architectures.
• Exceptional taste in user interface design, micro-interactions, and keyboard ergonomics.
• Self-directed, disciplined, and comfortable working in a high-velocity remote team.`,
    skills: "TypeScript, React, Electron, GraphQL, SQLite, Sync Engines",
  },
  {
    companyName: "Spotify",
    title: "Data Engineer - Music Discovery",
    location: "New York, NY",
    type: "Full Time",
    experience: "3+ yr",
    description: `About the Role:
Spotify transforms the way people discover and enjoy audio. As a Data Engineer on the Music Discovery team, you will engineer batch and real-time streaming data pipelines that fuel personalized algorithmic recommendations (Discover Weekly, Daily Mix) for over 600 million listeners.

Key Responsibilities:
• Build and operate petabyte-scale data pipelines using Apache Spark, Scala, and Python on GCP.
• Partner with machine learning engineers to feature-engineer listener preferences and track metadata.
• Maintain data reliability, schema validation, and SLA monitoring across BigQuery and Kafka topics.
• Continuously optimize cloud infrastructure costs and query efficiency across data warehouses.

Qualifications & Requirements:
• 3+ years experience engineering distributed data pipelines and ETL architectures.
• Proficiency in Python, Scala, SQL, and Apache Spark / Flink streaming frameworks.
• Hands-on experience with cloud data platforms (Google Cloud Platform, BigQuery, Dataflow).
• Strong understanding of data modeling, data quality assurance, and event-driven systems.`,
    skills: "Python, Apache Spark, Scala, Google Cloud Platform, BigQuery, Kafka",
  },
  {
    companyName: "Microsoft",
    title: "Cloud Solutions Architect",
    location: "Redmond, WA",
    type: "Full Time",
    experience: "5+ yr",
    description: `About the Role:
Microsoft Cloud empowers organizations around the world to transform their operations. As a Cloud Solutions Architect, you will partner with key enterprise customers to architect, migrate, and modernize mission-critical systems on Microsoft Azure with enterprise-grade security and resilience.

Key Responsibilities:
• Design comprehensive cloud architecture blueprints adhering to Azure Well-Architected Framework.
• Guide enterprise clients through hybrid cloud, containerization (AKS), and microservice transitions.
• Lead technical architectural reviews, proof-of-concept implementations, and cost optimization audits.
• Collaborate with Microsoft engineering product groups to feed enterprise requirements back into the Azure roadmap.

Qualifications & Requirements:
• 5+ years of experience in cloud infrastructure design, DevOps, and enterprise solutions architecture.
• Deep technical knowledge of Microsoft Azure, Kubernetes, Infrastructure as Code (Terraform/Bicep), and IAM.
• Azure Solutions Architect Expert certification or equivalent real-world pedigree.
• Excellent presentation skills with the ability to bridge technical and executive stakeholders.`,
    skills: "Azure, Kubernetes, Terraform, Python, DevOps, Enterprise Architecture",
  },
  {
    companyName: "GitHub",
    title: "Site Reliability Engineer (SRE)",
    location: "Remote",
    type: "Remote",
    experience: "3+ yr",
    description: `About the Role:
GitHub is the home for over 100 million developers. As an SRE, you will ensure the reliability, security, and scalability of GitHub Actions, git backend repositories, and compute clusters that process billions of API requests every day.

Key Responsibilities:
• Drive availability and performance of core GitHub services, maintaining 99.99% service availability.
• Build automated infrastructure orchestration, canary deployment pipelines, and auto-healing services.
• Participate in on-call incident triage, post-incident reviews, and blameless post-mortem investigations.
• Modernize legacy deployment infrastructure into containerized Kubernetes platforms.

Qualifications & Requirements:
• 3+ years of experience in site reliability engineering or production systems administration.
• Strong scripting ability in Go, Python, or Ruby, with extensive Linux kernel and networking expertise.
• Experience operating high-scale Kubernetes, Docker, and Terraform configurations.
• Proven track record with observability stacks (Prometheus, Grafana, Datadog, OpenTelemetry).`,
    skills: "Docker, Kubernetes, Ruby, Go, Terraform, Linux, CI/CD, Observability",
  },
  {
    companyName: "Figma",
    title: "Web Graphics & Canvas Engineer",
    location: "San Francisco, CA",
    type: "Full Time",
    experience: "4+ yr",
    description: `About the Role:
Figma empowers teams to design together in real-time right in the browser. You will join our Core Engine team to push the boundaries of browser rendering, working with WebAssembly, C++, and custom 2D vector graphics rasterizers capable of handling millions of design primitives at 60 FPS.

Key Responsibilities:
• Develop and optimize the core 2D graphics rendering engine running inside WebAssembly.
• Implement real-time vector path manipulation, blend modes, and font rendering shaders.
• Profile CPU/GPU memory utilization and eliminate frame drops across diverse hardware.
• Write cross-compilable C++ and TypeScript that seamlessly connects to browser WebGL APIs.

Qualifications & Requirements:
• 4+ years experience with C++, WebGL, WebAssembly, or low-level graphics programming (OpenGL/DirectX/Metal).
• Strong mathematical foundation in linear algebra, geometry, and computer graphics algorithms.
• Familiarity with browser internals, canvas rendering pipelines, and memory optimization.
• Curiosity for building groundbreaking web-native creative tools.`,
    skills: "WebGL, WebAssembly, C++, TypeScript, HTML5 Canvas, Shaders",
  },
  {
    companyName: "Datadog",
    title: "Senior SRE / Observability Engineer",
    location: "New York, NY",
    type: "Full Time",
    experience: "3+ yr",
    description: `About the Role:
Datadog is the monitoring and security platform for cloud applications. You will scale high-volume telemetry ingestion engines that process trillions of metrics, logs, and traces daily, ensuring zero-loss ingestion even during massive global internet traffic surges.

Key Responsibilities:
• Architect horizontally scalable ingestion pipelines and time-series datastores using Go and Kafka.
• Troubleshoot complex production incidents across distributed clusters spanning thousands of nodes.
• Implement kernel-level observability tooling using eBPF and Linux tracing primitives.
• Build self-service developer tooling to automate deployment, canary analysis, and capacity planning.

Qualifications & Requirements:
• 3+ years of systems engineering or SRE experience managing petabyte-scale distributed systems.
• Advanced proficiency in Go, C, or Rust, paired with deep Linux system administration skills.
• Experience with Kafka, Cassandra, Prometheus, and time-series database internals.
• Passion for operational telemetry, systems debugging, and high-availability architecture.`,
    skills: "Go, Python, Linux Internals, Prometheus, eBPF, Time Series Databases",
  },
  {
    companyName: "Cloudflare",
    title: "Network Security Engineer",
    location: "Austin, TX",
    type: "Full Time",
    experience: "4+ yr",
    description: `About the Role:
Cloudflare protects and accelerates millions of web properties. As a Network Security Engineer, you will build edge security filters, WAF rules, and automated DDoS mitigation systems running across Cloudflare's global edge network in over 300 cities worldwide.

Key Responsibilities:
• Develop edge-based threat detection and automated mitigation algorithms in Rust and Go.
• Analyze volumetric DDoS attacks, BGP route leaks, and DNS amplification vectors in real time.
• Implement packet processing logic leveraging eBPF, XDP, and high-performance Linux networking.
• Collaborate with threat intelligence analysts to safeguard customers against zero-day exploits.

Qualifications & Requirements:
• 4+ years experience in network security, packet filtering, and internet protocol engineering.
• Deep understanding of TCP/IP, BGP, DNS, TLS/SSL, and HTTP/2/3 protocols.
• Proficient in Rust, Go, or C with experience in eBPF or low-level kernel networking.
• Calm under pressure with strong analytical skills during active attack mitigations.`,
    skills: "Rust, Go, BGP, DNS, Linux Kernel, Network Protocols, DDoS Mitigation",
  },
  {
    companyName: "Notion",
    title: "Mobile Engineer (React Native)",
    location: "San Francisco, CA",
    type: "Full Time",
    experience: "3+ yr",
    description: `About the Role:
Notion is the all-in-one workspace for notes, docs, project management, and wikis. You will join the Mobile Engineering team to deliver a snappy, native-feeling document editing and organization experience across iOS and Android for tens of millions of active users.

Key Responsibilities:
• Build rich text editing and block-based canvas features in React Native and TypeScript.
• Bridge native iOS (Swift) and Android (Kotlin) modules to maximize performance and smoothness.
• Optimize startup times, offline caching, and memory footprint on low-end and high-end devices alike.
• Work in lockstep with designers to ensure fluid gestures, animations, and typography fidelity.

Qualifications & Requirements:
• 3+ years experience building production mobile applications with React Native and TypeScript.
• Working knowledge of native iOS (Swift/Objective-C) or Android (Kotlin/Java) development.
• Strong background in mobile state management, SQLite local caching, and offline synchronization.
• Keen eye for motion design, micro-interactions, and polished consumer mobile UX.`,
    skills: "React Native, TypeScript, iOS, Android, Native Modules, Performance",
  },
  {
    companyName: "Amazon",
    title: "Software Development Engineer II (SDE II)",
    location: "Seattle, WA",
    type: "Full Time",
    experience: "3-5 yr",
    description: `About the Role:
AWS Developer Tools powers the infrastructure behind modern cloud engineering. As an SDE II, you will design and build highly available, multi-tenant cloud orchestration services that enable millions of software engineers to deploy serverless applications with confidence.

Key Responsibilities:
• Design, implement, and operate fault-tolerant distributed services using Java and AWS primitives.
• Establish strict operational metrics, alarms, and continuous deployment pipelines (CI/CD).
• Deliver low-latency API contracts with high durability and security guarantees.
• Participate in design reviews, architectural discussions, and mentorship of junior engineers.

Qualifications & Requirements:
• 3-5 years of professional software development experience in Java, Kotlin, or Go.
• Strong foundation in object-oriented design, systems architecture, and distributed databases (DynamoDB).
• Hands-on proficiency with cloud architecture, infrastructure as code, and automated testing.
• Bachelor's degree in Computer Science, Computer Engineering, or related technical field.`,
    skills: "Java, AWS, DynamoDB, Systems Design, Microservices, CI/CD",
  },
  {
    companyName: "Uber",
    title: "Distributed Systems Engineer",
    location: "Sunnyvale, CA",
    type: "Full Time",
    experience: "5+ yr",
    description: `About the Role:
Uber moves the world. As a Distributed Systems Engineer on the Core Mobility platform, you will architect ultra-low-latency matching, dynamic pricing, and geospatial tracking algorithms coordinating millions of rides and deliveries concurrently.

Key Responsibilities:
• Build low-latency microservices handling millions of queries per second using Go and Java.
• Optimize real-time geospatial indexers (H3) for dynamic rider-driver matching in fractions of a second.
• Scale distributed messaging topologies with Apache Kafka, Redis, and custom RPC frameworks.
• Champion system resilience, automated chaos testing, and graceful degradation during peak demand.

Qualifications & Requirements:
• 5+ years of software engineering experience in distributed systems and high-throughput backends.
• Exceptional coding abilities in Go or Java, with deep knowledge of memory management and concurrency.
• Experience with high-scale stream processing, distributed caching, and geospatial algorithms.
• Passion for solving real-time logistics and physical-world optimization problems.`,
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
    let user = await prisma.user.findFirst({
      where: { email: userConfig.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          ...userConfig,
          password: hashedPassword,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
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
      });
    }
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
    } else {
      job = await prisma.jobs.update({
        where: { id: job.id },
        data: {
          description: jobConfig.description,
          skills: jobConfig.skills,
          experience: jobConfig.experience,
          type: jobConfig.type,
          location: jobConfig.location,
        },
      });
      console.log(`✓ Updated Job: [${job.companyName}] ${job.title}`);
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
