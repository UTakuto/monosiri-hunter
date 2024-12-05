"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import style from "../../../camera.module.css";

interface AnalysisResult {
    name: string; // 名前のみを保存
    description: string; // 説明文を保存
    imageUrl: string;
}

export default function Result() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [analyzing, setAnalyzing] = useState(true);

    const handleScreenTap = () => {
        if (result?.name) {
            // nameを使用するように変更
            const characters = result.name.split(""); // 名前のみを分割
            const shuffled = characters.sort(() => Math.random() - 0.5);

            localStorage.setItem(
                "gameTarget",
                JSON.stringify({
                    original: result.name, // 名前のみを保存
                    shuffled: shuffled,
                })
            );

            router.push("/game");
        }
    };

    useEffect(() => {
        const abortController = new AbortController();

        const analyze = async () => {
            try {
                const savedData = localStorage.getItem("analysisTarget");
                if (!savedData) {
                    router.push("../../../camera/photography");
                    return;
                }

                const { imageUrl } = JSON.parse(savedData);
                const response = await fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: imageUrl }),
                    signal: abortController.signal, // アボートシグナルを追加
                });

                const data = await response.json();

                // コンポーネントがマウントされている場合のみ状態を更新
                if (!abortController.signal.aborted) {
                    console.log("API Response:", data);
                    // ... 残りの処理
                }
            } catch (error) {
                if ((error as any).name === "AbortError") {
                    console.log("Fetch aborted");
                    return;
                }
                console.error("分析エラー:", error);
            } finally {
                if (!abortController.signal.aborted) {
                    setAnalyzing(false);
                }
            }
        };

        analyze();

        // クリーンアップ関数
        return () => {
            abortController.abort();
        };
    }, [router]);

    return (
        <div className={style.container} onClick={handleScreenTap} style={{ cursor: "pointer" }}>
            <div className={style.header}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push("/camera/photography");
                    }}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    もどる
                </button>
                <p className={style.headerText}>これは、</p>
            </div>
            {analyzing ? (
                <p className={style.loading}>しらべているよ...</p>
            ) : result ? (
                <div className={style.resultContainer}>
                    <h1 className={style.resultText}>
                        {/* 名前のみを一文字ずつ表示 */}
                        {result.name.split("").map((char, index) => (
                            <span key={index}>{char}</span>
                        ))}
                    </h1>
                    {/* 説明文を別途表示 */}
                    <p className={style.descriptionText}>{result.description}</p>
                </div>
            ) : (
                <p className={style.loading}>しゃしんがなかったよ</p>
            )}
        </div>
    );
}
