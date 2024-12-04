"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface Result {
    choices?: {
        message: {
            content: string;
        };
    }[];
    error?: string;
}

export default function Photo() {
    const router = useRouter();
    const [photo, setPhoto] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<Result | null>(null);

    useEffect(() => {
        const photoData = localStorage.getItem("photoUrl");
        if (photoData) {
            setPhoto(photoData);
        }
    }, [photo]);

    const handleAnalyze = async (imageUrl: string) => {
        try {
            setAnalyzing(true);
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: imageUrl }),
            });

            const data = await response.json();
            if (data.error) {
                setResult({ error: `Error: ${data.error}` });
            } else {
                setResult(data.result);
            }
        } catch (error) {
            console.error("Error analyzing image:", error);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleUpload = async () => {
        if (!photo) return;

        try {
            setUploading(true);

            // Firebase Storageにアップロード
            const response = await fetch(photo);
            const blob = await response.blob();
            const fileName = `photos/${Date.now()}.jpg`;
            const storageRef = ref(storage, fileName);

            await uploadBytes(storageRef, blob);
            console.log(`画像をアップロードしました: ${fileName}`);

            // アップロードした画像のURLを取得
            const downloadURL = await getDownloadURL(storageRef);
            console.log("画像URL:", downloadURL);

            // OpenAI APIで画像分析
            await handleAnalyze(downloadURL);

            // 結果を保存して結果ページに遷移
            if (result?.choices?.[0]?.message?.content) {
                localStorage.setItem(
                    "analysisResult",
                    JSON.stringify({
                        content: result.choices[0].message.content,
                        imageUrl: downloadURL,
                    })
                );
                router.push("./photo/result");
            }
        } catch (error) {
            console.error("エラー:", error);
            alert("処理に失敗しました。");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            {photo ? (
                <div>
                    <Image src={photo} alt="撮影した写真" width={850} height={500} />
                    <button onClick={handleUpload} disabled={uploading || analyzing}>
                        {uploading
                            ? "アップロード中..."
                            : analyzing
                            ? "しらべているよ..."
                            : "いいよ！"}
                    </button>
                    <button onClick={() => router.push("../photography")}>もどる</button>
                    {/* {result && result.choices && result.choices[0] && (
                        <div className="mt-4">
                            <h3>分析結果:</h3>
                            <pre>{result.choices[0].message.content}</pre>
                        </div>
                    )} */}
                </div>
            ) : (
                <p>写真が見つかりませんでした。</p>
            )}
        </div>
    );
}
