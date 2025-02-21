"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCharacterRow } from "@/utils/getCharacterRow";
import { SuccessModal } from "@/components/modal/SuccessModal";
import { updateWord } from "@/components/Word/UpDateWord";
import { WordData } from "@/types/word";
import style from "../game.module.css";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { auth } from "@/lib/firebase";

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
        try {
            setLoading(true);
            setError(null);

            if (!word?.trim()) {
                throw new Error("単語が入力されていません");
            }

            const user = auth.currentUser;
            if (!user) {
                throw new Error("ユーザー認証が必要です");
            }

            // すべての写真を新規として保存するため、常に新しいIDを生成
            const documentId = `word_${Date.now()}`;

            const wordToUpdate: WordData = {
                word: word.trim(),
                correctWord: correctWord?.trim() || word.trim(),
                description: description?.trim() || "",
                imageUrl: imageUrl?.trim() || "",
                isCorrect: word.trim() === correctWord?.trim(),
                createdAt: new Date(),
                updatedAt: new Date(),
                userId: user.uid,
            };

            const result = await updateWord(documentId, wordToUpdate);

            if (!result) {
                throw new Error("データの保存に失敗しました");
            }

            // ゲームの結果を保存
            localStorage.setItem(
                `gameData_${documentId}`,
                JSON.stringify({
                    isCorrect: wordToUpdate.isCorrect,
                    completedAt: new Date().toISOString(),
                })
            );

            // ローカルストレージのクリーンアップ
            localStorage.removeItem("wordToRegister");
            localStorage.removeItem("description");
            localStorage.removeItem("analysisTarget");
            localStorage.removeItem("gameTarget");

            // 状態のリセット
            setWord(null);
            setDescription(null);
            setImageUrl(null);
            setCorrectWord(null);

            // 成功モーダルを表示
            setIsModalOpen(true);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "予期せぬエラーが発生しました";
            console.error("保存エラー:", errorMessage);
            setError(errorMessage);
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
