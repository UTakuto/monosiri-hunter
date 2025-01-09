import "./modal.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SuccessModal = ({ isOpen, onClose }: ModalProps) => {
    return (
        <>
            {isOpen && (
                <>
                    <div className="overlay" />
                    <div className="modal">
                        <h2>やったね！</h2>
                        <p>うばわれたものをとりかえせたよ！</p>
                        <button onClick={onClose} className="button">
                            とじる
                        </button>
                    </div>
                </>
            )}
        </>
    );
};
