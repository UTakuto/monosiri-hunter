"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [router]);

    return <>{children}</>;
};
