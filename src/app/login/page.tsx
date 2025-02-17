"use client";

import { useAuth } from "@/hooks/useAuth";
import styles from "./login.module.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Login() {
    const router = useRouter();
    const { signInWithGoogle, isLoading, error } = useAuth();

    useEffect(() => {
        const auth = getAuth();
        console.log("Login page loaded, current user:", auth.currentUser);

        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            console.log("Auth state changed in login:", user);
            if (user) {
                // ユーザー情報をFirestoreに保存
                saveUserToFirestore(user);
                console.log("Redirecting authenticated user");
                router.replace("/select-child");
            }
        });

        return () => unsubscribe();
    }, [router]);

    const saveUserToFirestore = async (user: User) => {
        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(
                userRef,
                {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    isParent: true,
                    createdAt: serverTimestamp(),
                },
                { merge: true }
            ); // 既存のデータを保持しつつ更新
            console.log("ユーザー情報を保存しました");
        } catch (error) {
            console.error("ユーザー情報の保存に失敗:", error);
        }
    };

    const handleLogin = async () => {
        try {
            console.log("ログイン開始");
            await signInWithGoogle();
            console.log("ログイン処理完了");
        } catch (error) {
            console.error("ログインエラー:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>ものしりハンター</h1>
                <p className={styles.description}>保護者の方でログインしてください</p>
                <button onClick={handleLogin} disabled={isLoading} className={styles.loginButton}>
                    <span className={styles.buttonBorder}>
                        {isLoading ? "ログイン中" : "Googleでログイン"}
                    </span>
                </button>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    );
}
