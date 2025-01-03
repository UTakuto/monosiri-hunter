"use client";
import Camera from "../components/button/camera/camera";
import Picture from "../components/button/picture/Picture";
import style from "./index.module.css";
import Image from "next/image";

export default function Page() {
    return (
        <div className={style.container}>
            <div className={style.wrapper}>
                <div className={style.logo}>
                    <Image
                        className={style.character}
                        src="/character.png"
                        alt="キャラクター"
                        width={150}
                        height={150}
                    />
                </div>
                <div className={style.btnWrap}>
                    <Camera />
                    <Picture />
                </div>
            </div>
        </div>
    );
}
