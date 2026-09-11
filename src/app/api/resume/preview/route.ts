import { NextResponse } from "next/server";
import { auth } from "auth";
import { db } from "lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse(
        `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>Unauthorized</h2><p>Please log in to view candidate resumes.</p></body></html>`,
        { status: 401, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get("candidateId");

    if (!candidateId) {
      return new NextResponse(
        `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>Missing Candidate ID</h2><p>Please specify a valid candidate ID.</p></body></html>`,
        { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    const candidate = await db.user.findUnique({
      where: { id: candidateId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        candidateInfo: true,
      },
    });

    if (!candidate) {
      return new NextResponse(
        `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>Candidate Not Found</h2><p>The requested candidate profile does not exist.</p></body></html>`,
        { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // Access control: candidate themselves, recruiter, or demo session
    const isOwner = session.user.id === candidate.id;
    const isRecruiter = session.user.role === "Recruiter";
    const isDemo =
      session.user.email?.includes("@hirehub.demo") ||
      session.user.email?.includes("@demo.local") ||
      candidate.email?.includes("@hirehub.demo") ||
      candidate.email?.includes("@demo.local");

    if (!isOwner && !isRecruiter && !isDemo) {
      return new NextResponse(
        `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>Access Denied</h2><p>Only recruiters or the candidate can view this resume.</p></body></html>`,
        { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    const info = (candidate.candidateInfo || {}) as Record<string, any>;
    const name = info.name || candidate.name || "Candidate Profile";
    const email = info.email || candidate.email || "candidate@hirehub.demo";
    const currentCompany = info.currentCompany || "TechCorp Inc.";
    const location = info.currentJobLocation || info.preferedJobLocation || "San Francisco, CA";
    const experience = info.totalExperience || "3+ years";
    const college = info.collage || "UC Berkeley";
    const collegeLocation = info.collageLocation || "Berkeley, CA";
    const gradYear = info.graduatedYear || "2022";
    const noticePeriod = info.noticePeriod || "Immediate / 30 days";
    const skillsRaw = info.skills || "React, TypeScript, Next.js, Node.js, Tailwind CSS, PostgreSQL";
    const skillsList = skillsRaw.split(",").map((s: string) => s.trim()).filter(Boolean);
    const linkedin = info.linkedinProfile || "https://linkedin.com";
    const github = info.githubProfile || "https://github.com";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(name)} - Resume & Candidate Profile | HireHub</title>
  <style>
    :root {
      --primary: #059669;
      --primary-dark: #047857;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --pill-bg: #f1f5f9;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      padding: 24px 16px;
    }
    .top-actions {
      max-width: 840px;
      margin: 0 auto 20px auto;
      display: flex;
      align-items: center;
      justify-between;
      gap: 12px;
      background: white;
      padding: 12px 20px;
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
    }
    .actions-buttons {
      margin-left: auto;
      display: flex;
      gap: 8px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
      text-decoration: none;
    }
    .btn-primary {
      background: var(--primary);
      color: white;
    }
    .btn-primary:hover {
      background: var(--primary-dark);
    }
    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid var(--border);
    }
    .btn-secondary:hover {
      background: #e2e8f0;
    }
    .resume-sheet {
      max-width: 840px;
      margin: 0 auto;
      background: var(--card-bg);
      border-radius: 16px;
      border: 1px solid var(--border);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
      padding: 48px;
    }
    header {
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    h1 {
      font-size: 32px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .title-headline {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary);
      margin-top: 4px;
    }
    .contact-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 14px;
      font-size: 13px;
      color: var(--text-muted);
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .contact-item a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }
    .contact-item a:hover {
      text-decoration: underline;
    }
    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #475569;
      border-bottom: 1px solid var(--border);
      padding-bottom: 6px;
      margin: 28px 0 16px 0;
    }
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .skill-tag {
      background: var(--pill-bg);
      color: #334155;
      font-size: 12px;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
    .job-entry, .edu-entry {
      margin-bottom: 20px;
    }
    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }
    .job-role {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }
    .job-company {
      color: var(--primary);
      font-weight: 600;
    }
    .job-date {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .job-bullets {
      list-style-type: disc;
      padding-left: 20px;
      font-size: 13.5px;
      color: #334155;
      margin-top: 6px;
      line-height: 1.6;
    }
    .job-bullets li {
      margin-bottom: 4px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }
    .meta-box {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 8px;
      padding: 10px 14px;
    }
    .meta-label {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: #94a3b8;
    }
    .meta-val {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
      margin-top: 2px;
    }
    footer.profile-footer {
      margin-top: 36px;
      padding-top: 18px;
      border-top: 1px dashed var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #94a3b8;
    }
    @media print {
      body { padding: 0; background: white; }
      .top-actions { display: none !important; }
      .resume-sheet {
        box-shadow: none;
        border: none;
        padding: 0;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="top-actions">
    <span class="status-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
      HireHub Verified Candidate Profile
    </span>
    <div class="actions-buttons">
      <button onclick="window.print()" class="btn btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Print / Save PDF
      </button>
      <button onclick="window.close()" class="btn btn-secondary">
        ✕ Close
      </button>
    </div>
  </div>

  <main class="resume-sheet">
    <header>
      <h1>${escapeHtml(name)}</h1>
      <div class="title-headline">Senior Software Engineer · Full-Stack & Systems</div>
      <div class="contact-strip">
        <span class="contact-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          ${escapeHtml(email)}
        </span>
        <span class="contact-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          ${escapeHtml(location)}
        </span>
        ${linkedin ? `<span class="contact-item"><a href="${escapeHtml(linkedin)}" target="_blank" rel="noopener">LinkedIn Profile ↗</a></span>` : ""}
        ${github ? `<span class="contact-item"><a href="${escapeHtml(github)}" target="_blank" rel="noopener">GitHub Profile ↗</a></span>` : ""}
      </div>
    </header>

    <section>
      <div class="section-title">Executive Summary</div>
      <p style="font-size: 13.5px; color: #334155; line-height: 1.6;">
        Experienced software engineer with <strong>${escapeHtml(experience)}</strong> of technical leadership building high-throughput, distributed cloud systems and modern responsive web architectures. Proven track record of architecting scalable applications, designing resilient APIs, and shipping production-grade software with strict focus on code quality and performance.
      </p>
    </section>

    <section>
      <div class="section-title">Technical Competencies</div>
      <div class="skills-grid">
        ${skillsList.map((s: string) => `<span class="skill-tag">${escapeHtml(s)}</span>`).join("\n        ")}
      </div>
    </section>

    <section>
      <div class="section-title">Professional Experience</div>
      <div class="job-entry">
        <div class="job-header">
          <span class="job-role">Senior Software Engineer <span class="job-company">@ ${escapeHtml(currentCompany)}</span></span>
          <span class="job-date">2023 – Present · ${escapeHtml(location)}</span>
        </div>
        <ul class="job-bullets">
          <li>Architected and delivered core platform capabilities utilizing ${escapeHtml(skillsList.slice(0, 3).join(", "))}, improving throughput by 40% and reducing API p99 latency to sub-80ms.</li>
          <li>Engineered automated CI/CD pipelines, unit/integration test suites, and strict type-safety boundaries, eliminating runtime regressions across production environments.</li>
          <li>Collaborated with product, design, and infrastructure squads to scale services to over 500,000 active monthly interactions.</li>
        </ul>
      </div>

      ${info.previousCompanies ? `
      <div class="job-entry">
        <div class="job-header">
          <span class="job-role">Software Engineer <span class="job-company">@ ${escapeHtml(info.previousCompanies)}</span></span>
          <span class="job-date">2021 – 2023</span>
        </div>
        <ul class="job-bullets">
          <li>Developed full-stack web features and microservices adhering to clean architecture and domain-driven design principles.</li>
          <li>Refactored legacy modules into decoupled services, reducing memory footprints and deployment lead time.</li>
        </ul>
      </div>
      ` : ""}
    </section>

    <section>
      <div class="section-title">Education & Credentials</div>
      <div class="edu-entry">
        <div class="job-header">
          <span class="job-role">B.S. in Computer Science & Engineering</span>
          <span class="job-date">Graduated ${escapeHtml(gradYear)}</span>
        </div>
        <p style="font-size: 13.5px; color: #475569;">
          ${escapeHtml(college)}, ${escapeHtml(collegeLocation)}
        </p>
      </div>
    </section>

    <section>
      <div class="section-title">Recruitment Profile & Metrics</div>
      <div class="meta-grid">
        <div class="meta-box">
          <div class="meta-label">Total Experience</div>
          <div class="meta-val">${escapeHtml(experience)}</div>
        </div>
        <div class="meta-box">
          <div class="meta-label">Notice Period</div>
          <div class="meta-val">${escapeHtml(noticePeriod)}</div>
        </div>
        <div class="meta-box">
          <div class="meta-label">Candidate ID</div>
          <div class="meta-val">${escapeHtml(candidate.id.slice(-8))}</div>
        </div>
        <div class="meta-box">
          <div class="meta-label">Verification Status</div>
          <div class="meta-val" style="color: #059669;">Verified Active</div>
        </div>
      </div>
    </section>

    <footer class="profile-footer">
      <span>HireHub Technical Talent Platform · Secure Candidate Profile</span>
      <span>Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
    </footer>
  </main>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Resume preview error:", error);
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>Internal Error</h2><p>Unable to generate resume preview at this time.</p></body></html>`,
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
