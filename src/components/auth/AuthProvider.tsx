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

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => {},
    error: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const auth = getAuth();

    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            setError(null);
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider);
        } catch (error) {
            console.error("認証エラー:", error);
            setError("ログインに失敗しました");
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                console.log("Redirect result:", result);

                if (result?.user) {
                    console.log("User after redirect:", result.user);

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

                    storage.setParentId(result.user.uid);

                    if (window.location.pathname === "/login") {
                        console.log("Redirecting to select-child");
                        router.push("/select-child");
                    }
                }
            } catch (error) {
                console.error("Redirect result error:", error);
                setError("認証処理に失敗しました");
            }
        };

        handleRedirectResult();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Auth state changed:", user);
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, error }}>
            {children}
        </AuthContext.Provider>
    );
}
