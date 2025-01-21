export const shuffle = <T>(array: T[]): T[] => {
    if (!array || array.length === 0) return [];

    const shuffled = Array.from(array);
    let currentIndex = shuffled.length;
    let randomIndex;

    while (currentIndex !== 0) {
        // ランダムな位置を選択
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // 2回シャッフルして、パターンを崩す
        [shuffled[currentIndex], shuffled[randomIndex]] = [
            shuffled[randomIndex],
            shuffled[currentIndex],
        ];

        // さらにランダムな位置で入れ替え
        const secondRandomIndex = Math.floor(Math.random() * currentIndex);
        [shuffled[currentIndex], shuffled[secondRandomIndex]] = [
            shuffled[secondRandomIndex],
            shuffled[currentIndex],
        ];
    }

    // 2文字以下の場合は逆順チェックをスキップ
    if (array.length <= 2) {
        if (shuffled.join("") === array.join("")) {
            return shuffle(array);
        }
    } else {
        // 3文字以上の場合は元の配列と完全一致、または逆順完全一致の場合は再シャッフル
        const reversedArray = [...array].reverse();
        if (shuffled.join("") === array.join("") || shuffled.join("") === reversedArray.join("")) {
            return shuffle(array);
        }
    }

    return shuffled;
};
