"use client";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ChildList } from "@/components/child/ChildList";
import style from "@/app/login/login.module.css";

export default function SelectChild() {
    return (
        <RequireAuth>
            <div className={style.selectContainer}>
                <h1 className={style.title}>お子様を選択してください</h1>
                <ChildList />
            </div>
        </RequireAuth>
    );
}
