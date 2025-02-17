"use client";
import { createContext, useEffect, useState, ReactNode } from "react";
import {
    getAuth,
    getRedirectResult,
    onAuthStateChanged,
    User,
    GoogleAuthProvider,
    signInWithRedirect,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { storage } from "@/utils/storage";
import { useRouter } from "next/navigation";

// 認証コンテキストの型定義
interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    error: string | null;
}

// デフォルト値を持つコンテキストを作成
export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => {},
    error: null,
});

// AuthProviderコンポーネントのprops型
interface Props {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Google認証処理
    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            setError(null);
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider);
        } catch (error: unknown) {
            console.error("認証エラー:", error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("予期せぬエラーが発生しました");
            }
        } finally {
            setLoading(false);
        }
    };

    // 認証状態の監視とリダイレクト後の処理
    useEffect(() => {
        const auth = getAuth();

        // リダイレクト後の処理
        getRedirectResult(auth)
            .then(async (result) => {
                if (result?.user) {
                    // Firestoreにユーザー情報を保存
                    await setDoc(
                        doc(db, "users", result.user.uid),
                        {
                            name: result.user.displayName,
                            email: result.user.email,
                            photoURL: result.user.photoURL,
                            lastLogin: new Date().toISOString(),
                        },
                        { merge: true }
                    );

                    // セッションストレージに親のIDを保存
                    storage.setParentId(result.user.uid);

                    // 子どもアカウント選択画面へ遷移
                    router.push("/select-child");
                }
            })
            .catch((error) => {
                console.error("リダイレクト後のエラー:", error);
                setError("認証後の処理に失敗しました");
            });

        // 認証状態の監視
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        // クリーンアップ関数
        return () => unsubscribe();
    }, [router]);

    const value = {
        user,
        loading,
        signInWithGoogle,
        error,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
