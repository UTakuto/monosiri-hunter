"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./arrow.css";

export default function Arrow() {
    const router = useRouter();

    return (
        <div className="backBtnWrap" onClick={() => router.back()}>
            <div className="backBtn">
                <div className="image">
                    <Image src="/arrow.png" alt="戻る" width={50} height={50} />
                </div>
            </div>
        </div>
    );
}
