import { MutableRefObject } from "react";

interface Corner {
    x: number;
    y: number;
}

interface Corners {
    topLeft: Corner;
    topRight: Corner;
    bottomRight: Corner;
    bottomLeft: Corner;
}

export const getAdditionalLinePosition = (
    additionalLineRef: MutableRefObject<HTMLDivElement | null>
): Corners | undefined => {
    if (additionalLineRef.current) {
        const rect = additionalLineRef.current.getBoundingClientRect();
        const corners = {
            topLeft: {
                x: rect.x,
                y: rect.y,
            },
            topRight: {
                x: rect.x + rect.width,
                y: rect.y,
            },
            bottomRight: {
                x: rect.x + rect.width,
                y: rect.y + rect.height,
            },
            bottomLeft: {
                x: rect.x,
                y: rect.y + rect.height,
            },
        };
        console.log("四角形の4つの角の座標:", corners);
        return corners;
    }
};
