"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/utils/storage";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    useEffect(() => {
        const parentId = storage.getParentId();
        if (!parentId) {
            router.push("/login");
        }
    }, [router]);

    return <>{children}</>;
};
