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
                        優しい先生として5歳の子どもに説明していると想定しまた、5歳の子どもにわかる言葉遣いを想定し全てひらがなで実行し、以下の指示に従って説明文を生成してください。
                        禁止事項:
                        1.暴力的な表現を使用しない,
                        2.差別的な表現を使用しない,
                        3.すべての漢字を使用禁止,
                        4.すべてのカタカナを使用禁止,
                        5.名前と説明文に長文を避ける,
                        6.専門用語を使用しない,
                        7.例文をそのままは使用しない,
                        8.難しい言葉の禁止,
                        9.名前と説明文にカタカナ、漢字、記号、英語全て使用、利用、活用禁止,
                        10.物体の名前に矢印関連の記号を使用しない、名前のみ,
                        11. 「→ , ← , ↓ , ↑」の禁止,
                        12. 5歳の子どもにわからない言葉、文章、表現の禁止,
                        13. 意味のわからない日本語の禁止,

                        例文:
                        1. エナジードリンク→えなじーどりんく,
                        2."ながさをはかるためのどうぐだよ。"のみを追加,
                        3.ものの名前: えんぴつ→えんぴつ,
                        4.せつめい: じをかくためにつかうよ→じをかくためにつかうよ,
                        あなたの仕事:
                        1. 画像内の主要な物体の名前を一つ特定,
                        2. その物体の名前のみを全てひらがなで出力,
                        3.その物体の名前に関する簡単な説明文を全てひらがなのみで出力,
                        4.説明文にはものの名前は出さない,
                        5. 幼稚園児がわかる説明のみを追加,
                        6.説明文は使い方を説明するもの,
                        7. 説明は30文字以内で出力する,
                        8. 「Air pods → エアーポッヅ」みたいな感じで応用して,
                        9. 名前及び説明文には全てひらがなのみを使用する,
                        10. カタカナからひらがなに変える時（次の文は例文として出しています）「スマホ → すまほ」と出してくれていますが、「スマホ→」の部分は使わずに「すまほ」のみを使ってください,
                        11. 画像ないの物体でもし商品名にヒットしても商品名は使用せず、名称を使用してください,
                        12. 矢印は使わずに名称を答える,

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

        const content = moderation.choices[0].message.content;
        if (!content) {
            throw new Error("Content is null or undefined");
        }
        const [name, ...descriptionParts] = content.split("\n").filter(Boolean);
        const description = descriptionParts.join(" ");

        console.log("API Response:", { name, description });

        return NextResponse.json({
            result: {
                choices: [
                    {
                        message: {
                            content: content,
                            name: name.trim(),
                            description: description.trim(),
                        },
                    },
                ],
            },
        });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "写真を読み取れませんでした" }, { status: 500 });
    }
};
