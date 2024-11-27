import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const POST = async (req: NextRequest) => {
    const { image } = await req.json();

    if (!image) {
        return NextResponse.json({ error: "画像がありません" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {
        const moderation = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "この画像の中で一番大きく写っているのが何の物体か教えてください。また、写っている物体の名前のみを出して",
                        },
                        {
                            type: "image_url",
                            image_url: { url: image },
                        },
                    ],
                },
            ],
        });

        return NextResponse.json({ result: moderation });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "写真を読み取れませんでした" }, { status: 500 });
    }
};
