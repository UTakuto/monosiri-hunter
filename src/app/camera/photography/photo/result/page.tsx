"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import style from "../../../camera.module.css";

interface AnalysisResult {
    content: string;
    imageUrl: string;
}

export default function Result() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [analyzing, setAnalyzing] = useState(true);

    useEffect(() => {
        const analyze = async () => {
            try {
                const savedData = localStorage.getItem("analysisTarget");
                if (!savedData) {
                    router.push("./camera/photography");
                    return;
                }

                const { imageUrl } = JSON.parse(savedData);

                const response = await fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: imageUrl }),
                });

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }

                setResult({
                    content: data.result.choices[0].message.content,
                    imageUrl: imageUrl,
                });
            } catch (error) {
                console.error("分析エラー:", error);
                alert("画像の分析に失敗しました。");
            } finally {
                setAnalyzing(false);
            }
        };

        analyze();
    }, [router]);

    return (
        <div className={style.container}>
            <div className={style.header}>
                <button
                    onClick={() => router.push("/camera/photography")}
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
                    <h1 className={style.resultText}>{result.content}</h1>
                </div>
            ) : (
                <p className={style.loading}>しゃしんがなかったよ</p>
            )}
        </div>
    );
}
