import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { WordData } from "@/types/word";

export const addWord = async (data: WordData): Promise<string> => {
    const auth = getAuth();
    if (!auth.currentUser) {
        throw new Error("認証が必要です");
    }

    try {
        const wordsRef = collection(db, "users", auth.currentUser.uid, "words");
        const wordData = {
            ...data,
            userId: auth.currentUser.uid,
            createdAt: Timestamp.fromDate(data.createdAt as Date),
            updatedAt: Timestamp.fromDate(data.updatedAt as Date),
        };

        const docRef = await addDoc(wordsRef, wordData);
        return docRef.id;
    } catch (error) {
        console.error("Word addition failed:", error);
        throw error;
    }
};
