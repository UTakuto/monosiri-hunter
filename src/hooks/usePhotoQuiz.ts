import { useState, useCallback } from "react";
import { WordData } from "@/types";

export const usePhotoQuiz = (words: WordData[]) => {
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizWords, setQuizWords] = useState<WordData[]>([]);
    const [showWarning, setShowWarning] = useState(false);

    const startQuiz = useCallback(() => {
        if (words.length === 0) return;

        // 物体の名前並べ替えで正解した単語を取得
        const correctWords = words.filter((word) => {
            const gameData = localStorage.getItem(`gameData_${word.id}`);
            if (!gameData) return false;
            const parsedData = JSON.parse(gameData);
            return parsedData?.isCorrect === true;
        });

        // 正解がない場合は警告を表示
        if (correctWords.length === 0) {
            setShowWarning(true);
            return;
        }

        // 正解した単語からランダムに最大3つ選択
        const selectedWords = correctWords
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.min(3, correctWords.length));

        console.log("Starting quiz with words:", selectedWords);
        setQuizWords(selectedWords);
        setShowQuiz(true);
    }, [words]);

    const endQuiz = useCallback(() => {
        setShowQuiz(false);
        setQuizWords([]);
    }, []);

    const closeWarning = useCallback(() => {
        setShowWarning(false);
    }, []);

    return {
        showQuiz,
        quizWords,
        startQuiz,
        endQuiz,
        showWarning,
        closeWarning,
    };
};
