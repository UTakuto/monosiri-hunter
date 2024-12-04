// app/result/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import Image from "next/image";

interface AnalysisResult {
    content: string;
    imageUrl: string;
}

export default function Result() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        const savedResult = localStorage.getItem("analysisResult");
        if (savedResult) {
            setResult(JSON.parse(savedResult));
        } else {
            router.push("/photography");
        }
    }, [router]);

    return (
        <div className="container mx-auto p-4">
            <p className="text-2xl font-bold mb-6">これは、</p>
            {result ? (
                <div className="space-y-4">
                    {/* <Image
                        src={result.imageUrl}
                        alt="分析した写真"
                        className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                        width={500}
                        height={500}
                    /> */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-xl font-semibold mb-4">{result.content}</h1>
                        {/* <p className="whitespace-pre-wrap text-gray-700">{result.content}</p> */}
                    </div>
                    {/* <button
                        onClick={() => router.push("/photography")}
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        あたらしいしゃしんをとる
                    </button> */}
                </div>
            ) : (
                <p>よみこみちゅう</p>
            )}
        </div>
    );
}
