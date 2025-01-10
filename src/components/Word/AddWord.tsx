import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface WordData {
    word: string;
    description: string;
    imageUrl: string;
    createdAt: Date;
}

export const addWord = async (data: WordData) => {
    try {
        const docRef = await addDoc(collection(db, "words"), data);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};
