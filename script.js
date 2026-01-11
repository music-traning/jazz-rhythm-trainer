// Service Workerの登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('SW Registered'))
            .catch(err => console.log('SW Error:', err));
    });
}

// --- 1. LANGUAGE & TEXT ---
let lang = 'ja';

const TEXT = {
    ja: {
        menuTitle: "カリキュラム",
        menuDesc: "レッスンを選択してください。",
        phases: ["P1: 基礎 (Basics)", "P2: グルーヴ (Groove)", "P3: スイング (Swing)", "P4: 高度技巧 (Advanced)", "P5: 神の領域 (God Tier)"],
        reset: "🗑 データ初期化",
        resetConfirm: "本当にデータをリセットしますか？",
        demo: "🔊 お手本を聞く",
        stopDemo: "■ お手本を停止",
        start: "スタート",
        cancel: "戻る",
        statsTitle: "統計データ",
        retry: "もう一度",
        next: "次へ",
        menu: "メニューへ",
        helpTitle: "操作説明",
        helpContent: `
            <p><strong>★ 基本操作</strong><br>
            <span style="color:#f72585;">● 上 (Pink)</span>: [↑]キー or [X] or 上半分タップ<br>
            <span style="color:#4cc9f0;">● 下 (Blue)</span>: [↓]キー or [Z] or 下半分タップ</p>
            <hr style="border-color:#333;">
            <p><strong>1. 円運動</strong><br>リズムを「点」ではなく「円の周期」で捉えます。</p>
            <p><strong>2. Gap (無音)</strong><br>Lv.30以降、ガイド音が消える「Gap」が登場します。</p>
            <p><strong>3. 構成</strong><br>Lv.1-20: Straight (均等)<br>Lv.21-50: Swing (3連符)</p>
            <hr style="border-color:#333;">
            <p><strong>★ アプリとして使う (推奨)</strong><br>
            ホーム画面に追加すると、<strong>全画面・オフライン</strong>で快適にプレイできます。</p>
            <div style="font-size:0.85rem; margin-top:5px;">
                <span style="color:#4cc9f0;">● iOS (Safari)</span>:<br>
                画面下の「共有」ボタン <span style="border:1px solid #555; padding:0 4px;">↑</span> ＞ [ホーム画面に追加]<br>
                <span style="color:#f72585; margin-top:4px; display:inline-block;">● Android (Chrome)</span>:<br>
                メニューボタン <span style="border:1px solid #555; padding:0 4px;">︙</span> ＞ [アプリをインストール]
            </div>
            <hr style="border-color:#333;">
            <p><strong>遅延調整 (Calibration)</strong><br>
            音がズレて感じる場合は、画面上部の [🔧 CALIB] ボタンからいつでも調整可能です。</p>
        `
    },
    en: {
        menuTitle: "CURRICULUM",
        menuDesc: "Select a lesson to start.",
        phases: ["P1: Basics", "P2: Groove", "P3: Swing Entry", "P4: Advanced", "P5: God Tier"],
        reset: "🗑 RESET DATA",
        resetConfirm: "Are you sure you want to reset all progress?",
        demo: "🔊 PLAY DEMO",
        stopDemo: "■ STOP DEMO",
        start: "START SESSION",
        cancel: "BACK",
        statsTitle: "STATISTICS",
        retry: "RETRY",
        next: "NEXT LEVEL",
        menu: "BACK TO MENU",
        helpTitle: "MANUAL",
        helpContent: `
            <p><strong>★ CONTROLS</strong><br>
            <span style="color:#f72585;">● High</span>: [UP] / [X] / Top Screen<br>
            <span style="color:#4cc9f0;">● Low</span>: [DOWN] / [Z] / Bottom Screen</p>
            <hr style="border-color:#333;">
            <p><strong>Structure</strong><br>Lv.1-20: Straight (Even)<br>Lv.21-50: Swing (Triplet)</p>
            <hr style="border-color:#333;">
            <p><strong>★ INSTALL APP (Recommended)</strong><br>
            Add to Home Screen for <strong>Full Screen & Offline</strong> play.</p>
            <div style="font-size:0.85rem; margin-top:5px;">
                <span style="color:#4cc9f0;">● iOS (Safari)</span>:<br>
                Tap [Share] button <span style="border:1px solid #555; padding:0 4px;">↑</span> > [Add to Home Screen]<br>
                <span style="color:#f72585; margin-top:4px; display:inline-block;">● Android (Chrome)</span>:<br>
                Tap Menu <span style="border:1px solid #555; padding:0 4px;">︙</span> > [Install App]
            </div>
            <hr style="border-color:#333;">
            <p><strong>Calibration</strong><br>
            Audio lag? Tap the [🔧 CALIB] button at the top to adjust latency anytime.</p>
        `
    }
};

// --- 2. LESSON DATA (50 LEVELS) ---
const LESSON_DATA = [
    // --- PHASE 1: BASICS (Lv.1-10) ---
    { id: 1, p:1, bpm: 60, r:0, s:0.18, d:8,  snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"鼓動 60",s:"4分音符",o:"リズムの原点。",a:"ゆっくり待つ練習。円を描くように。"}, en:{t:"Pulse 60",s:"Quarter",o:"The Origin.",a:"Wait for it. Draw a circle."} },
    { id: 2, p:1, bpm: 70, r:0, s:0.17, d:8,  snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"鼓動 70",s:"4分音符",o:"少し歩く速度。",a:"クリックと完全に重なる感覚を。"}, en:{t:"Pulse 70",s:"Quarter",o:"Walking pace.",a:"Overlap perfectly."} },
    { id: 3, p:1, bpm: 80, r:0, s:0.16, d:8,  snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"鼓動 80",s:"4分音符",o:"標準テンポ。",a:"リラックスして。肩の力を抜いて。"}, en:{t:"Pulse 80",s:"Quarter",o:"Standard.",a:"Relax your shoulders."} },
    { id: 4, p:1, bpm: 90, r:0, s:0.15, d:8,  snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"鼓動 90",s:"4分音符",o:"少し前進する感覚。",a:"走らないように注意。"}, en:{t:"Pulse 90",s:"Quarter",o:"Moving forward.",a:"Don't rush."} },
    { id: 5, p:1, bpm: 60, r:0, s:0.15, d:8,  snd:'click-8', pat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], ja:{t:"分割 60",s:"8分音符",o:"音を半分に割る。",a:"「タカタカ」と均等に。跳ねません。"}, en:{t:"Split 60",s:"8th Note",o:"Even split.",a:"Straight 'Ta-Ka'. No bounce."} },
    { id: 6, p:1, bpm: 70, r:0, s:0.14, d:12, snd:'click-8', pat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], ja:{t:"分割 70",s:"8分音符",o:"安定した連打。",a:"手首を柔らかく使って。"}, en:{t:"Split 70",s:"8th Note",o:"Steady flow.",a:"Soft wrists."} },
    { id: 7, p:1, bpm: 80, r:0, s:0.14, d:12, snd:'click-8', pat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], ja:{t:"分割 80",s:"8分音符",o:"8ビートの基礎。",a:"アップストローク（上げる動作）を意識。"}, en:{t:"Split 80",s:"8th Note",o:"8-beat base.",a:"Focus on up-stroke."} },
    { id: 8, p:1, bpm: 60, r:0, s:0.14, d:8,  snd:'click-4', pat:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], ja:{t:"空間 60",s:"2分音符",o:"待つ勇気。",a:"音の長さ（余韻）を感じてください。"}, en:{t:"Space 60",s:"Half Note",o:"Wait.",a:"Feel the sustain."} },
    { id: 9, p:1, bpm: 60, r:0, s:0.13, d:8,  snd:'click-up-str', pat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], ja:{t:"裏拍 60",s:"裏打ち",o:"「ン・タ」を感じる。",a:"休符を演奏するつもりで。"}, en:{t:"Upbeat 60",s:"Off-beat",o:"Feel the 'And'.",a:"Play the rest."} },
    { id: 10, p:1, bpm: 80, r:0, s:0.13, d:12, snd:'click-gap-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"P1修了検定",s:"Gap 4",o:"ガイドが消えます。",a:"心のメトロノームを信じて。"}, en:{t:"P1 Exam",s:"Gap 4",o:"Guide vanishes.",a:"Trust your inner clock."} },

    // --- PHASE 2: GROOVE (Lv.11-20) ---
    { id: 11, p:2, bpm: 100,r:0, s:0.13, d:16, snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"鼓動 100",s:"4分音符",o:"桁が変わる速度。",a:"ここからが本番です。"}, en:{t:"Pulse 100",s:"Quarter",o:"Triple digits.",a:"Real game starts here."} },
    { id: 12, p:2, bpm: 100,r:0, s:0.12, d:16, snd:'click-8', pat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], ja:{t:"疾走 100",s:"8分音符",o:"ロックの基本テンポ。",a:"縦ノリで刻みましょう。"}, en:{t:"Drive 100",s:"8th Note",o:"Rock standard.",a:"Keep it vertical."} },
    { id: 13, p:2, bpm: 110,r:0, s:0.12, d:16, snd:'click-8', pat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], ja:{t:"疾走 110",s:"8分音符",o:"少し速い連打。",a:"脱力しないと間に合いません。"}, en:{t:"Drive 110",s:"8th Note",o:"Faster flow.",a:"Relax to keep up."} },
    { id: 14, p:2, bpm: 120,r:0, s:0.12, d:16, snd:'click-8', pat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], ja:{t:"疾走 120",s:"8分音符",o:"標準的なアップテンポ。",a:"呼吸を止めないで。"}, en:{t:"Drive 120",s:"8th Note",o:"Standard Up-tempo.",a:"Don't hold breath."} },
    { id: 15, p:2, bpm: 80, r:0, s:0.12, d:12, snd:'click-4', pat:[1,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0], ja:{t:"16ビート",s:"タッ・カッ",o:"16分音符の裏。",a:"「タ・カ」の「カ」の部分。"}, en:{t:"16th Feel",s:"Syncopation",o:"The 'e' and 'a'.",a:"Feel the subdiv."} },
    { id: 16, p:2, bpm: 90, r:0, s:0.11, d:16, snd:'click-4', pat:[1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0], ja:{t:"ファンク",s:"16分音符",o:"食うリズム。",a:"身体を揺らしてリズムを取る。"}, en:{t:"Funk",s:"16th Sync",o:"Anticipation.",a:"Move your body."} },
    { id: 17, p:2, bpm: 100,r:0, s:0.11, d:16, snd:'click-up-str', pat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], ja:{t:"裏拍 100",s:"裏打ち",o:"高速な裏打ち。",a:"スカやレゲエのイメージで。"}, en:{t:"Upbeat 100",s:"Off-beat",o:"Fast Off-beat.",a:"Ska/Reggae feel."} },
    { id: 18, p:2, bpm: 60, r:0, s:0.10, d:8,  snd:'click-4', pat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], ja:{t:"マシンガン",s:"16分連打",o:"正確無比な連打。",a:"指先のコントロール。"}, en:{t:"Machinegun",s:"16th Run",o:"Precision run.",a:"Finger control."} },
    { id: 19, p:2, bpm: 120,r:0, s:0.10, d:16, snd:'click-gap-2', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"空白 120",s:"Gap 2",o:"2小節消えます。",a:"体感時間を信じる。"}, en:{t:"Void 120",s:"Gap 2",o:"2 Bars silence.",a:"Trust internal clock."} },
    { id: 20, p:2, bpm: 130,r:0, s:0.09, d:24, snd:'click-gap-4', pat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], ja:{t:"P2修了検定",s:"Gap 4",o:"8ビートの卒業試験。",a:"ガイドなしで走りきれ。"}, en:{t:"P2 Exam",s:"Gap 4",o:"8-beat Final.",a:"Run without guide."} },

    // --- PHASE 3: SWING ENTRY (Lv.21-30) ---
    { id: 21, p:3, bpm: 100,r:0.33,s:0.12,d:16,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"スイング 100",s:"Shuffle",o:"ここから世界が歪む。",a:"3連符の真ん中を抜く感覚。"}, en:{t:"Swing 100",s:"Shuffle",o:"World bends here.",a:"Triplet feel."} },
    { id: 22, p:3, bpm: 110,r:0.33,s:0.12,d:16,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"スイング 110",s:"Shuffle",o:"楽しい跳ねリズム。",a:"「っタ、っタ」と発音して。"}, en:{t:"Swing 110",s:"Shuffle",o:"Bouncy rhythm.",a:"Say 'A-Ta, A-Ta'."} },
    { id: 23, p:3, bpm: 120,r:0.33,s:0.11,d:16,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"スイング 120",s:"Shuffle",o:"標準的なジャズテンポ。",a:"レガート（滑らか）に。"}, en:{t:"Swing 120",s:"Shuffle",o:"Standard Jazz.",a:"Play legato."} },
    { id: 24, p:3, bpm: 100,r:0.33,s:0.11,d:16,snd:'click-8', pat:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], ja:{t:"2フィール",s:"2分音符",o:"ベースラインの感覚。",a:"1と3拍目を重く。"}, en:{t:"2-Feel",s:"Half Note",o:"Bassline feel.",a:"Heavy on 1 & 3."} },
    { id: 25, p:3, bpm: 110,r:0.33,s:0.10,d:16,snd:'click-up-sw',pat:[0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0], ja:{t:"裏打ちSW",s:"Swing裏",o:"スイングの裏拍は遅い。",a:"十分に待ってから叩く。"}, en:{t:"Up-Swing",s:"Off-beat",o:"Swing off-beat is late.",a:"Wait for it."} },
    { id: 26, p:3, bpm: 120,r:0.33,s:0.10,d:16,snd:'click-8', pat:[1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0], ja:{t:"チャールストン",s:"付点4分",o:"ジャズの典型的リズム。",a:"「ダッ・・ウダッ・・」"}, en:{t:"Charleston",s:"Dotted Q",o:"Classic Jazz.",a:"'Da.. (u)Da..'."} },
    { id: 27, p:3, bpm: 130,r:0.33,s:0.09,d:16,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"ウォーキング",s:"4分音符",o:"進撃のベースライン。",a:"前へ前へと進む推進力。"}, en:{t:"Walking",s:"Quarter",o:"Forward motion.",a:"Driving bass."} },
    { id: 28, p:3, bpm: 140,r:0.33,s:0.09,d:16,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"スイング 140",s:"4分音符",o:"少し息が切れる速度。",a:"力むと遅れます。"}, en:{t:"Swing 140",s:"Quarter",o:"Getting hot.",a:"Tension causes lag."} },
    { id: 29, p:3, bpm: 120,r:0.33,s:0.09,d:16,snd:'click-gap-2', pat:[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0], ja:{t:"空白SW 120",s:"Gap 2",o:"スイングでの空間把握。",a:"3連のグリッドを心に。"}, en:{t:"Void SW 120",s:"Gap 2",o:"Swing space.",a:"Mental triplet grid."} },
    { id: 30, p:3, bpm: 130,r:0.33,s:0.08,d:24,snd:'click-gap-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"P3修了検定",s:"Gap 4",o:"スイングの卒業試験。",a:"ガイドなしで踊りきれ。"}, en:{t:"P3 Exam",s:"Gap 4",o:"Swing Final.",a:"Dance without guide."} },

    // --- PHASE 4: ADVANCED (Lv.31-40) ---
    { id: 31, p:4, bpm: 150,r:0.33,s:0.08,d:24,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"ハードバップ",s:"Fast Swing",o:"熱いジャズの入り口。",a:"シンバルレガートのイメージ。"}, en:{t:"Hard Bop",s:"Fast Swing",o:"Hot Jazz entry.",a:"Ride cymbal image."} },
    { id: 32, p:4, bpm: 160,r:0.33,s:0.08,d:24,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"バーニング",s:"Fast Swing",o:"燃えるような疾走感。",a:"指先だけで制御する。"}, en:{t:"Burning",s:"Fast Swing",o:"Burning speed.",a:"Fingertip control."} },
    { id: 33, p:4, bpm: 170,r:0.33,s:0.07,d:24,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"リミット",s:"Fast Swing",o:"思考停止の速度。",a:"考えるな、感じろ。"}, en:{t:"Limit",s:"Fast Swing",o:"No thinking.",a:"Don't think, feel."} },
    { id: 34, p:4, bpm: 140,r:0.33,s:0.07,d:24,snd:'click-8', pat:[1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0], ja:{t:"複雑 140",s:"Syncopation",o:"高速チャールストン。",a:"パターンを見失わないで。"}, en:{t:"Complex 140",s:"Syncopation",o:"Fast Charleston.",a:"Stay focused."} },
    { id: 35, p:4, bpm: 90, r:0, s:0.07, d:16, snd:'click-16',pat:[1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0], ja:{t:"ポリリズム",s:"3 over 4",o:"4拍子の中の3拍子。",a:"1拍半ごとのアクセント。"}, en:{t:"Polyrhythm",s:"3 over 4",o:"3 against 4.",a:"Every 1.5 beats."} },
    { id: 36, p:4, bpm: 150,r:0.33,s:0.07,d:24,snd:'click-gap-2', pat:[0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0], ja:{t:"空白裏SW",s:"Gap Off",o:"ガイド無しで裏打ち。",a:"難易度S級の入り口。"}, en:{t:"Void Off",s:"Gap Off",o:"Blind off-beat.",a:"S-Tier entry."} },
    { id: 37, p:4, bpm: 180,r:0.33,s:0.06,d:32,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"ビバップ",s:"Very Fast",o:"伝説的な速度。",a:"脱力しないと腕が死にます。"}, en:{t:"Bebop",s:"Very Fast",o:"Legendary speed.",a:"Relax or die."} },
    { id: 38, p:4, bpm: 160,r:0.33,s:0.06,d:32,snd:'click-8', pat:[1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0], ja:{t:"ランニング",s:"8th Lines",o:"高速フレーズ。",a:"粒立ちを揃えて。"}, en:{t:"Running",s:"8th Lines",o:"Fast lines.",a:"Keep it even."} },
    { id: 39, p:4, bpm: 100,r:0, s:0.06, d:16, snd:'click-gap-4', pat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], ja:{t:"完全空白",s:"Gap 4 Off",o:"ガイド無し、裏拍のみ。",a:"自分の中の神を信じろ。"}, en:{t:"Total Void",s:"Gap 4 Off",o:"No guide, Off only.",a:"Trust your god."} },
    { id: 40, p:4, bpm: 160,r:0.33,s:0.05,d:32,snd:'click-gap-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"P4修了検定",s:"Gap 4 Fast",o:"上級者の壁。",a:"プロレベルの安定感が必要。"}, en:{t:"P4 Exam",s:"Gap 4 Fast",o:"Pro Wall.",a:"Pro stability needed."} },

    // --- PHASE 5: GOD TIER (Lv.41-50) ---
    { id: 41, p:5, bpm: 190,r:0.33,s:0.05,d:32,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"超高速 190",s:"Super Fast",o:"人間の限界に挑戦。",a:"もはや反射神経のゲーム。"}, en:{t:"Hyper 190",s:"Super Fast",o:"Human limit.",a:"Reflex game."} },
    { id: 42, p:5, bpm: 200,r:0.33,s:0.05,d:32,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"超高速 200",s:"Super Fast",o:"未知の領域。",a:"瞬き厳禁。"}, en:{t:"Hyper 200",s:"Super Fast",o:"Unknown realm.",a:"Don't blink."} },
    { id: 43, p:5, bpm: 210,r:0.33,s:0.04,d:32,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"超高速 210",s:"Super Fast",o:"音速を超えて。",a:"指が勝手に動く境地。"}, en:{t:"Hyper 210",s:"Super Fast",o:"Supersonic.",a:"Auto-pilot mode."} },
    { id: 44, p:5, bpm: 170,r:0.33,s:0.04,d:32,snd:'drum-only', pat:[1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0], ja:{t:"ジャズドラム",s:"Comping",o:"ドラムとの対話。",a:"クリック音はありません。"}, en:{t:"Jazz Drums",s:"Comping",o:"Trade w/ drums.",a:"No click track."} },
    { id: 45, p:5, bpm: 180,r:0.33,s:0.04,d:32,snd:'drum-only', pat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], ja:{t:"裏の極意",s:"Upbeat Only",o:"ドラムに合わせて裏を叩く。",a:"究極のグルーヴ。"}, en:{t:"Upbeat Master",s:"Upbeat Only",o:"Groove w/ drums.",a:"Ultimate groove."} },
    { id: 46, p:5, bpm: 140,r:0.33,s:0.04,d:32,snd:'click-gap-4', pat:[1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0], ja:{t:"心眼",s:"Blind Funk",o:"見えないリズムを叩く。",a:"心の目で見る。"}, en:{t:"Mind's Eye",s:"Blind Funk",o:"Hit invisible.",a:"See with mind."} },
    { id: 47, p:5, bpm: 60, r:0, s:0.03, d:16, snd:'click-gap-4', pat:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], ja:{t:"禅",s:"Zen Space",o:"永遠のような空間。",a:"待つことの極致。"}, en:{t:"Zen",s:"Zen Space",o:"Eternal space.",a:"Master of waiting."} },
    { id: 48, p:5, bpm: 220,r:0.33,s:0.04,d:48,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"光速 220",s:"Light Speed",o:"思考の向こう側。",a:"無心。"}, en:{t:"Lightspeed",s:"Light Speed",o:"Beyond thought.",a:"No mind."} },
    { id: 49, p:5, bpm: 240,r:0.33,s:0.04,d:48,snd:'click-4', pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], ja:{t:"特異点",s:"Singularity",o:"リズムの崩壊と再生。",a:"全てを出し切れ。"}, en:{t:"Singularity",s:"Singularity",o:"Collapse & Rebirth.",a:"Give everything."} },
    { id: 50, p:5, bpm: 180,r:0.33, s:0.03, d:64, snd:'drum-only', pat:[1,-1,1,-1,1,-1,1,-1,1,-1,1,-1,1,-1,1,-1], ja:{t:"THE LEGEND",s:"完 全 制 覇",o:"免許皆伝。",a:"Enjoy Music."}, en:{t:"THE LEGEND",s:"GOD",o:"Mastery.",a:"Enjoy Music."} }
];

// --- 3. SYSTEM VARIABLES ---
let audioCtx, noiseBuffer;
let isPlaying = false, isDemo = false, chartInstance = null;
let currentLesson = null;
let nextNoteTime = 0, noteIndex = 0;
let notes = [], hitHistory = [];
let progress = { passed: [], stats: {} };
let animationId;
const SAVE_KEY = 'jrt_save_v5';
const OFFSET_KEY = 'jrt_offset';

let userOffset = 0.06;

let isCalibrating = false;
let calibNextTime = 0;
let calibCount = 0;
let calibTimerId = null;
const CALIB_BPM = 100;
const CALIB_ALPHA = 0.1;

// --- 4. CORE FUNCTIONS ---
function setLang(l) {
    lang = l;
    initAudio(); 
    
    document.getElementById('title-screen').style.opacity = 0;
    
    setTimeout(() => {
        document.getElementById('title-screen').style.display = 'none';
        document.getElementById('main-header').style.display = 'flex';
        document.getElementById('app-footer').style.display = 'block';

        if (!localStorage.getItem(OFFSET_KEY)) {
            showWelcome();
        } else {
            renderMenu();
        }
    }, 500);
}

function updateTexts() {
    const t = TEXT[lang];
    document.getElementById('menu-title').innerText = t.menuTitle;
    document.getElementById('menu-desc').innerText = t.menuDesc;
    document.getElementById('btn-reset-data').innerText = t.reset;
    document.getElementById('btn-play-demo').innerHTML = t.demo;
    document.getElementById('btn-start-session').innerText = t.start;
    document.getElementById('btn-cancel-brief').innerText = t.cancel;
    document.getElementById('stats-title').innerText = t.statsTitle;
    document.getElementById('help-title').innerText = t.helpTitle;
    document.getElementById('help-content').innerHTML = t.helpContent;
    document.getElementById('close-help').innerText = t.cancel;
    document.getElementById('close-stats').innerText = t.cancel;
}

function loadSave() {
    const d = localStorage.getItem(SAVE_KEY);
    if(d) progress = JSON.parse(d);
    if(!progress.stats) progress.stats = {};
    const o = localStorage.getItem(OFFSET_KEY);
    if(o) userOffset = parseFloat(o);
}
function saveProgress() { localStorage.setItem(SAVE_KEY, JSON.stringify(progress)); }
function resetSave() {
    if(confirm(TEXT[lang].resetConfirm)) {
        localStorage.removeItem(SAVE_KEY);
        progress = { passed: [], stats: {} };
        renderMenu();
    }
}

// --- 5. AUDIO ENGINE ---
function initAudio() {
    if(!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext({ latencyHint: 'interactive', sampleRate: 44100 });
    }
    if(audioCtx.state === 'suspended') audioCtx.resume();
    if(!noiseBuffer) {
        const b = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
        const d = b.getChannelData(0);
        for(let i=0; i<d.length; i++) d[i] = Math.random() * 2 - 1;
        noiseBuffer = b;
    }
}

function playSound(type, time, vol=1.0) {
    if(!audioCtx) return;
    const t = Math.max(audioCtx.currentTime, time);
    const master = audioCtx.createGain(); master.gain.value=1.0; master.connect(audioCtx.destination);

    if(type === 'click' || type === 'count') {
        const osc = audioCtx.createOscillator(); const g = audioCtx.createGain();
        osc.frequency.setValueAtTime(type==='count'?1000:800, t);
        osc.frequency.exponentialRampToValueAtTime(100, t+0.1);
        g.gain.setValueAtTime(0.7*vol, t); g.gain.exponentialRampToValueAtTime(0.01, t+0.05);
        osc.connect(g); g.connect(master); osc.start(t); osc.stop(t+0.1);
    } else if(type === 'ride') {
        [320, 460, 680, 940].forEach((f,i)=>{
            const o=audioCtx.createOscillator(); const g=audioCtx.createGain();
            o.type='square'; o.frequency.value=f; o.detune.value=Math.random()*20-10;
            g.gain.setValueAtTime((0.03/(i+1))*vol,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.4);
            const h=audioCtx.createBiquadFilter(); h.type='highpass'; h.frequency.value=3000;
            o.connect(g); g.connect(h); h.connect(master); o.start(t); o.stop(t+0.5);
        });
        const n=audioCtx.createBufferSource(); n.buffer=noiseBuffer;
        const ng=audioCtx.createGain(); const nf=audioCtx.createBiquadFilter();
        nf.type='bandpass'; nf.frequency.value=8000;
        ng.gain.setValueAtTime(0.3*vol,t); ng.gain.exponentialRampToValueAtTime(0.001,t+(vol>0.8?0.8:0.4));
        n.connect(nf); nf.connect(ng); ng.connect(master); n.start(t); n.stop(t+1.0);
    } else if(type === 'hihat') {
        const n=audioCtx.createBufferSource(); n.buffer=noiseBuffer;
        const nf=audioCtx.createBiquadFilter(); nf.type='highpass'; nf.frequency.value=7000;
        const ng=audioCtx.createGain(); ng.gain.setValueAtTime(0.6*vol,t); ng.gain.exponentialRampToValueAtTime(0.001,t+0.06);
        n.connect(nf); nf.connect(ng); ng.connect(master); n.start(t); n.stop(t+0.1);
    } else if(type === 'kick') {
        const o=audioCtx.createOscillator(); const g=audioCtx.createGain();
        o.frequency.setValueAtTime(120,t); o.frequency.exponentialRampToValueAtTime(50,t+0.15);
        g.gain.setValueAtTime(0.8*vol,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o.connect(g); g.connect(master); o.start(t); o.stop(t+0.3);
    } else if(type === 'guide') {
        const o=audioCtx.createOscillator(); const g=audioCtx.createGain();
        o.type='sine'; o.frequency.value=880; g.gain.setValueAtTime(0.1*vol,t); g.gain.linearRampToValueAtTime(0,t+0.1);
        o.connect(g); g.connect(master); o.start(t); o.stop(t+0.1);
    }
}

// --- 6. GAME LOGIC ---
function getSwingTime(base, sixteenth, bpm, ratio) {
    const secPer16 = (60/bpm)/4;
    const mod = sixteenth % 4;
    let dr = ratio;
    if(ratio > 0) dr = 0.25 + (0.12 * Math.max(0, Math.min(1, (300-bpm)/200)));
    if(mod === 2 || mod === 3) return base + (secPer16 * dr * 1.8);
    return base;
}

function schedule() {
    if(!isPlaying) return;
    const bpm = currentLesson.bpm;
    const secPer16 = (60/bpm)/4;
    const total16ths = currentLesson.d * 16;
    
    while(nextNoteTime < audioCtx.currentTime + 0.1) {
        if(isDemo && noteIndex >= 64) { stopDemo(); return; }
        if(!isDemo && noteIndex >= total16ths) { finishLesson(); return; }

        const bar = Math.floor(noteIndex / 16);
        const sixteenth = noteIndex % 16;
        const actualTime = getSwingTime(nextNoteTime, sixteenth, bpm, currentLesson.r);
        
        const st = currentLesson.snd;
        let isGap = false;
        if(st.includes('gap-4') && (bar+1)%4===0) isGap=true;
        if(st.includes('gap-2') && bar%4>=2) isGap=true;

        if(!isGap || isDemo) {
            let click=false;
            if(!isGap) {
                if(st==='click-4' && sixteenth%4===0) click=true;
                else if(st==='click-8' && sixteenth%2===0) click=true;
                else if((st==='click-up-str'||st==='click-up-sw') && sixteenth%4===2) click=true;
                else if((st==='click-24'||st.includes('gap')) && (sixteenth===4||sixteenth===12)) click=true;
            }
            if(click) playSound('click', actualTime, 0.8);

            if(currentLesson.r > 0 && !st.includes('click-up')) {
                if(sixteenth===4||sixteenth===12) playSound('hihat', actualTime, 0.7);
                if(sixteenth===0||sixteenth===8) playSound('ride', actualTime, 0.7);
                if(sixteenth===6||sixteenth===14) playSound('ride', actualTime, 0.85);
                if(sixteenth===0||sixteenth===8) playSound('kick', actualTime, 0.5);
            }
        }

        const pVal = currentLesson.pat[sixteenth];
        if(pVal !== 0) {
            if(isDemo) playSound('guide', actualTime);
            notes.push({ time:actualTime, type:pVal, processed:false, angle:(sixteenth/16)*Math.PI*2 - Math.PI/2 });
        }
        nextNoteTime += secPer16;
        noteIndex++;
    }
    setTimeout(schedule, 20);
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
window.addEventListener('resize', resize); resize();

function draw() {
    if(!isPlaying && !document.getElementById('countdown-overlay').innerHTML) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const cx=canvas.width/2, cy=canvas.height/2;
    const r=Math.min(cx,cy)*0.55;
    const now=audioCtx?audioCtx.currentTime:0;

    // Radar
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.strokeStyle="rgba(255,255,255,0.1)"; ctx.lineWidth=4; ctx.stroke();
    for(let i=0;i<4;i++){
        const a=i*(Math.PI/2)-Math.PI/2;
        ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*(r-10),cy+Math.sin(a)*(r-10));
        ctx.lineTo(cx+Math.cos(a)*(r+10),cy+Math.sin(a)*(r+10));
        ctx.strokeStyle=i===0?"var(--accent)":"rgba(255,255,255,0.3)"; ctx.stroke();
    }

    if(isPlaying) {
        const ph = ((now*currentLesson.bpm/240)%1)*Math.PI*2 - Math.PI/2;
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(ph)*r, cy+Math.sin(ph)*r);
        ctx.strokeStyle=isDemo?"#aaa":"var(--accent)"; ctx.lineWidth=2; ctx.stroke();

        const linearY = cy+r+80;
        notes.forEach(n => {
            if(n.processed) return;
            const diff = n.time - now;
            if(!isDemo && diff < -0.15) { n.processed=true; hitHistory.push({diff:null, type:'miss'}); showFeedback("MISS","#555"); }
            if(isDemo && diff < -0.05) n.processed=true;
            
            if(diff>0 && diff<(60/currentLesson.bpm)*4) {
                const alpha = 1-(diff/((60/currentLesson.bpm)*4));
                ctx.fillStyle=n.type===1?"#f72585":"#4cc9f0"; ctx.globalAlpha=alpha;
                ctx.beginPath(); ctx.arc(cx+Math.cos(n.angle)*r, cy+Math.sin(n.angle)*r, 10, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
            }
            const lx = cx+(diff*300);
            if(lx>0 && lx<canvas.width) {
                ctx.fillStyle=n.type===1?"#f72585":"#4cc9f0";
                ctx.beginPath(); ctx.arc(lx, linearY, 12, 0, Math.PI*2); ctx.fill();
            }
        });
        
        if(!isDemo) {
            ctx.beginPath(); ctx.moveTo(cx,linearY-30); ctx.lineTo(cx,linearY+30); ctx.strokeStyle="#fff"; ctx.stroke();
            const el = Math.max(0, now - (notes[0]?notes[0].time:0)+2);
            document.getElementById('hud-time').innerText = Math.floor(el/60)+":"+Math.floor(el%60).toString().padStart(2,'0');
        } else document.getElementById('hud-time').innerText = "DEMO";
    }
    animationId = requestAnimationFrame(draw);
}

// --- 7. INPUT & FEEDBACK ---
function handleInput(type) {
    if(isCalibrating) {
        handleCalibrationTap();
        return;
    }

    if(!isPlaying || isDemo) return;
    const now = audioCtx.currentTime;
    
    const osc=audioCtx.createOscillator(); const g=audioCtx.createGain();
    osc.frequency.value=800; g.gain.setValueAtTime(0.1,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.1);
    osc.connect(g); g.connect(audioCtx.destination); osc.start(now); osc.stop(now+0.1);

    let best=999, target=null;
    const effectiveInputTime = now - userOffset;

    notes.forEach(n => {
        if(n.processed || n.type !== type) return;
        const d = Math.abs(effectiveInputTime - n.time);
        if(d < best) { best = d; target = n; }
    });

    if(target && best < currentLesson.s) {
        target.processed = true;
        const diff = effectiveInputTime - target.time;
        hitHistory.push({diff:diff, type:'hit'});
        const ms = Math.round(diff*1000);
        const isP = Math.abs(ms) < 30;
        showFeedback(isP?"PERFECT":ms+"ms", isP?"#0ff":(ms>0?"#f09":"#ff0"));
    }
}

function showFeedback(t,c) {
    const el = document.getElementById('feedback-float');
    el.innerText = t; el.style.color = c; el.style.opacity = 1;
    setTimeout(()=>el.style.opacity=0, 200);
}

function finishLesson() {
    isPlaying = false; document.body.classList.remove('playing');
    const hits = hitHistory.filter(h=>h.type==='hit');
    const total = hits.length + hitHistory.filter(h=>h.type==='miss').length;
    if(total===0) { showResult('F',0,0,"No Input"); return; }
    
    const sum = hits.reduce((a,b)=>a+b.diff,0);
    const mean = sum/hits.length * 1000;
    const variance = hits.reduce((a,b)=>a+Math.pow((b.diff*1000)-mean,2),0)/hits.length;
    const sd = Math.sqrt(variance);

    let grade="F", msg="FAILED", passed=false;
    const limit = currentLesson.p === 1 ? 60 : (currentLesson.p >= 4 ? 40 : 50);

    if (hits.length > total*0.8 && sd < limit) {
        if(sd<20 && Math.abs(mean)<20) { grade="S"; msg="GODLIKE"; passed=true; }
        else if(sd<35) { grade="A"; msg="EXCELLENT"; passed=true; }
        else { grade="B"; msg="PASSED"; passed=true; }
    } else msg = "UNSTABLE";

    if(passed) {
        if(!progress.passed.includes(currentLesson.id)) progress.passed.push(currentLesson.id);
        progress.stats[currentLesson.id] = { bias: Math.round(mean), sd: Math.round(sd) };
        saveProgress();
    }
    showResult(grade, Math.round(mean), Math.round(sd), msg);
}

function toggleDemo() {
    if(isDemo) {
        stopDemo();
    } else {
        initAudio();
        isDemo = true;
        isPlaying = true;
        notes = [];
        noteIndex = 0;
        nextNoteTime = audioCtx.currentTime;
        
        const btn = document.getElementById('btn-play-demo');
        if(btn) {
            btn.innerHTML = TEXT[lang].stopDemo;
            btn.classList.add('playing');
        }
        
        schedule();
        draw();
    }
}

function stopDemo() {
    isDemo = false;
    isPlaying = false;
    document.body.classList.remove('playing');
    
    const btn = document.getElementById('btn-play-demo');
    if(btn) {
        btn.innerHTML = TEXT[lang].demo;
        btn.classList.remove('playing');
    }
}

// --- 8. UI CONTROLLERS & CALIBRATION ---
function showModal(id) { document.querySelectorAll('.modal-overlay').forEach(e=>e.classList.remove('active')); document.getElementById(id).classList.add('active'); }
function hideModals() { document.querySelectorAll('.modal-overlay').forEach(e=>e.classList.remove('active')); }

// WELCOME & FIRST SETUP
function showWelcome() {
    showModal('modal-welcome');
}
function closeWelcome() {
    hideModals();
}
function startCalibrationFromWelcome() {
    initAudio();
    closeWelcome();
    startCalibration();
}

// CALIBRATION
function startCalibration() {
    initAudio();
    isCalibrating = true;
    calibNextTime = audioCtx.currentTime + 0.5;
    calibCount = 0;
    document.getElementById('calib-offset-val').innerText = Math.round(userOffset * 1000);
    showModal('modal-calibration');
    scheduleCalibration();
}

function scheduleCalibration() {
    if(!isCalibrating) return;
    const interval = 60 / CALIB_BPM;
    
    while(calibNextTime < audioCtx.currentTime + 0.1) {
        playSound('click', calibNextTime);
        const t = calibNextTime;
        setTimeout(() => {
            if(!isCalibrating) return;
            const el = document.getElementById('calib-visual');
            el.classList.add('flash');
            setTimeout(()=>el.classList.remove('flash'), 50);
        }, (t - audioCtx.currentTime)*1000);
        
        calibNextTime += interval;
        calibCount++;
    }
    calibTimerId = setTimeout(scheduleCalibration, 50);
}

function stopCalibrationLoop() {
    isCalibrating = false;
    if(calibTimerId) clearTimeout(calibTimerId);
    calibTimerId = null;
}

function saveCalibration() {
    stopCalibrationLoop();
    localStorage.setItem(OFFSET_KEY, userOffset.toFixed(5));
    hideModals();
    renderMenu();
}

function cancelCalibration() {
    stopCalibrationLoop();
    loadSave();
    hideModals();
    if(localStorage.getItem(OFFSET_KEY)) renderMenu();
    else showWelcome(); 
}

function prepareLesson(id) {
    currentLesson = LESSON_DATA.find(l=>l.id===id);
    const c = currentLesson[lang];
    document.getElementById('brief-title').innerText = `LESSON ${id} : ${c.t}`;
    document.getElementById('brief-obj').innerText = c.o;
    document.getElementById('brief-advice').innerText = c.a;
    document.getElementById('brief-bpm').innerText = currentLesson.bpm;
    document.getElementById('brief-swing').innerText = currentLesson.r>0?"ON":"OFF";
    isDemo=false; isPlaying=false; hideModals(); showModal('modal-briefing');
}

function showResult(g,m,s,msg) {
    showModal('modal-result');
    const gel = document.getElementById('res-grade');
    gel.innerText=g; gel.className=`big-grade grade-${g}`;
    document.getElementById('res-msg').innerText = msg;
    document.getElementById('res-bias').innerText = (m>0?"+":"")+m+"ms";
    document.getElementById('res-sd').innerText = "±"+s+"ms";
    
    const btn = document.getElementById('btn-next');
    if(g==='F') { btn.innerText = TEXT[lang].retry; btn.onclick = () => prepareLesson(currentLesson.id); }
    else {
        if(currentLesson.id < 50) { btn.innerText = TEXT[lang].next; btn.onclick = () => prepareLesson(currentLesson.id+1); }
        else { btn.innerText = TEXT[lang].menu; btn.onclick = renderMenu; }
    }
}

function renderMenu() {
    updateTexts();
    const list = document.getElementById('lesson-list'); 
    list.innerHTML = "";
    showModal('modal-menu');
    
    let lp = 0;
    LESSON_DATA.forEach((l, i) => {
        if(l.p !== lp) {
            const h = document.createElement('div'); 
            h.className = 'phase-header';
            h.innerText = TEXT[lang].phases[l.p-1]; 
            list.appendChild(h); 
            lp = l.p;
        }
        const pass = progress.passed.includes(l.id);
        const lock = (i>0 && !progress.passed.includes(LESSON_DATA[i-1].id));
        const d = document.createElement('div');
        d.className = `lesson-card ${lock?'locked':''} p${l.p}`;
        d.innerHTML = `
            <div style="flex:1;">
                <div style="display:flex; align-items:center;">
                    <span class="lvl-badge">L.${l.id}</span>
                    <span style="font-weight:bold; color:#fff; font-size:0.9rem;">${l[lang].t}</span>
                </div>
                <div style="font-size:0.7rem; color:#888; margin-top:4px; margin-left:60px;">${l[lang].s}</div>
            </div>
            <div class="status-badge ${pass?'passed':''}">${lock?'LOCK':(pass?'CLEAR':'START')}</div>
        `;
        d.onclick = () => { if(!lock) prepareLesson(l.id); };
        list.appendChild(d);
    });

    if(document.getElementById('btn-calib')) {
        document.getElementById('btn-calib').onclick = () => startCalibration();
    }
    if(document.getElementById('btn-help')) {
        document.getElementById('btn-help').onclick = () => showModal('modal-help');
    }
    if(document.getElementById('btn-stats')) {
        document.getElementById('btn-stats').onclick = () => {
            updateTexts();
            showModal('modal-stats');
            renderChart();
        };
    }
}

// --- 9. STARTUP ---
loadSave();

document.getElementById('close-help').onclick = () => showModal('modal-menu');
document.getElementById('close-stats').onclick = () => showModal('modal-menu');

document.getElementById('btn-play-demo').onclick = toggleDemo;
document.getElementById('btn-start-session').onclick = () => {
    if(isDemo) stopDemo(); 
    initAudio(); 
    hideModals(); 
    document.body.classList.add('playing');
    
    const ce = document.getElementById('countdown-text');
    const beat = 60 / currentLesson.bpm;
    
    document.getElementById('hud-status').innerText = `LESSON ${currentLesson.id}`;
    notes = []; 
    hitHistory = []; 
    noteIndex = 0; 
    draw();
    
    let c = 4;
    function tick() {
        if(c > 0) { 
            ce.innerText = c; 
            ce.className = 'count-anim'; 
            playSound('count', audioCtx.currentTime); 
            setTimeout(() => ce.className = '', beat * 900); 
            setTimeout(tick, beat * 1000); 
            c--;
        } else { 
            ce.innerText = "GO!"; 
            ce.className = 'count-anim'; 
            playSound('kick', audioCtx.currentTime); 
            setTimeout(() => { 
                ce.innerText = ""; 
                isPlaying = true; 
                nextNoteTime = audioCtx.currentTime; 
                schedule(); 
            }, beat * 1000);
        }
    }
    tick();
};

document.getElementById('btn-cancel-brief').onclick = () => { 
    if(isDemo) stopDemo(); 
    renderMenu(); 
};

document.getElementById('btn-reset-data').onclick = resetSave;

if(!localStorage.getItem(OFFSET_KEY)) {
        // Waiting for language selection
}

// --- 10. CHART RENDERING ---
function renderChart() {
    const canvas = document.getElementById('statsChart');
    if (!canvas) return;
    const c = canvas.getContext('2d');
    if(chartInstance) chartInstance.destroy();

    const l=[], d=[];
    LESSON_DATA.forEach(x=>{ 
        if(progress.passed.includes(x.id) && progress.stats[x.id]){ 
            l.push(x.id); 
            d.push(progress.stats[x.id].bias); 
        } 
    });

    if(l.length===0){ l.push(0); d.push(0); }

    chartInstance = new Chart(c, {
        type:'line', 
        data:{ 
            labels:l, 
            datasets:[{ 
                label:'Bias(ms)', 
                data:d, 
                borderColor:'#4cc9f0', 
                tension:0.3, 
                pointRadius:3 
            }] 
        },
        options:{ 
            responsive:true, 
            maintainAspectRatio:false, 
            scales:{ 
                x:{display:false}, 
                y:{ suggestedMin:-50, suggestedMax:50, grid:{color:'#333'} } 
            }, 
            plugins:{legend:{display:false}} 
        }
    });
}

// --- 11. INTEGRATED INPUT HANDLING ---

// 1. Feedback Sound
function triggerInputFeedback(now) {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator(); 
    const g = audioCtx.createGain();
    osc.frequency.value = 1200; 
    g.gain.setValueAtTime(0.1, now); 
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(g); 
    g.connect(audioCtx.destination); 
    osc.start(now); 
    osc.stop(now + 0.05);
}

// 2. Calibration Logic (Relaxed Judgment)
function handleCalibrationTap() {
    if(!isCalibrating) return;
    const now = audioCtx.currentTime;
    const interval = 60 / CALIB_BPM;
    
    const lastBeat = calibNextTime - interval;
    const nextBeat = calibNextTime;
    const distLast = Math.abs(now - lastBeat);
    const distNext = Math.abs(now - nextBeat);
    let targetTime = (distLast < distNext) ? lastBeat : nextBeat;
    
    let rawDiff = now - targetTime;

    userOffset = (userOffset * (1 - CALIB_ALPHA)) + (rawDiff * CALIB_ALPHA);
    
    const valEl = document.getElementById('calib-offset-val');
    if(valEl) valEl.innerText = Math.round(userOffset * 1000);
    
    const visEl = document.getElementById('calib-visual');
    if(visEl) {
        visEl.classList.add('flash');
        setTimeout(()=>visEl.classList.remove('flash'), 50);
    }
}

// 3. Keyboard Input (Unified)
document.addEventListener('keydown', e => { 
    // A. Calibration Mode
    if(isCalibrating) {
        if(e.code === 'Space' || e.code === 'Enter' || e.key === 'x' || e.key === 'z' || e.key.includes('Arrow')) {
            e.preventDefault();
            triggerInputFeedback(audioCtx.currentTime);
            handleCalibrationTap();
        }
        return;
    }

    // B. Game Mode
    if(e.key === 'x' || e.key === 'ArrowUp') handleInput(1); 
    if(e.key === 'z' || e.key === 'ArrowDown') handleInput(-1); 
});

// 4. Pointer Input (Unified for Touch/Mouse)
document.addEventListener('pointerdown', e => {
    // A. Calibration Mode
    if(isCalibrating) {
        if(e.target.closest('button')) return; // Ignore buttons
        if(e.target.closest('#modal-calibration') || e.target.closest('.modal-overlay')) {
            e.preventDefault();
            triggerInputFeedback(audioCtx.currentTime); 
            handleCalibrationTap();
        }
        return;
    }
    
    // B. Game Mode
    if(isPlaying && !isDemo && e.target.tagName === 'CANVAS'){ 
        e.preventDefault(); 
        handleInput(e.clientY < window.innerHeight / 2 ? 1 : -1); 
    } 
}, {passive: false});