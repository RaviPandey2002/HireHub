"use server"

import * as z from 'zod'
import { RegisterSchema } from '../schema'
import bcrypt from "bcryptjs"
import { db } from '../lib/db'
import { getUserByEmail } from '../data/user'

export const register = async (values: z.input<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { name, email, password } = validatedFields.data
    // email is already lowercased+trimmed by the schema transform

    // Check for duplicate before hashing — avoids wasting CPU on bcrypt
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
        return { error: "An account with that email already exists" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.create({
        data: { name, email, password: hashedPassword },
    })

    return { success: "Account created! Redirecting to sign in…" }
}
