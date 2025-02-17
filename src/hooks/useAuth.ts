import { useState, useCallback } from "react";
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { storage } from "@/utils/storage";
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
            await signInWithRedirect(auth, provider);
        } catch (error: unknown) {
            console.error("認証エラー:", error);

            if (error instanceof Error) {
                const authError = error as AuthenticationError;
                setError(
                    authError.code === "auth/cancelled-popup-request"
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
