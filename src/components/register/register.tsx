"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import "./register.css";
interface RegisterProps {
    word: string;
    onClose: () => void;
}
interface AnalysisData {
    name: string;
    description: string;
}
export default function Register({ word, onClose }: RegisterProps) {
    const router = useRouter();
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

    useEffect(() => {
        try {
            // analysisTargetからデータを取得
            const targetData = localStorage.getItem("analysisTarget");
            if (!targetData) {
                console.error("analysisTarget not found");
                return;
            }

            // gameTargetから元の単語を取得
            const gameData = localStorage.getItem("gameTarget");
            if (!gameData) {
                console.error("gameTarget not found");
                return;
            }

            JSON.parse(targetData);
            const { original } = JSON.parse(gameData);

            // 分析データを設定
            setAnalysisData({
                name: original,
                description: localStorage.getItem("description") || "説明がありません",
            });
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }, []);

    const handleRegister = async () => {
        try {
            const targetData = localStorage.getItem("analysisTarget");
            if (!targetData) {
                throw new Error("画像URLが見つかりません");
            }

            const { imageUrl } = JSON.parse(targetData);
            if (!imageUrl || !analysisData?.description) {
                throw new Error("必要なデータが不足しています");
            }

            // Firestoreにデータを保存
            const docRef = await addDoc(collection(db, "words"), {
                name: word,
                description: analysisData.description,
                createdAt: new Date(),
                imageUrl: imageUrl,
            });

            console.log("Document written with ID:", docRef.id);
            alert("しらべたものをとうろくしました！");

            // データクリーンアップ
            localStorage.removeItem("analysisTarget");
            localStorage.removeItem("gameTarget");
            localStorage.removeItem("description");

            router.push("/");
        } catch (error) {
            console.error("Error adding document:", error);
            alert("とうろくに しっぱい しました");
        }
    };
    return (
        <div className="registerModal">
            <div className="modalContent">
                <h2 className="modalTitle">とうろくする？</h2>
                <div className="wordDisplay">
                    <p className="word">{word}</p>
                    {analysisData && <p className="description">{analysisData.description}</p>}
                </div>
                <div className="buttonContainer">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 ml-4"
                    >
                        やめる
                    </button>
                    <button
                        onClick={handleRegister}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        とうろくする
                    </button>
                </div>
            </div>
        </div>
    );
}
