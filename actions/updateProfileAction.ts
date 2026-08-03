"use server"

import { db } from "lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(data: {
    id: string;
    memberShipType?: string;
    memberShipStartDate?: string;
    memberShipEndDate?: string;
}, pathToRevalidate: string) {
    try {
        await db.user.update({
            where: { id: data?.id },
            data: {
                isPremiumUser: true,
                memberShipType: data?.memberShipType,
                memberShipStartDate: data?.memberShipStartDate,
                memberShipEndDate: data?.memberShipEndDate,
            },
        });
    } catch (err) {
        console.error("updateProfileAction failed:", err);
    }
    revalidatePath(pathToRevalidate);
}