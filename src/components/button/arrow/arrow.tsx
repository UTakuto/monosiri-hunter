"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./arrow.css";

interface ArrowProps {
    backPath: string;
}

export default function Arrow({ backPath }: ArrowProps) {
    const router = useRouter();

    const handleBack = () => {
        try {
            // パスが undefined または null の場合のフォールバック
            const validPath = backPath || "/";

            // パスが '/' で始まることを確認
            const normalizedPath = validPath.startsWith("/") ? validPath : `/${validPath}`;

            router.push(normalizedPath);
        } catch (error) {
            console.error("Navigation error:", error);
            // エラー時はホームにリダイレクト
            router.push("/");
        }
    };

    return (
        <div className="backBtnWrap" onClick={handleBack}>
            <div className="backBtn">
                <div className="image">
                    <Image src="/arrow.png" alt="戻る" width={50} height={50} />
                </div>
            </div>
        </div>
    );
}
