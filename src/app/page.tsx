"use client";
import Link from "next/link";

export default function page() {
    return (
        <div>
            <Link href="./camera">camera</Link>
            <Link href="./pictureBook">picture book</Link>
        </div>
    );
}
