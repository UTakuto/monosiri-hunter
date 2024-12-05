// components/Register/register.tsx を修正
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
        // analysisResultからデータを取得
        const savedData = localStorage.getItem("analysisResult");
        console.log("LocalStorage data:", savedData);

        if (savedData) {
            const parsedData = JSON.parse(savedData);
            console.log("Parsed analysis data:", parsedData);
            setAnalysisData(parsedData);
        }
    }, []);

    const handleRegister = async () => {
        try {
            if (!analysisData?.description) {
                throw new Error("説明文が見つかりません");
            }

            // 画像URLを取得
            const imageUrl = localStorage.getItem("analysisTarget");
            if (!imageUrl) {
                throw new Error("画像URLが見つかりません");
            }
            const { imageUrl: storedImageUrl } = JSON.parse(imageUrl);

            // Firestoreにデータを保存
            const docRef = await addDoc(collection(db, "words"), {
                name: word,
                description: analysisData.description,
                createdAt: new Date(),
                imageUrl: storedImageUrl, // 画像URLを保存
            });

            console.log("Document written with ID:", docRef.id);
            alert("しらべたものをとうろくしました！");

            localStorage.removeItem("analysisResult");
            localStorage.removeItem("gameTarget");
            localStorage.removeItem("analysisTarget");

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
