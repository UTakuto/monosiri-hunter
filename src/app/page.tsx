"use client"; // クライアントコンポーネントとして宣言

import Notice from "@/components/Notice/Notice";
import Camera from "../components/button/camera/camera";
import Picture from "../components/button/picture/Picture";
import style from "./index.module.css";
import Image from "next/image";
import { useAuthRedirect } from "@/utils/authUtils";

export default function Page() {
    useAuthRedirect();

    return (
        <div className={style.container}>
            <Notice />
            <div className={style.wrapper}>
                <div className={style.header}>
                    <Image
                        className={style.logo}
                        src={"/logo.png"}
                        alt="ものしりハンター"
                        width={100}
                        height={20}
                    />
                    <div className={style.characterWrap}>
                        <p className={style.speechBubble}>たんけんにでよう！</p>
                        <Image
                            className={style.character}
                            src="/character.png"
                            alt="キャラクター"
                            width={80}
                            height={80}
                        />
                    </div>
                </div>
                <div className={style.btnWrap}>
                    <Camera />
                    <Picture />
                </div>
            </div>
        </div>
    );
}
