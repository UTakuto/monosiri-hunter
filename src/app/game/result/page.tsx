"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCharacterRow } from "@/utils/getCharacterRow";
import { SuccessModal } from "@/components/modal/SuccessModal";
import { addWord } from "@/components/Word/AddWord";
import style from "../game.module.css";

export default function GameResult() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [word, setWord] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // クライアントサイドでのみデータを取得
        setWord(localStorage.getItem("wordToRegister"));
        setDescription(localStorage.getItem("description"));
        const savedData = localStorage.getItem("analysisTarget");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setImageUrl(parsed.imageUrl);
        }
    }, []);

    const handleRegister = async () => {
        if (!word || !description || !imageUrl) {
            setError("しっぱいしました。もういちどやりなおしてください。");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await addWord({
                word,
                description,
                imageUrl,
                createdAt: new Date(),
            });

            if (result) {
                setIsModalOpen(true);
                // ローカルストレージのクリーンアップ
                localStorage.removeItem("wordToRegister");
                localStorage.removeItem("description");
                localStorage.removeItem("analysisTarget");
            }
        } catch (err) {
            console.error("登録エラー:", err);
            setError("しっぱいしました。もういちどやりなおしてください。");
            console.log("登録エラー:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cleanup = () => {
            setIsModalOpen(false);
            setLoading(false);
            setError(null);
        };

        return cleanup;
    }, []);

    const handleBack = () => {
        router.push("/photography"); // カメラ画面戻る
        console.log(loading);
    };

    return (
        <div className={style.container}>
            <div className={style.resultContainer}>
                {word && (
                    <div className={style.contentWrapper}>
                        <div className={style.wordDisplay}>
                            {word.split("").map((char, index) => (
                                <p
                                    key={index}
                                    className={`
                                        ${style.wordChar}
                                        ${style.resultChar}
                                        ${style[getCharacterRow(char)]}
                                    `}
                                >
                                    {char}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
                {/* </div> */}
                <div className={style.descriptionContainer}>
                    <p className={style.descriptionText}>{description || "説明文がありません"}</p>
                </div>
                <div className={style.resultButtonContainer}>
                    <button className={style.gameBackButton} onClick={handleBack}>
                        もういっかい
                    </button>
                    <button className={style.gameSubmitButton} onClick={handleRegister}>
                        げっとする
                    </button>
                </div>
            </div>
            <SuccessModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    router.push("/pictureBook");
                }}
            />
        </div>
    );
}
