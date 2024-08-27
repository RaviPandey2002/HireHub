"use server"

import { signOut } from "auth";


export const logout = async ()=>{
    console.log("async logout done!!");
    await signOut();
}