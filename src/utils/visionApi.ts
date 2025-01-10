interface VisionApiResponse {
    responses: [
        {
            cropHintsAnnotation: {
                cropHints: Array<{
                    boundingPoly: {
                        vertices: Array<{
                            x: number;
                            y: number;
                        }>;
                    };
                    confidence: number;
                    importanceFraction: number;
                }>;
            };
        }
    ];
}

export async function cropImageWithVisionAPI(
    imageData: string,
    corners: {
        topLeft: { x: number; y: number };
        topRight: { x: number; y: number };
        bottomRight: { x: number; y: number };
        bottomLeft: { x: number; y: number };
    }
): Promise<VisionApiResponse> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY;
    const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const requestBody = {
        requests: [
            {
                image: {
                    content: imageData,
                },
                features: [
                    {
                        type: "CROP_HINTS",
                    },
                ],
                imageContext: {
                    cropHintsParams: {
                        aspectRatios: [1.0], // 正方形のクロップを指定
                    },
                },
            },
        ],
    };
    console.log(corners);
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response data:", data);
        return data;
    } catch (error) {
        console.error("Vision API error:", error);
        throw error;
    }
}
