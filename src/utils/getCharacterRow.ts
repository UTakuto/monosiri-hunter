export const getCharacterRow = (char: string): string => {
    const hiragana = {
        a_group: /[あいうえお]/,
        ka_group: /[かきくけこ]/,
        sa_group: /[さしすせそ]/,
        ta_group: /[たちつてと]/,
        na_group: /[なにぬねの]/,
        ha_group: /[はひふへほ]/,
        ma_group: /[まみむめも]/,
        ya_group: /[やゆよ]/,
        ra_group: /[らりるれろ]/,
        wa_group: /[わをん]/,
        ga_group: /[がぎぐげご]/,
        za_group: /[ざじずぜぞ]/,
        da_group: /[だぢづでど]/,
        ba_group: /[ばびぶべぼ]/,
        pa_group: /[ぱぴぷぺぽ]/,
        a_youon_group: /[ぁぃぅぇぉ]/,
        ya_youon_group: /[ゃゅょ]/,
        wa_youon_group: /[ゎ]/,
        tu_sokuon_group: /[っ]/,
        long_vowel_symbol: /[ー]/,
    };

    for (const [row, pattern] of Object.entries(hiragana)) {
        if (pattern.test(char)) return row;
    }
    return "other";
};
