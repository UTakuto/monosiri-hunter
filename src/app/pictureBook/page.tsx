"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
// import { storage } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
// import { ref, getDownloadURL } from "firebase/storage";
import style from "./pictureBook.module.css";

interface WordData {
    id: string;
    name: string;
    description: string;
    imageUrl: string | null;
}

export default function PictureBook() {
    const [words, setWords] = useState<WordData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWords = async () => {
            try {
                const wordsRef = collection(db, "words");
                const q = query(wordsRef, orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);

                const wordsData = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name,
                        description: data.description,
                        imageUrl: data.imageUrl || null, // Firestoreに保存された画像URL
                    };
                });

                setWords(wordsData);
            } catch (error) {
                console.error("Error fetching words:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWords();
    }, []);

    return (
        <div className={style.container}>
            <div className={style.header}>
                <h1 className={style.title}>ことばずかん</h1>
            </div>
            {loading ? (
                <p className={style.loading}>よみこみちゅう...</p>
            ) : (
                <div className={style.wordsGrid}>
                    {words.map((word) => (
                        <div key={word.id} className={style.wordCard}>
                            {word.imageUrl && (
                                <div className={style.imageContainer}>
                                    <Image
                                        src={word.imageUrl}
                                        alt={word.name}
                                        width={300}
                                        height={300}
                                        className={style.wordImage}
                                    />
                                </div>
                            )}
                            <h2 className={style.wordName}>{word.name}</h2>
                            <p className={style.wordDescription}>{word.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
