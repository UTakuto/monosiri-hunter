"use client";
import { useEffect, useState } from "react";
import { useChild } from "@/hooks/useChild";
import type { Child } from "@/types";
import { useRouter } from "next/navigation";

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
            <div className="flex justify-center items-center h-32">
                <div className="text-gray-600">読み込み中...</div>
            </div>
        );
    }

    if (fetchError || error) {
        return (
            <div className="text-red-500 text-center p-4">
                エラーが発生しました: {fetchError || error}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {children.map((child) => (
                <button
                    key={child.id}
                    onClick={() => handleSelectChild(child.id)}
                    className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {child.name}
                </button>
            ))}
            <button
                onClick={() => router.push("/create-child")}
                className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
                新しい子どもアカウントを作成
            </button>
        </div>
    );
};
