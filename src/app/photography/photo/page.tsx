"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { convertToWebP } from "@/utils/photoResizer";
import Arrow from "@/components/button/arrow/arrow";
import style from "../../index.module.css";
import "./photo.css";
import { getAuth } from "firebase/auth";
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function Photo() {
    const router = useRouter();
    const [photo, setPhoto] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // 写真データの取得を useCallback でメモ化
    const getPhotoData = useCallback(() => {
        const photoData = localStorage.getItem("photoUrl");
        if (photoData) {
            setPhoto(photoData);
        }
    }, []);

    // 初回マウント時のみ実行
    useEffect(() => {
        getPhotoData();
    }, [getPhotoData]);

    const handleUpload = async () => {
        if (!photo) return;
        const auth = getAuth();

        if (!auth.currentUser) {
            alert("ログインが必要です");
            return;
        }

        try {
            setUploading(true);
            const compressedImage = await convertToWebP(photo);
            const response = await fetch(compressedImage);
            const blob = await response.blob();

            // ユーザーIDを含めたパスを生成
            const fileName = `photos/${auth.currentUser.uid}/${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}.webp`;
            const storageRef = ref(storage, fileName);

            // メタデータを設定
            const metadata = {
                contentType: "image/webp",
                customMetadata: {
                    userId: auth.currentUser.uid,
                    timestamp: Date.now().toString(),
                },
            };

            // アップロード（メタデータを含める）
            await uploadBytes(storageRef, blob, metadata);
            const downloadURL = await getDownloadURL(storageRef);

            localStorage.setItem(
                "analysisTarget",
                JSON.stringify({
                    imageUrl: downloadURL,
                    timestamp: Date.now(),
                    userId: auth.currentUser.uid,
                })
            );

            router.push("./photo/result");
        } catch (error: any) {
            console.error("アップロードエラー:", error);
            if (error.code === "storage/unauthorized") {
                alert("アップロード権限がありません。再度ログインしてください。");
            } else {
                alert("アップロードに失敗しました。もう一度お試しください。");
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <RequireAuth>
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
                                priority
                            />
                        </div>
                        <div className={style.btnWrap}>
                            <h2>このしゃしんでいいかな？</h2>
                            <button
                                className="proceedBtn"
                                onClick={handleUpload}
                                disabled={uploading}
                            >
                                <span className="proceedBorder">
                                    {uploading ? "まってね" : "いいよ！"}
                                </span>
                            </button>
                            <button
                                className="removeBtn"
                                onClick={() => router.push("/photography")}
                                disabled={uploading}
                            >
                                <span className="backBorder">もどる</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-4">
                        <p>写真が見つかりませんでした。</p>
                        <button
                            className="mt-4 text-blue-500"
                            onClick={() => router.push("/photography")}
                        >
                            撮影画面に戻る
                        </button>
                    </div>
                )}
            </div>
        </RequireAuth>
    );
}
