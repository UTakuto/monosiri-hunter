"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Arrow from "@/components/button/arrow/arrow";
import style from "../index.module.css";
import cameraStyle from "../photography/camera.module.css";

export default function Page() {
    const router = useRouter();

    const startPhotoGraphy = () => {
        router.push("./photography");
    };

    return (
        <div onClick={startPhotoGraphy} className={style.findWrapper}>
            <Arrow />
            <div className={style.descriptionWrap}>
                <h1>しらないものをみつけにいこう！</h1>
            </div>
            <Image
                src="/handGesture.png"
                alt="タップしてね"
                className={cameraStyle.handGestureImg}
                width={280}
                height={210}
            />
        </div>
    );
}
