"use client";
import Image from "next/image";
import "./arrow.css";

export default function Camera() {

    return (
        <div className="backBtnWrap">
            <div className="backBtn">
                <div className="image">
                    <Image src="/arrow.png" alt="" width={50} height={45} />
                </div>
            </div>
        </div>
    );
}
