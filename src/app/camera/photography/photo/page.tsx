"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function Photo() {
    const router = useRouter();
    const [photo, setPhoto] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const photoData = localStorage.getItem("photoUrl");
        if (photoData) {
            setPhoto(photoData);
        }
    }, [photo]);

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

            // URLを保存して結果ページに遷移
            localStorage.setItem(
                "analysisTarget",
                JSON.stringify({
                    imageUrl: downloadURL,
                })
            );
            router.push("./photo/result");
        } catch (error) {
            console.error("エラー:", error);
            alert("アップロードに失敗しました。");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            {photo ? (
                <div>
                    <Image src={photo} alt="撮影した写真" width={850} height={500} />
                    <button onClick={handleUpload} disabled={uploading}>
                        {uploading ? "アップロード中..." : "いいよ！"}
                    </button>
                    <button onClick={() => router.push("../photography")}>もどる</button>
                </div>
            ) : (
                <p>写真が見つかりませんでした。</p>
            )}
        </div>
    );
}
