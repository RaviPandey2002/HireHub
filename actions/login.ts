"use server"

import * as z from 'zod'
import { LoginSchema } from '../schema'


export const login = async (values: z.infer<typeof LoginSchema>) => {

    const validatedFeilds = LoginSchema.safeParse(values);
    if(!validatedFeilds){
        return { error: "Invalid fields"};
    }

    return { success: "Email sent"}

}