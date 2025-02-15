"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCharacterRow } from "@/utils/getCharacterRow";
import { SuccessModal } from "@/components/modal/SuccessModal";
import { addWord } from "@/components/Word/AddWord";
import { WordData } from "@/types/word";
import style from "../game.module.css";
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function GameResult() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [word, setWord] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setWord(localStorage.getItem("wordToRegister"));
        setDescription(localStorage.getItem("description"));
        const savedData = localStorage.getItem("analysisTarget");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setImageUrl(parsed.imageUrl);
        }
    }, []);

    const handleRegister = async () => {
        if (!word?.trim() || !description?.trim() || !imageUrl?.trim()) {
            setError("必要な情報がそろっていません");
            return console.log(error);
        }

        setLoading(true);
        setError(null);

        try {
            const wordToAdd: WordData = {
                word: word.trim(),
                description: description.trim(),
                imageUrl: imageUrl.trim(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const docId = await addWord(wordToAdd);

            if (docId) {
                // ローカルストレージのクリーンアップ
                localStorage.removeItem("wordToRegister");
                localStorage.removeItem("description");
                localStorage.removeItem("analysisTarget");

                // 状態のリセット
                setWord(null);
                setDescription(null);
                setImageUrl(null);

                // 成功モーダルの表示
                setIsModalOpen(true);
            }
        } catch (err: unknown) {
            console.error("登録エラー:", err);
            setError(err instanceof Error ? err.message : "予期せぬエラーが発生しました");
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
        <RequireAuth>
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
                        <p className={style.descriptionText}>
                            {description || "説明文がありません"}
                        </p>
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
        </RequireAuth>
    );
}
