"use client";
import { useRouter } from "next/navigation";
import style from "./camera.module.css";

export default function Camera() {
    const router = useRouter();

    const startCamera = () => {
        // カメラプレビュー用のページに遷移
        router.push("./camera/photography");
    };

    return (
        <div className={style.cameraCompoWrap}>
            <div className={style.buttonBox}>
                <button onClick={startCamera}>カメラ起動</button>
            </div>
        </div>
    );
}
