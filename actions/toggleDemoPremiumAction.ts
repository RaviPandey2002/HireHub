"use server";

import { auth, unstable_update } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";

export async function toggleDemoPremiumAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorised" };
    }

    const email = session.user.email || "";
    const isDemo = email.includes("@hirehub.demo") || email.includes("@demo.local");
    if (!isDemo) {
      return { error: "Demo premium toggle is only available for demo sessions." };
    }

    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isPremiumUser: true },
    });

    const nextPremiumState = !currentUser?.isPremiumUser;
    const memberShipType = nextPremiumState ? "enterprise" : null;
    const memberShipStartDate = nextPremiumState ? new Date().toISOString() : null;
    const memberShipEndDate = nextPremiumState
      ? new Date(Date.now() + 365 * 86400000).toISOString()
      : null;

    await db.user.update({
      where: { id: session.user.id },
      data: {
        isPremiumUser: nextPremiumState,
        memberShipType,
        memberShipStartDate,
        memberShipEndDate,
      },
    });

    await unstable_update({
      user: {
        ...session.user,
        isPremiumUser: nextPremiumState,
        memberShipType: memberShipType ?? undefined,
      },
    });

    revalidatePath("/membership");
    revalidatePath("/dashboard");
    revalidatePath("/jobs");
    revalidatePath("/activity");
    revalidatePath("/account");
    revalidatePath("/");

    return {
      success: true,
      isPremiumUser: nextPremiumState,
      message: nextPremiumState
        ? "Unlocked Enterprise Tier! Unlimited job postings & applications active."
        : "Reverted to Free Tier. Standard quota limits (max 2) are now active.",
    };
  } catch (error) {
    console.error("toggleDemoPremiumAction error:", error);
    return { error: "Failed to toggle demo plan status." };
  }
}
