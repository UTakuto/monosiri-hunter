"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getCharacterRow } from "@/utils/getCharacterRow";
import { shuffle } from "@/utils/shuffle";
import style from "./game.module.css";
import Arrow from "@/components/button/arrow/arrow";

interface GameData {
    original: string;
    shuffled: string[];
}

interface AnalysisResult {
    name: string;
}

export default function Game() {
    const router = useRouter();
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [selectedChars, setSelectedChars] = useState<string[]>([]);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const shuffledChars = useMemo(() => {
        return shuffle(gameData?.shuffled || []);
    }, [gameData?.shuffled]);

    useEffect(() => {
        let mounted = true;

        const loadGameData = () => {
            try {
                const savedData = localStorage.getItem("gameTarget");
                if (savedData && mounted) {
                    const parsedData = JSON.parse(savedData);
                    if (parsedData?.original && parsedData?.shuffled) {
                        setGameData(parsedData);
                    } else {
                        console.error("Invalid game data format");
                        router.push("/photography");
                    }
                }
            } catch (error) {
                console.error("Error loading game data:", error);
                if (mounted) {
                    router.push("/photography");
                }
            }
        };

        loadGameData();

        return () => {
            mounted = false;
        };
    }, [router]);

    const handleCharClick = (char: string) => {
        if (selectedChars.length >= (gameData?.original.length || 0)) return;

        const newSelectedChars = [...selectedChars, char];
        setSelectedChars(newSelectedChars);

        if (
            newSelectedChars.length === gameData?.original.length &&
            newSelectedChars.join("") === gameData?.original
        ) {
            handleSubmit();
        }
    };

    const handleUndo = () => {
        if (selectedChars.length === 0) return;

        const newSelectedChars = [...selectedChars];
        newSelectedChars.pop(); // 最後の文字を削除
        setSelectedChars(newSelectedChars);
    };

    const handleSubmit = () => {
        if (gameData && selectedChars.join("") === gameData.original) {
            localStorage.setItem("wordToRegister", gameData.original);
            router.push("/game/result");
        }
    };

    return (
        <div className={style.container}>
            <div className={style.header}>
                <Arrow backPath="/photography/photo/result" />
                {/* 選択中の文字 */}
                <div className={style.selectedContainer}>
                    {selectedChars.map((char, index) => (
                        <p
                            key={index}
                            className={`
                                        ${style.hiraganaChar}
                                        ${style.gamePlayChar}
                                        ${style.gameChar} 
                                        ${style[getCharacterRow(char)]}
                                    `}
                        >
                            {char}
                        </p>
                    ))}
                    {Array.from({
                        length: (gameData?.original?.length || 0) - selectedChars.length,
                    }).map((_, index) => (
                        <p
                            key={`empty-${index}`}
                            className={`
                                        ${style.emptyChar}
                                        ${style.selectedChar}
                                    `}
                        ></p>
                    ))}
                </div>
            </div>
            <div className={style.gameResultContainer}>
                <div className={style.gameSelectContainer}>
                    {/* 選択可能な文字 */}

                    <div className={style.gameText}>
                        {shuffledChars.map((char, index) => (
                            <button
                                key={`${char}-${index}`}
                                className={`
                            ${style.hiraganaChar} 
                            ${style.gamePlayChar}
                            ${selectedChars.includes(char) ? style.usedChar : ""}
                            ${style[getCharacterRow(char)]}
                        `}
                                onClick={() => handleCharClick(char)}
                                disabled={selectedChars.includes(char)}
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                    {/* 「一文字戻る」ボタン */}
                    <div className={style.buttonContainer}>
                        <button
                            onClick={handleUndo}
                            className={`
                                ${style.gameBackButton}
                                ${selectedChars.length === 0 ? style.gameBackButtonDisabled : ""}
                                `}
                            disabled={selectedChars.length === 0}
                        >
                            ひとつけす
                        </button>
                        <button
                            onClick={handleSubmit}
                            className={`
                                ${style.gameSubmitButton}
                                ${
                                    selectedChars.length !== gameData?.original.length
                                        ? style.gameSubmitButtonDisabled
                                        : ""
                                }
                                `}
                            disabled={selectedChars.length !== gameData?.original.length}
                        >
                            かんせい
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
