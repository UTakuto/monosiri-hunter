
import { useRouter } from "next/navigation";
import "./picture.css";
import Image from "next/image";

export default function Picture() {
    const router = useRouter();

    const startPicture = () => {
        router.push("./pictureBook");
    }
    return (
        <div>
            <button className="pictureBtn" onClick={startPicture}>
                <span className="border">ずかん</span>
                <Image className="bookImage" src="/bookImage.png" alt="" width={64} height={60} ></Image>
            </button>
        </div>
    )
}
