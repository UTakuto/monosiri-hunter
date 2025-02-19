import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WordData } from "@/types/word";

export const updateWord = async (docId: string, wordData: Partial<WordData>) => {
    const auth = getAuth();
    if (!auth.currentUser) {
        throw new Error("認証が必要です");
    }

    const wordRef = doc(db, "users", auth.currentUser.uid, "words", docId);
    await updateDoc(wordRef, wordData);
    return docId;
};
