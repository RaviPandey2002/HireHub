# HireHub

A full-stack job board connecting **recruiters** and **candidates** — post jobs, apply, track applications, and manage memberships all in one place.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | MongoDB via Prisma ORM |
| Auth | NextAuth v5 (Credentials + GitHub + Google OAuth) |
| File Storage | Supabase Storage (resume PDFs) |
| Payments | Stripe Checkout + Webhooks |
| Validation | Zod |
| Containerisation | Docker + Docker Compose |

---

## Features

### Candidates
- Register / sign in with email & password or OAuth (GitHub, Google)
- Complete onboarding profile (resume PDF upload to Supabase)
- Browse all job listings with keyword search and filters (company, title, type, location)
- Apply to jobs (freemium: 2 applications on free tier)
- Track application statuses (Applied → Selected / Rejected) in the Activity page
- Personal dashboard with application stats

### Recruiters
- Complete onboarding profile
- Post new jobs (freemium: 2 jobs on free tier)
- Delete jobs (cascades to all linked applications)
- View applicants per job, download resumes, select or reject candidates
- Dashboard with jobs posted, applicant counts, and recent application table
- Companies page auto-populated from posted jobs

### Shared
- Membership tiers (Basic / Teams / Enterprise) via Stripe Checkout — upgrades lift posting/application limits
- Feed page — candidates see latest jobs, recruiters see incoming applications
- Dark mode throughout
- Responsive (mobile sheet filters, mobile-first layouts)

---

## Project Structure

```
.
├── actions/                  # Next.js Server Actions
│   ├── createJobApplicationAction.ts
│   ├── deleteJobAction.ts
│   ├── postNewJobAction.ts
│   ├── updateJobApplicationAction.ts
│   ├── updateProfile.ts
│   ├── getCandidateDetailsByIDAction.ts
│   ├── createStripePaymentAction.ts
│   ├── createPriceIdAction.ts
│   ├── dbActions.ts           # Onboarding profile creation
│   ├── getUser.ts
│   ├── login.ts / logout.ts / register.ts
├── data/
│   └── user.ts               # DB query helpers (jobs, applications, stats)
├── lib/
│   ├── db.ts                 # Prisma client singleton
│   ├── utils.ts              # cn(), form controls, constants
│   └── supabaseClient.ts
├── prisma/
│   └── schema.prisma         # User, Jobs, Application, Account models
├── schema/
│   └── index.ts              # Zod schemas for all server actions
├── src/app/
│   ├── (protected)/
│   │   └── (dashboard)/
│   │       ├── activity/     # Candidate activity tabs
│   │       ├── companies/    # Companies hiring page
│   │       ├── dashboard/    # Role-based dashboard (stats + recent activity)
│   │       ├── feed/         # Jobs feed (candidate) / applications feed (recruiter)
│   │       ├── jobs/         # Jobs listing + search + filter
│   │       └── membership/   # Stripe membership plans
│   ├── account/              # Edit profile
│   ├── onboard/              # Role selection + profile setup
│   ├── login/ register/      # Auth pages
│   └── api/
│       ├── auth/[...nextauth]/
│       └── webhooks/stripe/  # Stripe webhook → membership update
├── auth.ts                   # NextAuth config (JWT strategy, OAuth, Credentials)
├── middleware.ts             # Route guards based on role
└── routes.ts                 # Public / auth / onboarding route lists
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running MongoDB instance **with replica set enabled** (required by Prisma for transactions)
- Supabase project with a storage bucket named `hirehub-bucket-public`
- Stripe account
- GitHub and/or Google OAuth app credentials

### 1. Clone & install

```bash
git clone https://github.com/your-username/hirehub.git
cd hirehub
npm install
```

### 2. Configure environment variables

```bash
cp sample.env .env.local
```

Fill in every value in `.env.local`:

```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=          # generate with: openssl rand -base64 32

# MongoDB (must run as a replica set)
DATABASE_URL=mongodb://localhost:27017/hirehub?replicaSet=rs0&directConnection=true

# GitHub OAuth
GITHUB_ID=
GITHUB_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 3. Push the Prisma schema

```bash
npx prisma db push
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Running with Docker

The included `docker-compose.yml` spins up the Next.js app and a MongoDB replica-set node together:

```bash
docker compose up --build
```

The app will be available at [http://localhost:3000](http://localhost:3000).  
MongoDB is exposed on host port `27027`.

> **Note:** On first boot the replica set needs to be initialised once:
> ```bash
> docker exec -it mongo mongosh --eval "rs.initiate()"
> ```

---

## Stripe Webhook (local development)

Use the Stripe CLI to forward events to the local webhook handler:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the printed webhook signing secret into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `NEXTAUTH_URL` | Full URL of your deployment (e.g. `https://hirehub.vercel.app`) |
| `NEXTAUTH_SECRET` | Random secret for JWT signing |
| `DATABASE_URL` | MongoDB connection string (replica set required) |
| `GITHUB_ID / GITHUB_SECRET` | GitHub OAuth app credentials |
| `GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET` | Google OAuth app credentials |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint signing secret |

---

## License

MIT
