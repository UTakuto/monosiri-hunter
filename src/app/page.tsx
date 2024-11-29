"use client";
import Camera from "./camera/Page";
import Picture from "../components/button/Picture";
import style from "./index.module.css";


export default function Page() {
    return (
        <div className={style.wrapper}>
            <div className={style.logo}></div>
            <div className={style.btnWrap}>
                <Camera />
                <Picture />
            </div>
        </div>
    );
}
