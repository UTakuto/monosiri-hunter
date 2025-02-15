"use client";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import styles from "./login.module.css";

export default function Login() {
    const { signInWithGoogle, isLoading, error } = useAuth();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>ものしりハンター</h1>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/images/login-hero.png"
                            alt="ものしりハンターロゴ"
                            width={200}
                            height={200}
                            priority
                        />
                    </div>
                </div>

                <div className={styles.formContainer}>
                    <p className={styles.description}>保護者の方でログインしてください</p>
                    <button
                        onClick={signInWithGoogle}
                        disabled={isLoading}
                        className={styles.loginButton}
                    >
                        <div className={styles.buttonContent}>
                            <Image
                                src="/images/google-logo.png"
                                alt="Googleロゴ"
                                width={24}
                                height={24}
                            />
                            <span>{isLoading ? "ログイン中..." : "Googleでログイン"}</span>
                        </div>
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                </div>
            </div>
        </div>
    );
}
