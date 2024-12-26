"use client";
import { useRouter } from "next/navigation";
import style from "@/app/photography/camera.module.css";
import Image from "next/image";

export default function Camera() {
    const router = useRouter();

    const startCamera = () => {
        // カメラプレビュー用のページに遷移
        router.push("./photography");
    };

    return (
        <div className={style.cameraCompoWrap}>
            <div className={style.buttonBox}>
                <button className={style.cameraButton} onClick={startCamera}>
                    <span className={style.border}>みつける</span>
                    <Image
                        className={style.searchPicture}
                        src="/searchImage.png"
                        alt=""
                        width={90}
                        height={75}
                    />
                </button>
            </div>
        </div>
    );
}
