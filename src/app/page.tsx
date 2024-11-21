"use client";
import Link from "next/link";
import Camera from "./camera/page";

export default function page() {
    return (
        <div>
            <Camera />
            {/* <Link href="./camera">camera</Link> */}
            <Link href="./pictureBook">picture book</Link>
        </div>
    );
}
