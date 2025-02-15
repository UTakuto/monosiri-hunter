import { useState, useCallback } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type { Child } from "@/types";

export const useChild = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const auth = getAuth();

    const getChildren = useCallback(async (): Promise<Child[]> => {
        if (!auth.currentUser) {
            throw new Error("認証が必要です");
        }

        try {
            setIsLoading(true);
            setError(null);
            const childrenRef = collection(db, "users", auth.currentUser.uid, "children");
            const snapshot = await getDocs(childrenRef);
            return snapshot.docs.map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...doc.data(),
                    } as Child)
            );
        } catch (err: any) {
            const errorMessage = err.message || "子どもアカウントの取得に失敗しました";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [auth.currentUser]);

    const createChild = useCallback(
        async (name: string): Promise<void> => {
            if (!auth.currentUser) {
                throw new Error("認証が必要です");
            }

            try {
                setIsLoading(true);
                setError(null);
                await addDoc(collection(db, "users", auth.currentUser.uid, "children"), {
                    name,
                    createdAt: new Date().toISOString(),
                    collection: [],
                });
            } catch (err: any) {
                const errorMessage = err.message || "子どもアカウントの作成に失敗しました";
                setError(errorMessage);
                throw new Error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        },
        [auth.currentUser]
    );

    const uploadPhoto = useCallback(
        async (file: File): Promise<string> => {
            if (!auth.currentUser) {
                throw new Error("認証が必要です");
            }

            try {
                setIsLoading(true);
                setError(null);

                // ストレージの参照を作成
                const storageRef = ref(
                    storage,
                    `users/${auth.currentUser.uid}/photos/${Date.now()}_${file.name}`
                );

                // ファイルをアップロード
                await uploadBytes(storageRef, file);

                // アップロードしたファイルのURLを取得
                const downloadURL = await getDownloadURL(storageRef);

                return downloadURL;
            } catch (err: any) {
                const errorMessage = err.message || "写真のアップロードに失敗しました";
                setError(errorMessage);
                throw new Error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        },
        [auth.currentUser]
    );

    return {
        getChildren,
        createChild,
        uploadPhoto, // 新しいメソッドを追加
        isLoading,
        error,
    };
};
