"use client";
import { useState } from "react";
import Image from "next/image";
import { PhotoQuizProps } from "@/types";
import style from "./PhotoQuiz.module.css";

export const PhotoQuiz = ({ words, onComplete, onClose }: PhotoQuizProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const currentWord = words[currentIndex];

    // 現在の問題の選択肢を生成
    const generateChoices = () => {
        // 現在の単語を含む配列を作成
        const allWords = words.map((w) => w.word);
        // 現在の単語を除外
        const otherWords = allWords.filter((w) => w !== currentWord.word);
        // ランダムに2つの不正解を選ぶ
        const wrongAnswers = otherWords.sort(() => Math.random() - 0.5).slice(0, 2);
        // 正解を加えてシャッフル
        return [...wrongAnswers, currentWord.word].sort(() => Math.random() - 0.5);
    };

    const checkAnswer = (selectedAnswer: string) => {
        const correct = selectedAnswer === currentWord.word;
        setIsCorrect(correct);
        setShowResult(true);

        setTimeout(() => {
            if (currentIndex < words.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setShowResult(false);
            } else {
                onComplete();
            }
        }, 3000);
    };

    const choices = generateChoices();

    return (
        <div className={style.quizContainer}>
            <div className={style.quizHeader}>
                <div className={style.headerContent}>
                    <div onClick={onClose} className={style.closeButton}>
                        <button className={style.closeButtonBorder}>
                            <Image src="/arrow.png" alt="戻る" width={25} height={25} />
                        </button>
                    </div>
                    <div className={style.progressText}>
                        {currentIndex + 1} / {words.length}
                    </div>
                </div>
            </div>
            <div className={style.quizBody}>
                <div className={style.imageContainer}>
                    <Image
                        src={currentWord.imageUrl || ""}
                        alt="なにこれ？"
                        width={200}
                        height={200}
                        className={style.quizImage}
                    />
                </div>
                {!showResult ? (
                    <div className={style.quizContent}>
                        <p className={style.question}>これはなんだろう？</p>
                        <div className={style.choicesContainer}>
                            {choices.map((choice, index) => (
                                <button
                                    key={index}
                                    onClick={() => checkAnswer(choice)}
                                    className={style.choiceButton}
                                >
                                    {choice}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={isCorrect ? style.correctAnswer : style.wrongAnswer}>
                        <p className={style.answerInput}>
                            {isCorrect ? "せいかい！" : "ざんねん、、、"}
                        </p>
                        <p className={style.answerWord}>これは「{currentWord.word}」だよ！</p>
                    </div>
                )}
            </div>
        </div>
    );
};
