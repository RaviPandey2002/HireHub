export interface SampleJobConfig {
  companyName: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  skills: string;
}

export const baselineSampleJobs: SampleJobConfig[] = [
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
    title: "Senior AI Platform Engineer",
    location: "Menlo Park, CA",
    type: "Full Time",
    experience: "4-6 yr",
    description: `About the Role:
Join Meta's Fundamental AI Research team to engineer ultra-scalable distributed systems powering Llama model training and multimodal inference clusters.

Key Responsibilities:
• Build distributed training backends scaling across thousands of GPU accelerators.
• Optimize memory efficiency and network bandwidth using custom Triton and CUDA kernels.
• Collaborate with research scientists to deploy state-of-the-art open models globally.

Qualifications & Requirements:
• 4+ years software development experience with Python, PyTorch, and distributed training.
• Hands-on expertise with CUDA, Ray, and high-performance interconnects (RoCE/InfiniBand).`,
    skills: "Python, PyTorch, CUDA, Distributed Systems, Ray, Kubernetes",
  },
  {
    companyName: "Netflix",
    title: "Senior Backend Engineer - Streaming",
    location: "Los Gatos, CA",
    type: "Full Time",
    experience: "5+ yr",
    description: `About the Role:
Netflix streams entertainment to over 260 million members across 190 countries. Scale high-concurrency microservices handling terabits per second of real-time media streams with sub-second latency.

Key Responsibilities:
• Design and scale fault-tolerant microservices utilizing Java, Spring Boot, and Apache Kafka.
• Analyze streaming telemetry to optimize adaptive bitrate algorithms and video buffer health.
• Conduct load tests, resilience simulations, and automated recovery across AWS multi-region setups.

Qualifications & Requirements:
• 5+ years experience specializing in high-throughput backend services.
• Deep proficiency in Java/Go, distributed caching (Redis), and Cassandra datastores.`,
    skills: "Java, Spring Boot, Microservices, Apache Kafka, Cassandra, AWS",
  },
  {
    companyName: "OpenAI",
    title: "Machine Learning Platform Engineer",
    location: "San Francisco, CA",
    type: "Full Time",
    experience: "4+ yr",
    description: `About the Role:
Build and maintain the distributed training and inference clusters powering state-of-the-art foundation models like GPT and Sora.

Key Responsibilities:
• Build scalable infrastructure for distributed training across thousands of interconnected GPUs.
• Optimize inference throughput and latency with Triton, CUDA kernels, and custom model runtimes.
• Design automated health checking, fault detection, and checkpoint restoration.

Qualifications & Requirements:
• 4+ years software engineering experience in distributed systems and high-performance computing.
• Proficient in Python, C++, PyTorch, and distributed training frameworks (Ray, DeepSpeed).`,
    skills: "Python, PyTorch, CUDA, Kubernetes, Ray, Triton, Distributed Training",
  },
  {
    companyName: "Airbnb",
    title: "Frontend Performance Engineer",
    location: "Remote",
    type: "Remote",
    experience: "3-5 yr",
    description: `About the Role:
Lead company-wide initiatives to optimize web performance, Core Web Vitals, and client bundle architectures across all global traveler touchpoints.

Key Responsibilities:
• Profile and diagnose client-side performance bottlenecks using Chrome DevTools and RUM.
• Build automated performance budgets, bundle size regression alerts, and CI/CD gates.
• Optimize critical rendering paths, code splitting strategies, and image delivery pipelines.

Qualifications & Requirements:
• 3-5 years building and tuning large-scale React and Next.js applications.
• Mastery of Core Web Vitals (LCP, INP, CLS), browser rendering engines, and network waterfalls.`,
    skills: "React, Web Performance, CSS, TypeScript, GraphQL, Lighthouse",
  },
  {
    companyName: "Linear",
    title: "Senior Product Engineer",
    location: "Remote",
    type: "Remote",
    experience: "4+ yr",
    description: `About the Role:
Linear is rebuilding modern software project management. We build tools that are blazing fast, delightfully crafted, and keyboard-first.

Key Responsibilities:
• Design and build keyboard-first product features across web, desktop (Electron), and mobile.
• Optimize our local-first offline synchronization engine powered by SQLite and WebSockets.
• Maintain sub-50ms UI response times across complex graph queries and real-time state changes.

Qualifications & Requirements:
• 4+ years building high-quality software products with TypeScript, React, and GraphQL.
• Experience with local-first software, CRDTs, or reactive state management architectures.`,
    skills: "TypeScript, React, Electron, GraphQL, SQLite, Sync Engines",
  },
];

export const mockRecruiterJobs: SampleJobConfig[] = [
  {
    companyName: "Stripe",
    title: "Staff Infrastructure Engineer",
    location: "San Francisco, CA (Hybrid)",
    type: "Full Time",
    experience: "5+ yr",
    description: `About the Role:
Stripe builds economic infrastructure for the internet. As a Staff Infrastructure Engineer, you will architect and scale global payment processing infrastructure with 99.999% uptime guarantees.

Key Responsibilities:
• Lead the architectural direction of distributed payment ingestion and settlement engines.
• Harden reliability, disaster recovery, and multi-region failover across AWS and Kubernetes clusters.
• Elevate team engineering velocity through tooling and automated canary deployments.

Qualifications & Requirements:
• 5+ years experience engineering high-throughput distributed infrastructure in Go, Java, or Rust.
• Deep expertise with Kubernetes, Terraform, AWS, and zero-downtime database operations.`,
    skills: "Go, Kubernetes, AWS, Terraform, Docker, Microservices, Distributed Systems",
  },
  {
    companyName: "Stripe",
    title: "Senior Frontend Platform Engineer",
    location: "Remote / SF",
    type: "Full Time",
    experience: "4+ yr",
    description: `About the Role:
Join the Stripe Dashboard team to build the financial control center for millions of global internet businesses. You will develop highly accessible, real-time UI architectures with React and TypeScript.

Key Responsibilities:
• Build resilient, responsive dashboard experiences using React, TypeScript, and Tailwind CSS.
• Optimize client-side bundle performance, telemetry logging, and design system components.
• Collaborate with design and product teams to craft world-class developer experiences.

Qualifications & Requirements:
• 4+ years frontend development experience with modern React, TypeScript, and web standards.
• Solid background in state management, testing, and component design systems.`,
    skills: "React, TypeScript, Next.js, Tailwind CSS, GraphQL, Web Performance",
  },
];

export const mockCandidatesForRecruiter = [
  {
    name: "Alex Candidate",
    email: "alex.candidate@demo.local",
    status: ["Applied"],
    skills: "React, TypeScript, Next.js, Node.js, Tailwind CSS, PostgreSQL",
    company: "TechCorp Inc.",
    experience: "3 years",
    resume: "public/demo_resume_alex.pdf",
    college: "UC Berkeley",
  },
  {
    name: "Elena Rostova",
    email: "elena.rostova@demo.local",
    status: ["Applied", "Selected"],
    skills: "Go, Kubernetes, Distributed Systems, AWS, Python, Kafka, Docker",
    company: "CloudScale Systems",
    experience: "6 years",
    resume: "public/demo_resume_elena.pdf",
    college: "Columbia University",
  },
  {
    name: "Marcus Chen",
    email: "marcus.chen@demo.local",
    status: ["Applied", "Rejected"],
    skills: "Java, Spring Boot, Microservices, Cassandra, Redis, CI/CD",
    company: "Enterprise Labs",
    experience: "4 years",
    resume: "public/demo_resume_marcus.pdf",
    college: "Carnegie Mellon",
  },
];
