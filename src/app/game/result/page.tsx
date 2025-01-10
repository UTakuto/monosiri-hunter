"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCharacterRow } from "@/utils/getCharacterRow";
import { SuccessModal } from "@/components/modal/SuccessModal";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import style from "../game.module.css";

interface WordData {
    word: string;
    description: string;
    imageUrl: string;
    createdAt: Date;
}

export const addWord = async (data: WordData) => {
    try {
        const docRef = await addDoc(collection(db, "words"), data);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};

export default function GameResult() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const word = localStorage.getItem("wordToRegister");
    const description = localStorage.getItem("description");
    const savedData = localStorage.getItem("analysisTarget");
    const imageUrl = savedData ? JSON.parse(savedData).imageUrl : null;
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        router.push("/game"); // ホームへ戻る
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
