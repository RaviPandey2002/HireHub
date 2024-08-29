"use server"

import { db } from "lib/db";


export const createProfileAction = async (currentTab, formData) => {
  const { recruiterInfo, role, isPremiumUser, candidateInfo } = formData;
  const userID = formData.id;
  const userEmail = formData.email;
  console.log("DbAction formData ", formData);
  if (currentTab === "recruiter") {
    try {
      if (!userID && !userEmail) {
        throw new Error("User ID or email must be provided to update the profile.");
      }
      await db.user.update({
        where: {
          id: userID || undefined,
          email: userEmail || undefined, // Use email as fallback
        },
        data: {
          recruiterInfo: recruiterInfo,
          role: role,
          isPremiumUser: isPremiumUser,
        }
      });

      console.log("Recruiter profile updated successfully");
      return { success: true, message: "Profile updated successfully" };

    } catch (error) {
      console.error("Error updating user profile:",
        error.message);
      return { success: false, message: "Something went wrong" };
    }
  }
  else {
    try {
      if (!userID && !userEmail) {
        throw new Error("User ID or email must be provided to update the profile.");
      }
      await db.user.update({
        where: {
          id: userID || undefined,
          email: userEmail || undefined, // Use email as fallback
        },
        data: {
          candidateInfo: candidateInfo,
          role: role,
          isPremiumUser: isPremiumUser,
        }
      });

      console.log("Candidate profile updated successfully");
      return { success: true, message: "Candidate Profile updated successfully" };
    } catch (error) {
      console.error("Error updating user profile:",
        error.message);
      return { success: false, message: "Something went wrong" };
    }
  }
}
