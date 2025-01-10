"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Arrow from "@/components/button/arrow/arrow";
// import style from "../index.module.css";
import cameraStyle from "@/app/photography/camera.module.css";
import style from "../findDescription.module.css";

export default function Page() {
    const router = useRouter();

    const startPhotoGraphy = () => {
        router.push("/game");
    };

    return (
        <div>
            <Arrow backPath="/" />
            <div onClick={startPhotoGraphy} className={style.findWrapper}>
                <div className={style.descriptionWrap}>
                    <h1 className={style.descriptionTit}>
                        いたずらされちゃった、、
                        <br />
                        とりかえそう！
                    </h1>
                </div>
                <div className={cameraStyle.characterWrap}>
                    <Image
                        className={style.character2}
                        src="/character2.png"
                        alt="キャラクター"
                        width={160}
                        height={200}
                    />
                </div>
                <Image
                    src="/handGesture.png"
                    alt="タップしてね"
                    className={cameraStyle.handGestureImg}
                    width={280}
                    height={210}
                />
            </div>
        </div>
    );
}
