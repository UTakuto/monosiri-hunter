"use client";
import { getAuth } from "firebase/auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { app } from "@/lib/firebase";

export function useAuthRedirect() {
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                redirect("/login");
            }
        });

        return () => unsubscribe();
    }, [auth]);
}
