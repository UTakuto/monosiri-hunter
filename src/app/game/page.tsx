"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCharacterRow } from "@/utils/getCharacterRow";
import { shuffle } from "@/utils/shuffle";
import style from "./game.module.css";
import Arrow from "@/components/button/arrow/arrow";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { speakText } from "@/utils/speak";

interface GameData {
    id: string;
    original: string;
    shuffled: string[];
}

interface ShuffledChar {
    char: string;
    id: number;
    isSelected: boolean;
}

export default function Game() {
    const router = useRouter();
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [selectedChars, setSelectedChars] = useState<string[]>([]);
    const [shuffledCharsState, setShuffledCharsState] = useState<ShuffledChar[]>([]);
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const MAX_ATTEMPTS = 2; // 最大試行回数

    useEffect(() => {
        if (!gameData?.shuffled) return;
        const chars = shuffle(gameData.shuffled).map((char, index) => ({
            char,
            id: index,
            isSelected: false,
        }));
        setShuffledCharsState(chars);
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

    const handleCharClick = (char: string, id: number) => {
        if (selectedChars.length >= (gameData?.original.length || 0)) return;

        // 文字を選択したら読み上げる
        speakText(char);

        setShuffledCharsState((prev) =>
            prev.map((c) => (c.id === id ? { ...c, isSelected: true } : c))
        );

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

        const lastSelectedChar = selectedChars[selectedChars.length - 1];

        // 最後に選択された文字のisSelectedをfalseに戻す
        setShuffledCharsState((prev) => {
            const lastSelectedId = prev.findIndex(
                (c) => c.char === lastSelectedChar && c.isSelected
            );
            if (lastSelectedId === -1) return prev;

            return prev.map((c, i) => (i === lastSelectedId ? { ...c, isSelected: false } : c));
        });

        const newSelectedChars = [...selectedChars];
        newSelectedChars.pop();
        setSelectedChars(newSelectedChars);
    };

    const handleSubmit = () => {
        if (!gameData) return;

        const selectedWord = selectedChars.join("");
        const apiName = localStorage.getItem("apiWord");
        const isCorrect = selectedWord === gameData.original;

        // 正解の場合
        if (isCorrect) {
            setShowHint(false);
            localStorage.setItem("wordToRegister", gameData.original);
            localStorage.setItem(
                `gameData_${gameData.id}`,
                JSON.stringify({
                    isCorrect: true,
                    completedAt: new Date().toISOString(),
                })
            );
            router.push("/game/result");
            return;
        }

        // 最大試行回数に達しているか確認
        const isMaxAttempts = attempts >= MAX_ATTEMPTS - 1;

        // 不正解の場合
        if (isMaxAttempts) {
            // 最大試行回数に達している場合は結果画面へ
            setShowHint(false);
            localStorage.setItem("wordToRegister", selectedWord);
            localStorage.setItem("correctWord", gameData.original);
            router.push("/game/result");
            return;
        }

        // 試行回数をインクリメント
        setAttempts((prev) => prev + 1);

        // 不正解でかつAPIの名前と一致しない場合のみヒントを表示
        if (selectedWord !== apiName) {
            setShowHint(true);
        }
    };

    // ヒントを生成する関数
    const generateHint = (word: string): string => {
        return word
            .split("")
            .map((char, index) => {
                return index === 0 || index === word.length - 1 ? char : "○";
            })
            .join("");
    };

    return (
        <RequireAuth>
            <div className={style.container}>
                <div className={style.header}>
                    <Arrow backPath="/photography/photo/result" />
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
                    {showHint && attempts < MAX_ATTEMPTS && (
                        <div className={style.hintContainer}>
                            <p className={style.hintText}>
                                ヒント: {generateHint(localStorage.getItem("apiWord") || "")}
                            </p>
                            <p className={style.attemptsText}>
                                あと{MAX_ATTEMPTS - attempts}回チャレンジできます
                            </p>
                        </div>
                    )}
                    <div className={style.gameSelectContainer}>
                        <div className={style.gameText}>
                            {shuffledCharsState.map((charData) => (
                                <button
                                    key={charData.id}
                                    className={`
                                    ${style.hiraganaChar} 
                                    ${style.gamePlayChar}
                                    ${charData.isSelected ? style.usedChar : ""}
                                    ${style[getCharacterRow(charData.char)]}
                                `}
                                    onClick={() => handleCharClick(charData.char, charData.id)}
                                    disabled={charData.isSelected}
                                >
                                    {charData.char}
                                </button>
                            ))}
                        </div>
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
                                disabled={selectedChars.length !== gameData?.original.length} // 文字数が揃っていれば常に押せる
                            >
                                かんせい
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </RequireAuth>
    );
}
