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
                    role: "system",
                    content:
                        "あなたは画像分析AIです。あなたの仕事は、画像内の主要な物体の名前を一つ出すのと、その物体の3~5歳児向けの説明文出すのが仕事です。",
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "この画像の中で一番メインに写っているのが何の物体か教えてください。また、写っている物体の名前のみ出してください",
                        },
                        {
                            type: "image_url",
                            image_url: { url: image },
                        },
                    ],
                },
            ],
        });

        console.log("Moderation:", moderation);
        return NextResponse.json({ result: moderation });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "写真を読み取れませんでした" }, { status: 500 });
    }
};
