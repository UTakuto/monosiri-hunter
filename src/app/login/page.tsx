"use client";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import styles from "./login.module.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

export default function Login() {
    const { signInWithGoogle, isLoading, error } = useAuth();

    // const router = useRouter();
    // const { signInWithGoogle, isLoading, error } = useAuth();

    // useEffect(() => {
    //     const auth = getAuth();
    //     if (auth.currentUser) {
    //         router.push("/");
    //     }
    // }, [router]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* <h1 className={styles.title}>ものしりハンター</h1> */}
                <div className={styles.imageWrapper}>
                    <Image
                        src="/logo.png"
                        alt="ものしりハンターロゴ"
                        width={280}
                        height={150}
                        priority
                    />
                </div>
                <p className={styles.description}>保護者の方でログインしてください</p>
                <div className={styles.formContainer}>
                    <button
                        onClick={signInWithGoogle}
                        disabled={isLoading}
                        className={styles.loginButton}
                    >
                        <div className={styles.buttonContent}>
                            <span>{isLoading ? "ログイン中" : "Googleでログイン"}</span>
                        </div>
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                </div>
            </div>
        </div>
    );
}
