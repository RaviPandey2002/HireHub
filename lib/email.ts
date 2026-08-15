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
