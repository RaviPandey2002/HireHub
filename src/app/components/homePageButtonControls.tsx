"use client";

import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { Button } from "./ui/button";

export const HomepageButtonControls = ({ user, profileInfo }) => {
    const router = useRouter();

    useEffect(() => {
        router.refresh();
    }, [router]);

    return (
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
                onClick={() => {
                    if(user) {
                        router.push("/jobs")
                    }
                    else {
                        router.push("/login")
                    }
                }}
                className="flex h-11 w-full items-center justify-center px-5 sm:w-auto"
            >
                {user
                    ? profileInfo === "Candidate"
                        ? "Browse Jobs"
                        : "Jobs Dashboard"
                    : "Find Jobs"}
            </Button>
            <Button
                onClick={() =>{
                    router.push(
                                user
                                    ? profileInfo === "Candidate"
                                        ? "/activity"
                                        : "/dashboard"
                                    : "/login"
                            )}
                }
                className="flex h-11 w-full items-center justify-center px-5 sm:w-auto"
            >
                {user
                    ? profileInfo === "Candidate"
                        ? "Your Activity"
                        : "News feed"
                    : "Post New Job"}
            </Button>
        </div>
    );
}
