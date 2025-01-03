import { MutableRefObject } from "react";
import { useRouter } from "next/navigation";

export const takePhoto = async (
    videoRef: MutableRefObject<HTMLVideoElement | null>,
    canvasRef: MutableRefObject<HTMLCanvasElement | null>,
    additionalLineRef: MutableRefObject<HTMLDivElement | null>,
    setError: (error: string | null) => void,
    router: ReturnType<typeof useRouter>
) => {
    if (!videoRef.current || !canvasRef.current || !additionalLineRef.current) {
        setError("カメラが起動していません");
        return;
    }

    try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const rect = additionalLineRef.current.getBoundingClientRect();

        if (!context) {
            throw new Error("Canvas contextの取得に失敗しました");
        }

        // 元の画像を描画
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        // クロップ領域の計算
        const scaleX = video.videoWidth / video.offsetWidth;
        const scaleY = video.videoHeight / video.offsetHeight;
        const cropX = rect.x * scaleX;
        const cropY = rect.y * scaleY;
        const cropWidth = rect.width * scaleX;
        const cropHeight = rect.height * scaleY;

        // クロップした画像を新しいcanvasに描画
        const croppedCanvas = document.createElement("canvas");
        const croppedContext = croppedCanvas.getContext("2d");

        // 固定サイズを設定
        const FIXED_SIZE = 350;
        croppedCanvas.width = FIXED_SIZE;
        croppedCanvas.height = FIXED_SIZE;

        if (croppedContext) {
            croppedContext.drawImage(
                canvas,
                cropX,
                cropY,
                cropWidth,
                cropHeight, // ソース領域
                0,
                0,
                FIXED_SIZE,
                FIXED_SIZE // 出力サイズ
            );

            console.log("クロップ後のサイズ:", {
                width: FIXED_SIZE,
                height: FIXED_SIZE,
            });
        }

        // クロップした画像をBlobに変換
        const blob = await new Promise<Blob>((resolve, reject) => {
            croppedCanvas.toBlob(
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
