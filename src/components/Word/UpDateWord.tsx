import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { WordData } from "@/types/word"; // WordData型をインポート

export const updateWord = async (wordId: string, wordData: WordData) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("ユーザー認証が必要です");
        }

        const wordRef = doc(db, `users/${user.uid}/words/${wordId}`);
        await setDoc(wordRef, wordData);
        return true;
    } catch (error) {
        console.error("Word update error:", error);
        return false;
    }
};
