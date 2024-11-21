"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import style from "./camera.module.css";

// onCaptureプロップを受け取るように変更
export default function CameraComponent() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // カメラの起動を管理するuseState
    const [isCameraOn, setIsCameraOn] = useState(false);

    // 撮影した写真をbase64で保存しているuseState
    const [capturedPhoto, setCapturePhoto] = useState<string | undefined>();

    // カメラを起動する関数
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraOn(true);
        } catch (err) {
            console.error("カメラのアクセスに失敗しました", err);
        }
    };

    // 写真を撮影する関数
    const takePicture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                context.drawImage(
                    videoRef.current,
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                );
                const dataUrl = canvasRef.current.toDataURL("image/png");
                setCapturePhoto(dataUrl);
            }
        }
    };

    return (
        <>
            <div className={style.cameraCompoWrap}>
                {/* カメラ映像を表示するビデオタグ */}
                <video ref={videoRef} autoPlay playsInline className={style.cameraVideo}></video>
                <canvas
                    ref={canvasRef}
                    style={{ width: 640, height: 480, display: "none" }}
                ></canvas>
                <div className={style.buttonBox}>
                    {!isCameraOn ? (
                        <button onClick={startCamera}>カメラ起動</button>
                    ) : (
                        <button onClick={takePicture}>写真を撮影</button>
                    )}
                </div>

                {/* 写真がしっかりと保存されているか確認するコンテンツ */}
                <div>
                    <h3>撮影した写真</h3>
                    <figure>
                        {capturedPhoto && (
                            <Image
                                src={capturedPhoto}
                                alt="撮影した写真"
                                className={style.image}
                                layout="responsive"
                                width={500}
                                height={500}
                            />
                        )}
                    </figure>
                </div>
            </div>
        </>
    );
}
