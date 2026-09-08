import { z } from "zod";

/**
 * Validates and types all application environment variables.
 *
 * Catches missing or malformed environment variables at server boot
 * rather than failing unpredictably during runtime requests.
 */
const envSchema = z
  .object({
    // Core Database
    DATABASE_URL: z
      .string({ required_error: "DATABASE_URL is required to connect to MongoDB." })
      .min(1, "DATABASE_URL cannot be empty."),

    // Authentication
    AUTH_SECRET: z.string().min(1).optional(),
    NEXTAUTH_SECRET: z.string().min(1).optional(),
    NEXTAUTH_URL: z
      .string()
      .url("NEXTAUTH_URL must be a valid URL (e.g., http://localhost:3000)")
      .optional()
      .default("http://localhost:3000"),

    // Node Environment
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    // Supabase (Resume Storage)
    NEXT_PUBLIC_SUPABASE_URL: z
      .string()
      .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
      .optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),

    // Stripe Billing (Optional in dev, required for payments)
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    // Transactional Email (Optional - skips email sending if omitted)
    GMAIL_USER: z.string().email("GMAIL_USER must be a valid email").optional().or(z.literal("")),
    GMAIL_APP_PASSWORD: z.string().optional().or(z.literal("")),

    // OAuth Providers (Optional - credentials login always works)
    GITHUB_ID: z.string().optional(),
    GITHUB_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  })
  .refine((data) => !!(data.AUTH_SECRET || data.NEXTAUTH_SECRET), {
    message: "Either AUTH_SECRET or NEXTAUTH_SECRET must be configured for JWT session security.",
    path: ["AUTH_SECRET"],
  });

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  // If running in the browser (client-side), do not validate server-only variables.
  // Next.js intentionally strips server secrets (like DATABASE_URL) from the browser bundle.
  if (typeof window !== "undefined") {
    return process.env as unknown as Env;
  }

  // During build / CI / testing, allow skipping strict runtime validation if flagged
  if (process.env.SKIP_ENV_VALIDATION) {
    return process.env as unknown as Env;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("\n=======================================================");
    console.error("  ❌ INVALID OR MISSING ENVIRONMENT VARIABLES");
    console.error("=======================================================\n");

    const issues = parsed.error.format();
    for (const [key, value] of Object.entries(issues)) {
      if (key === "_errors") {
        if (Array.isArray(value) && value.length > 0) {
          console.error(`  • Configuration: ${value.join(", ")}`);
        }
      } else if (value && typeof value === "object" && "_errors" in value) {
        const fieldErrors = (value as { _errors: string[] })._errors;
        if (fieldErrors.length > 0) {
          console.error(`  • ${key}: ${fieldErrors.join(", ")}`);
        }
      }
    }

    console.error("\n=======================================================");
    console.error("  Please check your .env file or deployment config.");
    console.error("=======================================================\n");

    // In production, throw immediately to prevent booting with insecure or broken configuration
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment variables. Process aborted.");
    }
  }

  return (parsed.success ? parsed.data : (process.env as unknown as Env));
}

export const env = validateEnv();

