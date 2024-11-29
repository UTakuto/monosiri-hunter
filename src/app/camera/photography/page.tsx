"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

            // キャンバスサイズをビデオサイズに合わせる
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // ビデオフレームをキャンバスに描画
            context.drawImage(video, 0, 0);

            // 画像をBlobに変換
            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error("画像の生成に失敗しました"));
                        }
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
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            <video
                ref={videoRef}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
                playsInline
                autoPlay
                muted
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div
                style={{
                    position: "absolute",
                    bottom: "20px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                }}
            >
                <button onClick={takePhoto}>撮影</button>
                <button onClick={() => router.push("/")}>戻る</button>
            </div>
            {error && (
                <div
                    style={{
                        position: "absolute",
                        top: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(170, 0, 0, 0.8)",
                        color: "white",
                        padding: "10px",
                        borderRadius: "5px",
                    }}
                >
                    {error}
                </div>
            )}
        </div>
    );
}
