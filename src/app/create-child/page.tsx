"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChild } from "@/hooks/useChild";
import style from "@/app/login/login.module.css";

export default function CreateChildPage() {
    const [name, setName] = useState("");
    const router = useRouter();
    const { createChild, isLoading, error } = useChild();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            await createChild(name);
            router.push("/select-child");
        } catch (error) {
            console.error("子どもアカウントの作成に失敗しました:", error);
        }
    };

    return (
        <div className={style.createContainer}>
            <div className={style.createForm}>
                <div className={style.createHeader}>
                    <h1 className={style.title}>子どもアカウントの作成</h1>
                    <p className={style.description}>お子様の名前を入力してください</p>
                </div>

                <form onSubmit={handleSubmit} className={style.form}>
                    <div>
                        <label htmlFor="name" className={style.label}>
                            お名前
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={style.input}
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className={style.submitButton}>
                        <span className={style.submitBorder}>
                            {isLoading ? "作成中" : "アカウントを作成"}
                        </span>
                    </button>

                    {error && <p className={style.error}>{error}</p>}
                </form>
            </div>
        </div>
    );
}
