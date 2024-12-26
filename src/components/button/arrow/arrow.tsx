"use client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import "./arrow.css";

export default function Arrow() {
    const router = useRouter();

    const pathname = usePathname();

    const handleBack = () => {
        const currentPath = pathname;
        if (currentPath) {
            const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/")) || "/";
            router.push(parentPath);
        } else {
            console.log("現在のパスが取得できません");
        }
    };

    return (
        <div className="backBtnWrap" onClick={handleBack}>
            <div className="backBtn">
                <div className="image">
                    <Image src="/arrow.png" alt="戻る" width={50} height={50} />
                </div>
            </div>
        </div>
    );
}
