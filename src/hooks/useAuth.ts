import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            console.log("Auth state changed:", user);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            console.log("Sign in successful:", result.user);
            return result.user;
        } catch (err) {
            console.error("Sign in error:", err);
            setError(err instanceof Error ? err.message : "認証エラーが発生しました");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        isLoading,
        error,
        signInWithGoogle,
    };
};
