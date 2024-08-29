"use server"

import { db } from "lib/db"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "routes";


export const createProfileAction = async (currentTab, formData) => {
  const { recruiterInfo, role, isPremiumUser } = formData;
  const userID = formData.id;
  const userEmail = formData.email;
  console.log("DbAction formData ",formData);
  if (currentTab === "recruiter") {
    try {
      if (!userID && !userEmail) {
        throw new Error("User ID or email must be provided to update the profile.");
      }
      await db.user.update({
        where: {
          id: userID || undefined,  // Prefer userId if available
          email: userEmail || undefined, // Use email as fallback if id is not present
        },
        data: {
          recruiterInfo: recruiterInfo,
          role: role,
          isPremiumUser: isPremiumUser,
        }
      });

      console.log("User profile updated successfully");
      // revalidatePath("/");
      // redirect(DEFAULT_LOGIN_REDIRECT);
      // Revalidate the path to ensure fresh data
      // Redirect after the successful update
      console.log("Profile updated successfully");
      console.log("DONE")
      return { success: true, message: "Profile updated successfully" };

    } catch (error) {
      console.error("Error updating user profile:",
        error.message);
      return { success: false, message: "Something went wrong" };
    }
  }
  else {
    console.log("No action for the current tab");
    return { success: false, message: "No action for the current tab" };
  }
}
