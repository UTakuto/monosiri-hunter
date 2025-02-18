import style from "./warningModal.module.css";

interface WarningModalProps {
    onClose: () => void;
}

export const WarningModal = ({ onClose }: WarningModalProps) => {
    return (
        <>
            <div className={style.modal}>
                <h2>まだクイズができないよ</h2>
                <p>さきに物体の名前をおぼえよう！</p>
                <button onClick={onClose} className={style.button}>
                    とじる
                </button>
            </div>
        </>
    );
};
