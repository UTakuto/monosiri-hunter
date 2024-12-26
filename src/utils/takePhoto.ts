import { MutableRefObject } from "react";
import { useRouter } from "next/navigation";

export const takePhoto = async (
    videoRef: MutableRefObject<HTMLVideoElement | null>,
    canvasRef: MutableRefObject<HTMLCanvasElement | null>,
    setError: (error: string | null) => void,
    router: ReturnType<typeof useRouter>
) => {
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
