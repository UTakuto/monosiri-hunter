"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import style from "./game.module.css";
import Register from "@/components/register/register";
import { getCharacterRow } from "@/utils/getCharacterRow";

interface GameData {
    original: string;
    shuffled: string[];
}

export default function Game() {
    const router = useRouter();
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [selectedChars, setSelectedChars] = useState<string[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

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
            setIsCorrect(true);
        }
    };

    const handleUndo = () => {
        if (selectedChars.length === 0) return;

        const newSelectedChars = [...selectedChars];
        newSelectedChars.pop(); // 最後の文字を削除
        setSelectedChars(newSelectedChars);
    };

    const resetGame = () => {
        setSelectedChars([]);
        setIsCorrect(false);
    };

    const goToRegister = () => {
        setShowRegister(true);
    };

    return (
        <div className={style.container}>
            <div className={style.header}>
                <button
                    onClick={() => router.push("/photography")}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    もどる
                </button>
                <h1 className={style.headerText}>ならびかえよう！</h1>
            </div>
            <div className={style.resultContainer}>
                {isCorrect ? (
                    <div className={style.successContainer}>
                        {/* 正解後の画面 */}
                        <div className={style.successChars}>
                            {gameData?.original.split("").map((char, index) => (
                                <span key={index} className={style.finalChar}>
                                    {char}
                                </span>
                            ))}
                        </div>
                        <div className={style.successActions}>
                            <button
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                onClick={resetGame}
                            >
                                もういっかい
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 ml-4"
                                onClick={goToRegister}
                            >
                                とうろく
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* 選択中の文字 */}
                        <div className={style.selectedContainer}>
                            {selectedChars.map((char, index) => (
                                <span key={index} className={style.selectedChar}>
                                    {char}
                                </span>
                            ))}
                            {Array.from({
                                length: (gameData?.original?.length || 0) - selectedChars.length,
                            }).map((_, index) => (
                                <span
                                    key={`empty-${index}`}
                                    className={`
                                        ${style.emptyChar}
                                        ${style.gameChar} 
                                        ${style.hiraganaChar}
                                        `}
                                ></span>
                            ))}
                        </div>

                        {/* 「一文字戻る」ボタン */}
                        <div className={style.undoButton}>
                            <button
                                onClick={handleUndo}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mt-4"
                                disabled={selectedChars.length === 0}
                            >
                                ひとつもどる
                            </button>
                        </div>

                        {/* 選択可能な文字 */}
                        <div className={style.gameText}>
                            {gameData?.shuffled.map((char, index) => (
                                <button
                                    key={index}
                                    className={`
                                        ${style.gameChar} 
                                        ${style.hiraganaChar} 
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
                    </div>
                )}
            </div>
            {showRegister && gameData?.original && (
                <Register word={gameData.original} onClose={() => setShowRegister(false)} />
            )}
        </div>
    );
}
