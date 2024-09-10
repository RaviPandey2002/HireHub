"use client";

import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { Button } from "./ui/button";

export const HomepageButtonControls = ({ user, profileInfo }) => {
    const router = useRouter();

    useEffect(() => {
        router.refresh();
    }, []);

    return (
        <div className="flex space-x-4">
            <Button
                onClick={() => {
                    if(user) {
                        router.push("/jobs")
                    }
                    else {
                        router.push("/login")
                    }
                }}
                className="flex h-11 items-center justify-center px-5"
            >
                {user
                    ? profileInfo === "Candidate"
                        ? "Browse Jobs"
                        : "Jobs Dasboard"
                    : "Find Jobs"}
            </Button>
            <Button
                onClick={() =>{
                    router.push(
                        user
                            ? profileInfo === "Candidate"
                                ? "/activity"
                                : "/feed"
                            : user ? "/jobs" : "/login"
                    )}
                }
                className="flex h-11 items-center justify-center px-5"
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

