"uae client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, getRedirectResult, onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { storage } from "@/utils/storage";
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
            });

        // 認証状態の監視
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
