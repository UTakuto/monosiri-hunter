"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Register from "@/components/register/register";

export default function GameResult() {
    const router = useRouter();
    const word = localStorage.getItem("wordToRegister");

    useEffect(() => {
        if (!word) {
            router.push("/photography");
        }
    }, [router, word]);

    return (
        <div>{word && <Register word={word} onClose={() => router.push("/photography")} />}</div>
    );
}
