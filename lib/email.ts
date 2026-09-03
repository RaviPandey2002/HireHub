import nodemailer from "nodemailer";

// Gmail transporter — requires GMAIL_USER and GMAIL_APP_PASSWORD in env.
// Generate an App Password at: https://myaccount.google.com/apppasswords
// (Google account must have 2-Step Verification enabled)

// Reuse a single transporter instance across requests (nodemailer best practice)
let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
    if (!_transporter) {
        _transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    }
    return _transporter;
}

function isEmailEnabled(): boolean {
    return !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD;
}

/** Escape special HTML characters to prevent XSS in email bodies */
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
}

export async function sendWelcomeEmail(name: string, email: string) {
    if (!isEmailEnabled()) {
        // Email not configured — skip silently.
        return;
    }

    try {
        await getTransporter().sendMail({
            from: `"HireHub" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Welcome to HireHub 🎉",
            html: welcomeEmailHtml(name),
        });
    } catch (error) {
        console.error("Failed to send welcome email:", error);
    }
}

export interface ApplicationSubmittedParams {
    candidateEmail: string;
    candidateName: string;
    recruiterEmail?: string | null;
    recruiterName?: string | null;
    jobTitle: string;
    companyName: string;
}

export async function sendApplicationSubmittedEmail(params: ApplicationSubmittedParams) {
    if (!isEmailEnabled()) return;

    const { candidateEmail, candidateName, recruiterEmail, recruiterName, jobTitle, companyName } = params;
    const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    // 1. Confirmation to Candidate
    try {
        await getTransporter().sendMail({
            from: `"HireHub" <${process.env.GMAIL_USER}>`,
            to: candidateEmail,
            subject: `Application Submitted: ${jobTitle} at ${companyName}`,
            html: applicationSubmittedCandidateHtml(candidateName, jobTitle, companyName, appUrl),
        });
    } catch (err) {
        console.error("Failed to send candidate application confirmation email:", err);
    }

    // 2. Notification to Recruiter
    if (recruiterEmail) {
        try {
            await getTransporter().sendMail({
                from: `"HireHub" <${process.env.GMAIL_USER}>`,
                to: recruiterEmail,
                subject: `New Applicant for ${jobTitle}: ${candidateName}`,
                html: applicationSubmittedRecruiterHtml(recruiterName || "Recruiter", candidateName, jobTitle, companyName, appUrl),
            });
        } catch (err) {
            console.error("Failed to send recruiter applicant notification email:", err);
        }
    }
}

export interface ApplicationStatusParams {
    candidateEmail: string;
    candidateName: string;
    jobTitle: string;
    companyName: string;
    status: "Selected" | "Rejected";
}

export async function sendApplicationStatusEmail(params: ApplicationStatusParams) {
    if (!isEmailEnabled()) return;

    const { candidateEmail, candidateName, jobTitle, companyName, status } = params;
    const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    const subject = status === "Selected"
        ? `Congratulations! Update on your application for ${jobTitle} at ${companyName}`
        : `Update on your application for ${jobTitle} at ${companyName}`;

    try {
        await getTransporter().sendMail({
            from: `"HireHub" <${process.env.GMAIL_USER}>`,
            to: candidateEmail,
            subject,
            html: applicationStatusCandidateHtml(candidateName, jobTitle, companyName, status, appUrl),
        });
    } catch (err) {
        console.error("Failed to send application status update email:", err);
    }
}

function welcomeEmailHtml(name: string): string {
    const safeName = escapeHtml(name);
    const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to HireHub</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td style="background:#000000;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">HIREHUB</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px;font-size:22px;color:#1f2328;">Welcome aboard, ${safeName}! 👋</h2>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#57606a;">
                Your account has been created successfully. HireHub connects great candidates with great companies — and you're now part of it.
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#57606a;">
                To get started, complete your profile so recruiters (or candidates) can find you.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#000000;border-radius:8px;">
                    <a href="${appUrl}/onboard"
                       style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                      Complete your profile &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#8b949e;">
                You received this email because an account was created at HireHub using this address.<br />
                If this wasn't you, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function applicationSubmittedCandidateHtml(name: string, jobTitle: string, companyName: string, appUrl: string): string {
    const safeName = escapeHtml(name);
    const safeJobTitle = escapeHtml(jobTitle);
    const safeCompanyName = escapeHtml(companyName);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Received</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="background:#000000;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">HIREHUB</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px;font-size:22px;color:#1f2328;">Application Sent! 🚀</h2>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#57606a;">
                Hi ${safeName}, your application for <strong>${safeJobTitle}</strong> at <strong>${safeCompanyName}</strong> has been received.
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#57606a;">
                The hiring team has been notified and will review your profile. You can check the status of your applications anytime on your activity dashboard.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#000000;border-radius:8px;">
                    <a href="${appUrl}/activity"
                       style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                      View Applications &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#8b949e;">
                HireHub Job Board · You received this email because you submitted an application on HireHub.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function applicationSubmittedRecruiterHtml(recruiterName: string, candidateName: string, jobTitle: string, companyName: string, appUrl: string): string {
    const safeRecruiterName = escapeHtml(recruiterName);
    const safeCandidateName = escapeHtml(candidateName);
    const safeJobTitle = escapeHtml(jobTitle);
    const safeCompanyName = escapeHtml(companyName);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Applicant</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="background:#000000;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">HIREHUB</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px;font-size:22px;color:#1f2328;">New Applicant Received 💼</h2>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#57606a;">
                Hi ${safeRecruiterName}, <strong>${safeCandidateName}</strong> just applied for your job opening <strong>${safeJobTitle}</strong> at <strong>${safeCompanyName}</strong>.
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#57606a;">
                Visit your jobs dashboard to inspect their experience, download their resume, and update their application status.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#000000;border-radius:8px;">
                    <a href="${appUrl}/jobs"
                       style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                      Review Applicants &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#8b949e;">
                HireHub Job Board · You received this email because you are the recruiter for this position.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function applicationStatusCandidateHtml(name: string, jobTitle: string, companyName: string, status: "Selected" | "Rejected", appUrl: string): string {
    const safeName = escapeHtml(name);
    const safeJobTitle = escapeHtml(jobTitle);
    const safeCompanyName = escapeHtml(companyName);

    const isSelected = status === "Selected";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Status Update</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="background:#000000;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">HIREHUB</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <div style="margin-bottom:16px;">
                ${isSelected
                  ? `<span style="background:#dcfce7;color:#15803d;padding:4px 12px;border-radius:9999px;font-weight:600;font-size:13px;display:inline-block;">Status: Selected ✓</span>`
                  : `<span style="background:#fee2e2;color:#b91c1c;padding:4px 12px;border-radius:9999px;font-weight:600;font-size:13px;display:inline-block;">Status: Update</span>`
                }
              </div>
              <h2 style="margin:0 0 12px;font-size:22px;color:#1f2328;">
                ${isSelected ? "Congratulations, " + safeName + "! 🎉" : "Application Update for " + safeName}
              </h2>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#57606a;">
                ${isSelected
                  ? `Great news! <strong>${safeCompanyName}</strong> has reviewed your application for <strong>${safeJobTitle}</strong> and selected your profile to move forward in the hiring process. The recruiter will reach out with the next steps shortly.`
                  : `Thank you for taking the time to apply for <strong>${safeJobTitle}</strong> at <strong>${safeCompanyName}</strong>. After careful review, the hiring team has decided to move forward with other applicants for this opening.`
                }
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#57606a;">
                ${isSelected
                  ? `Make sure your profile and contact details are up to date on your account page.`
                  : `We encourage you to explore other open positions on HireHub that match your skills and experience.`
                }
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#000000;border-radius:8px;">
                    <a href="${appUrl}/${isSelected ? "activity" : "jobs"}"
                       style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                      ${isSelected ? "View Application Status &rarr;" : "Explore Open Roles &rarr;"}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#8b949e;">
                HireHub Job Board · You received this email because you submitted an application on HireHub.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
