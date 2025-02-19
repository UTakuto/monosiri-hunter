export function speakText(text: string, lang = "ja-JP") {
    // ブラウザの対応チェック
    if (!window.speechSynthesis) {
        alert("お使いのブラウザは音声読み上げに対応していません");
        return;
    }

    // すでに再生中の音声をキャンセル（Safari のバグ対策）
    window.speechSynthesis.cancel();

    // Web Speech API の音声合成を設定
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // iOS Safari では再生開始まで少し遅延を入れる
    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 100);
}
