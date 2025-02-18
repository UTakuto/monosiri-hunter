import { useState, useCallback } from "react";
import { WordData } from "@/types";

export const usePhotoQuiz = (words: WordData[]) => {
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizWords, setQuizWords] = useState<WordData[]>([]);
    const [showWarning, setShowWarning] = useState(false);

    const startQuiz = useCallback(() => {
        if (words.length === 0) return;

        // 正解済みの単語を取得
        const correctWords = words.filter((word) => {
            const savedData = localStorage.getItem(`word_${word.id}`);
            if (!savedData) return false;
            const parsedData = JSON.parse(savedData);
            return parsedData?.isCorrect === true;
        });

        if (correctWords.length === 0) {
            setShowWarning(true);
            return;
        }

        // 正解単語からランダムに選択
        const selectedWords = correctWords
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.min(3, correctWords.length));

        console.log("Starting quiz with correct words:", selectedWords);
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
