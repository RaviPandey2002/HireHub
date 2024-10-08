"use server"

import * as z from 'zod'
import { RegisterSchema } from '../schema'
import bcrypt from "bcryptjs"
import { db } from '../lib/db'
import { getUserByEmail } from '../data/user'


export const register = async (values: z.infer<typeof RegisterSchema>) => {

    const validatedFeilds = RegisterSchema.safeParse(values);
    if (!validatedFeilds) {
        return { error: "Invalid fields" };
    }

    const { name, email, password } = validatedFeilds.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email is already taken!!" }
    }

    await db.user.create(
        {
            data: {
                name,
                email,
                password: hashedPassword
            }
        }
    )

    return { success: "User Created!" }

}