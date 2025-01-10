import { MutableRefObject } from "react";
import { cropImageWithVisionAPI } from "./visionApi";

interface Corners {
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
}

export const handlePhotoCapture = async (
    canvasRef: MutableRefObject<HTMLCanvasElement | null>,
    corners: Corners | undefined
) => {
    if (!canvasRef.current || !corners) {
        throw new Error("必要なパラメータが不足しています");
    }

    try {
        const canvas = canvasRef.current;
        const imageData = canvas.toDataURL("image/jpeg").split(",")[1];

        console.log("送信する画像データ長:", imageData.length);
        console.log("送信するcorners:", corners);

        const result = await cropImageWithVisionAPI(imageData, corners);
        console.log("API完全なレスポンス:", result);

        if (!result?.responses?.[0]?.cropHintsAnnotation?.cropHints?.[0]) {
            throw new Error("有効なクロップヒントが返されませんでした");
        }

        return result.responses[0].cropHintsAnnotation.cropHints[0];
    } catch (error) {
        console.error("詳細なエラー情報:", error);
        throw new Error("クロップ処理に失敗しました");
    }
};
