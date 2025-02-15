"use client";
import { useEffect, useState } from "react";
import { useChild } from "@/hooks/useChild";
import type { Child } from "@/types";
import { useRouter } from "next/navigation";
import style from "./child.module.css";

export const ChildList = () => {
    const [children, setChildren] = useState<Child[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const { getChildren, isLoading, error } = useChild();
    const router = useRouter();

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                setFetchError(null);
                const childrenData = await getChildren();
                setChildren(childrenData);
            } catch (err) {
                setFetchError(err instanceof Error ? err.message : "データの取得に失敗しました");
                console.error("子どもアカウントの取得に失敗しました:", err);
            }
        };

        fetchChildren();
    }, [getChildren]);

    const handleSelectChild = (childId: string) => {
        sessionStorage.setItem("childId", childId);
        router.push("/");
    };

    if (isLoading) {
        return (
            <div className={style.loading}>
                <div className={style.loadingTxt}>読み込み中...</div>
            </div>
        );
    }

    if (fetchError || error) {
        return <div className={style.error}>エラーが発生しました: {fetchError || error}</div>;
    }

    return (
        <div className={style.childList}>
            {children.map((child) => (
                <button
                    key={child.id}
                    onClick={() => handleSelectChild(child.id)}
                    className={style.childButton}
                >
                    <span className={style.border}>{child.name}</span>
                </button>
            ))}
            <button
                onClick={() => router.push("/create-child")}
                className={style.createChildButton}
            >
                <span className={style.createBorder}>新しい子どもアカウントを作成</span>
            </button>
        </div>
    );
};
