import { NextResponse } from "next/server";
import { ensureGlobalBaselineJobs, cleanupExpiredDemoAccounts } from "lib/demoSandboxService";
import { db } from "lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";

    cleanupExpiredDemoAccounts().catch(() => {});
    await ensureGlobalBaselineJobs(force);
    const totalJobs = await db.jobs.count();
    const totalUsers = await db.user.count();

    return NextResponse.json({
      success: true,
      message: force
        ? "HireHub baseline engineering catalog re-verified and synchronized (force=true)."
        : "HireHub baseline engineering catalog is active.",
      stats: {
        totalJobs,
        totalUsers,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return GET(req);
}
