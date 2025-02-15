"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCharacterRow } from "@/utils/getCharacterRow";
import { shuffle } from "@/utils/shuffle";
import style from "./game.module.css";
import Arrow from "@/components/button/arrow/arrow";
import { RequireAuth } from "@/components/auth/RequireAuth";

interface GameData {
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
        if (gameData && selectedChars.join("") === gameData.original) {
            localStorage.setItem("wordToRegister", gameData.original);
            router.push("/game/result");
        }
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
                                disabled={selectedChars.length !== gameData?.original.length}
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
