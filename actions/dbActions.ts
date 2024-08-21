"use server"

import { db } from "lib/db"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export const createProfileAction = async (currentTab, formData, pathToRevalidate, redirectTo) => {
  const { recruiterInfo, role, isPremiumUser } = formData;
  const userID = formData.id;
  const userEmail = formData.email;
  console.log("FORM_DATA: ", formData);
  console.log(userID
    ,userEmail)

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

      // Revalidate the path to ensure fresh data
      // revalidatePath('/onboard');
      
      // Redirect after the successful update
      redirect('/');
    } catch (error) {
      console.error("Error updating user profile:", error.message);
    }
  }
  else {
    console.log("No action for the current tab");
  }
}