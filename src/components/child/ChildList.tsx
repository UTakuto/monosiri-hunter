"use client";
import { useState, useEffect } from "react";
import { useChild } from "@/hooks/useChild";
import style from "./child.module.css";
import Link from "next/link";

// 子どもの型定義
interface Child {
    id: string;
    name: string;
}

export function ChildList() {
    const { getChildren, isLoading, error } = useChild();
    const [children, setChildren] = useState<Child[]>([]);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const childrenData = await getChildren();
                setChildren(childrenData || []);
            } catch (error) {
                console.error("子どもデータの取得に失敗:", error);
            }
        };

        fetchChildren();
    }, [getChildren]);

    if (isLoading) {
        return <div className={style.loading}>読み込み中...</div>;
    }

    if (error) {
        return <div className={style.error}>{error}</div>;
    }

    return (
        <div className={style.childList}>
            {children.map((child) => (
                <div key={child.id} className={style.childItem}>
                    {child.name}
                </div>
            ))}
            <Link href="/create-child" className={style.createChildButton}>
                <span className={style.createBorder}>お子様を追加</span>
            </Link>
        </div>
    );
}
