"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

type AuthContextType = {
    user: User | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // ユーザーが認証済みの場合
                setUser(user);
            } else {
                // 未認証の場合
                setUser(null);
                // ログインページ以外にいる場合はリダイレクト
                if (window.location.pathname !== "/login") {
                    router.push("/login");
                }
            }
            setLoading(false);
        });

        // クリーンアップ関数
        return () => unsubscribe();
    }, [router]);

    // ローディング中はnullを返す
    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                読み込み中...
            </div>
        );
    }

    return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

// カスタムフックとしてエクスポート
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
