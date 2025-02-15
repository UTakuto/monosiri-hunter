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
