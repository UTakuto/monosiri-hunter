"use client";
import { useOrientation } from "@/utils/useOrientation";
import Image from "next/image";
import "./notice.css";

export default function Notice() {
    const isLandscape = useOrientation();

    if (isLandscape) return null;

    return (
        <div className="notice">
            <div className="smartPhoneWrap">
                <Image
                    className="smartImage"
                    src={"/smartphone.png"}
                    alt=""
                    width={100}
                    height={100}
                />
                <div className="noticeTextWrap">
                    <p className="noticeText">よこにたおしてもってね</p>
                    <Image src={"/ornament.png"} alt="" width={400} height={100} />
                </div>
            </div>
            <Image className="handImage" src={"/handIphone.png"} alt="" width={100} height={100} />
        </div>
    );
}
