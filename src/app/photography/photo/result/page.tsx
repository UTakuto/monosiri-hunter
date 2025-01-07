"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import style from "../../camera.module.css";
import Arrow from "@/components/button/arrow/arrow";

interface AnalysisResult {
    name: string; // 名前のみを保存
    description: string; // 説明文を保存
    imageUrl: string;
}

export default function Result() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [analyzing, setAnalyzing] = useState(true);

    // 画面タップ処理の追加
    // app/photo/result/page.tsx の修正
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
        const analyze = async () => {
            try {
                const savedData = localStorage.getItem("analysisTarget");
                if (!savedData) {
                    router.push("../../photography");
                    return;
                }

                const { imageUrl } = JSON.parse(savedData);
                const response = await fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: imageUrl }),
                });

                const data = await response.json();
                console.log("API Response:", data);

                if (data.error) {
                    throw new Error(data.error);
                }

                const content = data.result.choices[0].message.content;
                const [rawName, ...descriptionParts] = content.split("\n").filter(Boolean);

                // 名前の正規表現パターンを拡張
                const namePattern =
                    /^(ものの名前|物体の名前|物体のなまえ|ぶったいのなまえ|ぶったいの名前|もしばんごう|もじ番号|文字ばんごう)[:：]/;
                const name = rawName.replace(namePattern, "").trim();

                // 説明文の正規表現パターンを拡張
                const descriptionPattern =
                    /^(せつめい|説明文|せつめい文|説明ぶん|せつめいぶん)[:：]/;
                const description = descriptionParts
                    .join(" ")
                    .replace(descriptionPattern, "")
                    .trim();

                // 説明文をlocalStorageに保存
                localStorage.setItem("description", description);

                setResult({
                    name,
                    description: description || "説明はありません",
                    imageUrl,
                });

                console.log("Result:", { name, description });
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
        // containerにonClickイベントを追加
        <div
            className={style.resultContainer}
            onClick={handleScreenTap}
            style={{ cursor: "pointer" }}
        >
            <div className={style.header}>
                {/* <button
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push("/photography");
                            }}
                            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                            もどる
                            </button> */}
                <Arrow />
                <p className={style.headerText}>これは、</p>
            </div>
            {analyzing ? (
                <p className={style.loading}>しらべているよ...</p>
            ) : result ? (
                <div className={style.resultContents}>
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
