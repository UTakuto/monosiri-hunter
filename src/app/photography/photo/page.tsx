"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { convertToWebP } from "@/utils/photoResizer";
import Arrow from "@/components/button/arrow/arrow";
import style from "../../index.module.css";
import "./photo.css";

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

            const getPhotoUrl = async (path: string) => {
                const reference = ref(storage, path);
                const url = await getDownloadURL(reference);
                return url;
            };

            // 画像を圧縮
            const compressedImage = await convertToWebP(photo);

            // Firebase Storageにアップロード
            const response = await fetch(compressedImage);
            const blob = await response.blob();
            const fileName = `photos/${Date.now()}.webp`; // 拡張子をwebpに変更
            const storageRef = ref(storage, fileName);

            await uploadBytes(storageRef, blob);
            console.log(`圧縮された画像をアップロードしました: ${fileName}`);

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
        <div className={style.container}>
            <Arrow backPath="/photography" />
            {photo ? (
                <div className={style.wrapper}>
                    <div className="imageWrapper">
                        <Image
                            className="takeImage"
                            src={photo}
                            alt="撮影した写真"
                            width={330}
                            height={330}
                        />
                    </div>
                    <div className={style.btnWrap}>
                        <h2>このしゃしんでいいかな？</h2>
                        <button className="proceedBtn" onClick={handleUpload} disabled={uploading}>
                            <span className="proceedBorder">
                                {uploading ? "まってね" : "いいよ！"}
                            </span>
                        </button>
                        <button className="removeBtn" onClick={() => router.push("/photography")}>
                            <span className="backBorder">もどる</span>
                        </button>
                    </div>
                </div>
            ) : (
                <p>写真が見つかりませんでした。</p>
            )}
        </div>
    );
}
