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
            setIsLandscape(true);
            return;
        }

        const handleOrientationChange = () => {
            if (window.screen.orientation) {
                setIsLandscape(window.screen.orientation.type.includes("landscape"));
            } else if (window.orientation) {
                setIsLandscape(window.orientation === 90 || window.orientation === -90);
            }
        };

        handleOrientationChange();
        window.addEventListener("orientationchange", handleOrientationChange);
        window.addEventListener("resize", handleOrientationChange);

        return () => {
            window.removeEventListener("orientationchange", handleOrientationChange);
            window.removeEventListener("resize", handleOrientationChange);
        };
    }, []);

    return isLandscape;
};
