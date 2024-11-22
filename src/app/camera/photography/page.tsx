"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CameraPreview() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const startCamera = async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play();
                    };
                }
            }
        };
        startCamera();
    }, []);

    const takePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext("2d");
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/png");
                setPhoto(dataUrl);
                localStorage.setItem("photoData", dataUrl);
                router.push(`./photography/photo`);

                console.log(dataUrl);
            }
        }
    };

    return (
        <div>
            <video ref={videoRef} width="100%" height="100vh" />
            <button onClick={takePhoto}>撮影</button>
        </div>
    );
}
