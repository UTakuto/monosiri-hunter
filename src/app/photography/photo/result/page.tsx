"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import style from "../../camera.module.css";
import Arrow from "@/components/button/arrow/arrow";
import gameStyle from "@/app/game/game.module.css";
import { getCharacterRow } from "@/utils/getCharacterRow";
import { toHiragana } from "@/utils/kanaConverter";

interface AnalysisResult {
    name: string;
    description: string;
    imageUrl: string;
}

export default function Result() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [analyzing, setAnalyzing] = useState(true);

    const handleScreenTap = () => {
        if (result?.name) {
            const characters = result.name.split("");
            const shuffled = characters.sort(() => Math.random() - 0.5);
            localStorage.setItem(
                "gameTarget",
                JSON.stringify({
                    original: result.name,
                    shuffled: shuffled,
                })
            );
            router.push("/findDescription/Description");
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

                if (data.error) {
                    throw new Error(data.error);
                }

                const content = data.result.choices[0].message.content;
                const [rawName, ...descriptionParts] = content.split("\n").filter(Boolean);

                const namePattern =
                    /^(ものの名前|物体の名前|物体のなまえ|ぶったいのなまえ|ぶったいの名前|もしばんごう|もじ番号|文字ばんごう)[:：]/;
                const name = toHiragana(rawName.replace(namePattern, "").trim().replace(/。$/, ""));

                const descriptionPattern =
                    /^(せつめい|説明文|せつめい文|説明ぶん|せつめいぶん)[:：]/;
                const description = descriptionParts
                    .join(" ")
                    .replace(descriptionPattern, "")
                    .trim()
                    .replace(/。$/, "");

                localStorage.setItem("description", description);

                setResult({
                    name,
                    description: description || "説明はありません",
                    imageUrl,
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

    const handleReAnalyze = async () => {
        setAnalyzing(true);
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
                body: JSON.stringify({
                    image: imageUrl,
                    message: "もう一度分析してください。",
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const content = data.result.choices[0].message.content;
            const [rawName, ...descriptionParts] = content.split("\n").filter(Boolean);

            const namePattern =
                /^(ものの名前|物体の名前|物体のなまえ|ぶったいのなまえ|ぶったいの名前|もしばんごう|もじ番号|文字ばんごう)[:：]/;
            const name = toHiragana(rawName.replace(namePattern, "").trim().replace(/。$/, ""));

            const descriptionPattern = /^(せつめい|説明文|せつめい文|説明ぶん|せつめいぶん)[:：]/;
            const description = descriptionParts
                .join(" ")
                .replace(descriptionPattern, "")
                .trim()
                .replace(/。$/, "");

            localStorage.setItem("description", description);

            setResult({
                name,
                description: description || "説明はありません",
                imageUrl,
            });
        } catch (error) {
            console.error("再分析エラー:", error);
            alert("画像の再分析に失敗しました。");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className={style.resultContainer} onClick={handleScreenTap}>
            <div className={style.header}>
                <Arrow backPath="/photography/photo" />
                <p className={style.headerText}>これは、</p>
            </div>
            {analyzing ? (
                <p className={style.loading}>しらべているよ...</p>
            ) : result ? (
                <>
                    <div className={style.resultContents}>
                        <h1 className={style.resultText}>
                            {result.name.split("").map((char, index) => (
                                <button
                                    key={index}
                                    className={`
                                        ${gameStyle.hiraganaChar}
                                        ${gameStyle.resultChar}
                                        ${gameStyle[getCharacterRow(char)]}
                                    `}
                                >
                                    {char}
                                </button>
                            ))}
                        </h1>
                        <p className={style.descriptionText}>{result.description}</p>
                        <div className={style.reAnalyzeWrap}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleReAnalyze();
                                }}
                                className={style.reAnalyzeButton}
                            >
                                もういちどしらべる
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <p className={style.loading}>しゃしんがなかったよ</p>
            )}
        </div>
    );
}
