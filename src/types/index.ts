export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

export interface Child {
    id: string;
    name: string;
    createdAt: string;
    collection: string[];
}

export interface WordData {
    id: string;
    word: string;
    correctWord: string;
    description: string;
    imageUrl: string | null;
    shuffled?: string[];
}

export interface PhotoQuizProps {
    words: WordData[];
    onComplete: () => void;
    onClose: () => void;
}
