"use client";
import { useEffect, useState } from "react";

export const useOrientation = () => {
    const [isLandscape, setIsLandscape] = useState(false);

    useEffect(() => {
        // PCデバイスの検出
        const isMobileDevice =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );

        if (!isMobileDevice) {
            setIsLandscape(false);
            return;
        }

        const handleOrientationChange = () => {
            setIsLandscape(window.orientation === 90 || window.orientation === -90);
        };

        handleOrientationChange();
        window.addEventListener("orientationchange", handleOrientationChange);

        return () => {
            window.removeEventListener("orientationchange", handleOrientationChange);
        };
    }, []);

    return isLandscape;
};
