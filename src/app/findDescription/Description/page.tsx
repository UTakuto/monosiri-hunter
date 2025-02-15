"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Arrow from "@/components/button/arrow/arrow";
import style from "../findDescription.module.css";

export default function Page() {
    const router = useRouter();
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // コンポーネントマウント時にアニメーションを開始
        setIsAnimating(true);

        // アニメーション完了後にページ遷移
        const timer = setTimeout(() => {
            router.push("/game");
        }, 2000); // アニメーション時間と同じ2秒

        return () => clearTimeout(timer);
    }, [router]); // 空の依存配列で一度だけ実行

    return (
        <div>
            <Arrow backPath="/photography/photo/result" />
            <div className={style.findWrapper}>
                <div className={style.cardAnimationContainer}>
                    <div className={`${style.card1} ${isAnimating ? style.animate : ""}`}></div>
                    <div className={`${style.card2} ${isAnimating ? style.animate : ""}`}></div>
                    <div className={`${style.card3} ${isAnimating ? style.animate : ""}`}></div>
                </div>
            </div>
        </div>
    );
}
