"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCharacterRow } from "@/utils/getCharacterRow";
import { SuccessModal } from "@/components/modal/SuccessModal";
import { updateWord } from "@/components/Word/UpDateWord";
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
    const [correctWord, setCorrectWord] = useState<string | null>(null);

    useEffect(() => {
        setWord(localStorage.getItem("wordToRegister"));
        setDescription(localStorage.getItem("description"));
        const savedData = localStorage.getItem("analysisTarget");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setImageUrl(parsed.imageUrl);
        }

        // 正解の単語を取得
        const gameTarget = localStorage.getItem("gameTarget");
        if (gameTarget) {
            const { original } = JSON.parse(gameTarget);
            setCorrectWord(original);
        }
    }, []);

    const handleRegister = async () => {
        if (!word?.trim() || !correctWord) {
            setError("必要な情報がそろっていません");
            return console.log(error);
        }

        setLoading(true);
        setError(null);

        try {
            // 既存のデータで更新するためのオブジェクトを作成
            const wordToUpdate: WordData = {
                word: word.trim(),
                correctWord: correctWord.trim(),
                description: description?.trim() || "",
                imageUrl: imageUrl?.trim() || "",
                isCorrect: word.trim() === correctWord.trim(),
                updatedAt: new Date(),
                createdAt: new Date(),
            };

            // ゲームデータからIDを取得
            const gameTarget = localStorage.getItem("gameTarget");
            const gameData = gameTarget ? JSON.parse(gameTarget) : null;
            const docId = gameData?.id;

            if (docId) {
                // 既存のドキュメントを更新
                await updateWord(docId, wordToUpdate);

                // ローカルストレージのクリーンアップ
                localStorage.removeItem("wordToRegister");
                localStorage.removeItem("description");
                localStorage.removeItem("analysisTarget");
                localStorage.removeItem("gameTarget");

                // 正解記録を保存
                if (wordToUpdate.isCorrect) {
                    localStorage.setItem(
                        `gameData_${docId}`,
                        JSON.stringify({
                            isCorrect: true,
                            completedAt: new Date().toISOString(),
                        })
                    );
                }

                // 状態のリセット
                setWord(null);
                setDescription(null);
                setImageUrl(null);
                setCorrectWord(null);

                // 成功モーダルの表示
                setIsModalOpen(true);
            }
        } catch (err: unknown) {
            console.error("更新エラー:", err);
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
