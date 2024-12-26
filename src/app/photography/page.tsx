"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Arrow from "@/components/button/arrow/arrow";
import style from "./camera.module.css";
import Image from "next/image";

export default function Photography() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        const startCamera = async () => {
            try {
                if (!navigator.mediaDevices?.getUserMedia) {
                    throw new Error("カメラへのアクセスがサポートされていません");
                }

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment",
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                    },
                });

                if (videoElement) {
                    videoElement.srcObject = stream;
                    videoElement.onloadedmetadata = () => {
                        videoElement.play();
                    };
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "カメラの起動に失敗しました";
                setError(errorMessage);
            }
        };

        startCamera();

        return () => {
            if (videoElement?.srcObject) {
                const tracks = (videoElement.srcObject as MediaStream).getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    const takePhoto = async () => {
        if (!videoRef.current || !canvasRef.current) {
            setError("カメラが起動していません");
            return;
        }

        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            if (!context) {
                throw new Error("Canvas contextの取得に失敗しました");
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("画像の生成に失敗しました"));
                    },
                    "image/jpeg",
                    0.95
                );
            });

            const url = URL.createObjectURL(blob);
            localStorage.setItem("photoUrl", url);
            router.push("./photography/photo");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "写真の撮影に失敗しました";
            setError(errorMessage);
        }
    };

    return (
        <>
            <div className={style.controls}>
                <Arrow />
                {/* <button onClick={takePhoto}>撮影</button> */}
            </div>
            <div className={style.photoContainer} onClick={takePhoto}>
                <div className={style.additionalLine}></div>
                <div className={style.firstFrame}></div>
                <div className={style.secondFrame}></div>
                <div className={style.centerLine}></div>
                <video ref={videoRef} className={style.video} playsInline autoPlay muted />
                <canvas ref={canvasRef} className={style.canvas} />
                <Image
                    src="/handGesture.png"
                    alt="タップしてね"
                    className={style.handGestureImg}
                    width={280}
                    height={210}
                />
                {error && <div className={style.error}>{error}</div>}
            </div>
        </>
    );
}
