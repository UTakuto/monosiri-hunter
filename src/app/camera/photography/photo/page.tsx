"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Photo() {
    const router = useRouter();
    const [photo, setPhoto] = useState<string | null>(null);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const photoData = query.get("photo");
        if (photoData) {
            setPhoto(photoData);
        }
    }, []);

    return (
        <div>
            {photo ? (
                <div>
                    <Image src={photo} alt="撮影した写真" />
                    <button onClick={() => router.push("/cameraPreview")}>戻る</button>
                </div>
            ) : (
                <p>写真が見つかりませんでした。</p>
            )}
        </div>
    );
}
