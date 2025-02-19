import { Timestamp } from "firebase/firestore";

export interface WordData {
    id?: string;
    word: string;
    correctWord: string;
    isCorrect: boolean;
    description: string;
    imageUrl: string;
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
    userId?: string;
}
