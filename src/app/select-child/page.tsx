"use client";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ChildList } from "@/components/child/ChildList";
import style from "@/app/login/login.module.css";

export default function SelectChild() {
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        if (!auth.currentUser) {
            router.replace("/login");
        }
    }, [auth.currentUser, router]);

    if (!auth.currentUser) {
        return null;
    }

    return (
        <RequireAuth>
            <div className={style.selectContainer}>
                <h1 className={style.title}>お子様を選択してください</h1>
                <ChildList />
            </div>
        </RequireAuth>
    );
}
