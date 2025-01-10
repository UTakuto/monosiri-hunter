"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { takePhoto } from "@/utils/takePhoto";
import { getAdditionalLinePosition } from "@/utils/position";
import { handlePhotoCapture } from "@/utils/handlePhotoCapture";
import style from "./camera.module.css";
import Image from "next/image";
import Arrow from "@/components/button/arrow/arrow";

export default function Photography() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const additionalLineRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    // 写真撮影とクロップ処理
    const handleCapture = async () => {
        const corners = getAdditionalLinePosition(additionalLineRef);
        await handlePhotoCapture(canvasRef, corners);
    };

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

    useEffect(() => {
        const detectBrightness = () => {
            if (!videoRef.current || !canvasRef.current) return;

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            if (!context || video.videoWidth === 0 || video.videoHeight === 0) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
        };

        const interval = setInterval(detectBrightness, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className={style.controls}>
                <Arrow backPath="/" />
            </div>
            <div
                className={style.photoContainer}
                onClick={() => {
                    handleCapture();
                    takePhoto(videoRef, canvasRef, additionalLineRef, setError, router);
                }}
            >
                <div ref={additionalLineRef} className={style.additionalLine}></div>
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
