"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    const [result, setResult] = useState<Result | null>(null);

    useEffect(() => {
        const photoData = localStorage.getItem("photoData");
        if (photoData) {
            setPhoto(photoData);
        }
    }, []);

    const handleAnalyze = async () => {
        if (!photo) return;

        try {
            const response = await fetch("../../api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: photo }),
            });

            const data = await response.json();
            if (data.error) {
                setResult({ error: `Error: ${data.error}` });
            } else {
                setResult(data.result);
            }
        } catch (error) {
            console.log("Error analyzing image:", error);
            // setResult(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            {photo ? (
                <div>
                    <Image src={photo} alt="撮影した写真" width={700} height={500} />
                    <button onClick={handleAnalyze}>写真を分析</button>
                    <button onClick={() => router.push("../photography")}>戻る</button>
                    {result && result.choices && result.choices[0] && (
                        <pre>分析結果: {result.choices[0].message.content}</pre>
                    )}
                </div>
            ) : (
                <p>写真が見つかりませんでした。</p>
            )}
        </div>
    );
}
