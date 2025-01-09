"use client";
import { useRouter } from "next/navigation";
import { getCharacterRow } from "@/utils/getCharacterRow";
import { addWord } from "@/lib/firebase";
import style from "../game.module.css";

export default function GameResult() {
    const router = useRouter();
    const word = localStorage.getItem("wordToRegister");
    const description = localStorage.getItem("description");
    const savedData = localStorage.getItem("analysisTarget");
    const imageUrl = savedData ? JSON.parse(savedData).imageUrl : null;

    const handleRegister = async () => {
        if (!word || !description || !imageUrl) return;

        try {
            await addWord({
                word,
                description,
                imageUrl,
                createdAt: new Date(),
            });
            alert("うばわれたものをとりかえせたよ！");
            router.push("/pictureBook");
        } catch (error) {
            console.error("登録エラー:", error);
            alert("登録に失敗しました。");
        }
    };

    const handleBack = () => {
        router.push("/game"); // ホームへ戻る
    };

    return (
        <div className={style.container}>
            <div className={style.resultContainer}>
                {/* <div className={style.resultHeader}> */}
                {/* <Arrow backPath="/game" /> */}
                {word && (
                    <div className={style.contentWrapper}>
                        <div className={style.wordDisplay}>
                            {word.split("").map((char, index) => (
                                <p
                                    key={index}
                                    className={`
                                        ${style.wordChar}
                                        ${style.resultChar}
                                        ${style[getCharacterRow(char)]}
                                    `}
                                >
                                    {char}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
                {/* </div> */}
                <div className={style.descriptionContainer}>
                    <p className={style.descriptionText}>{description || "説明文がありません"}</p>
                </div>
                <div className={style.resultButtonContainer}>
                    <button className={style.gameBackButton} onClick={handleBack}>
                        もういっかい
                    </button>
                    <button className={style.gameSubmitButton} onClick={handleRegister}>
                        げっとする
                    </button>
                </div>
            </div>
        </div>
    );
}
