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
                    content: `
                        あなたは画像分析AIです。
                        禁止事項:
                        1.暴力的な表現を使用しない,
                        2.差別的な表現を使用しない,
                        3.漢字を使用禁止,
                        4.カタカナを使用禁止,
                        5.漢字を使用禁止,
                        6.長文を避ける,
                        7.専門用語を使用しない,
                        8.例文をそのままは使用しない,
                        例文:
                        1. エナジードリンク→えなじーどりんく
                        あなたの仕事:
                        1. 画像内の主要な物体の名前を一つ特定
                        2. その物体の名前をひらがなで出力
                        3. 幼稚園児がわかる説明を追加
                        4. 説明は30文字以内に収める
                    `,
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: " 画像内で最も主要に映っている物体の名前を全てひらがなで出力してください。それに関する簡単な説明文を全てひらがなで出力してください。",
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
