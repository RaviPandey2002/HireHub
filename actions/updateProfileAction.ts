"use server"

import { db } from "lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(data, pathToRevalidate) {
    console.log("action userProfile", data);
    try {
        await db.user.update({
            where: {
                id: data?.id
            },
            data: {
                isPremiumUser: true,
                memberShipType: data?.memberShipType,
                memberShipStartDate: data?.memberShipStartDate,
                memberShipEndDate: data?.memberShipEndDate,
            }
        })
    }
    catch (err) {
        console.error("Error updating User Profile During payment- ", err)
    }
    revalidatePath(pathToRevalidate);

}