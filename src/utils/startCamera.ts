import { MutableRefObject } from "react";

export const startCamera = async (
    videoRef: MutableRefObject<HTMLVideoElement | null>,
    setError: (error: string | null) => void
) => {
    const videoElement = videoRef.current;

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
        const errorMessage = err instanceof Error ? err.message : "カメラの起動に失敗しました";
        setError(errorMessage);
    }

    return () => {
        if (videoElement?.srcObject) {
            const tracks = (videoElement.srcObject as MediaStream).getTracks();
            tracks.forEach((track) => track.stop());
        }
    };
};
