import { useState, useCallback } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { storage } from "@/utils/storage";
import { useRouter } from "next/navigation";

// カスタムエラー型の定義
interface AuthenticationError extends Error {
    code?: string;
    message: string;
}

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const auth = getAuth();

    const signInWithGoogle = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            if (!result.user) {
                throw new Error("ログインに失敗しました");
            }

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
        } catch (error: unknown) {
            console.error("認証エラー:", error);

            if (error instanceof Error) {
                const authError = error as AuthenticationError;
                setError(
                    authError.code === "auth/popup-closed-by-user"
                        ? "ログインがキャンセルされました"
                        : authError.message || "ログインに失敗しました"
                );
            } else {
                setError("予期せぬエラーが発生しました");
            }
        } finally {
            setIsLoading(false);
        }
    }, [auth, router]);

    return {
        signInWithGoogle,
        isLoading,
        error,
    };
};
