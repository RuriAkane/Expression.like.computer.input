const { Player } = TextAliveApp;

// TextAlive Playerの初期化
const player = new Player({
    app: true,
    mediaElement: document.querySelector("#media")
});

// オートスクロールのためのスイッチ
let auto_sw = true;
// 2セットでの改行のためのスイッチ
let newline_sw = true;
// 文字の表示判定のための変数
let t = -1;
// 色反転を戻すための変数
let before = null;
// 読み込み時間の設定
player.wait = 4;
// ビート情報のための変数
let b;
// 円の表示のためのスイッチ
let circle_sw1 = false;
let circle_sw2 = false;

player.addListener({
    onAppReady: (app) => {
        if (!app.managed) {
            // グリーンライツ・セレナーデ / Omoi feat. 初音ミク
            // - 初音ミク「マジカルミライ 2018」テーマソング
            // - 楽曲: http://www.youtube.com/watch?v=XSLhsjepelI
            // - 歌詞: https://piapro.jp/t/61Y2
            player.createFromSongUrl("http://www.youtube.com/watch?v=XSLhsjepelI", {
                video: {
                    // 音楽地図訂正履歴: https://songle.jp/songs/1249410/history
                    beatId: 3818919,
                    chordId: 1207328,
                    repetitiveSegmentId: 1942131,
                    // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv%3DXSLhsjepelI
                    lyricId: 50145,
                    lyricDiffId: 3168
                }
            });

            // ブレス・ユア・ブレス / 和田たけあき feat. 初音ミク
            // - 初音ミク「マジカルミライ 2019」テーマソング
            // - 楽曲: http://www.youtube.com/watch?v=a-Nf3QUFkOU
            // - 歌詞: https://piapro.jp/t/Ytwu
            //player.createFromSongUrl("http://www.youtube.com/watch?v=a-Nf3QUFkOU", {
            //   video: {
            //     // 音楽地図訂正履歴: https://songle.jp/songs/1688650/history
            //       beatId: 3818481,
            //     chordId: 1546157,
            //   repetitiveSegmentId: 1942135,
            //     // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=a-Nf3QUFkOU
            //   lyricId: 50146,
            //   lyricDiffId: 3143
            //}
            //});

            // 愛されなくても君がいる / ピノキオピー feat. 初音ミク
            // - 初音ミク「マジカルミライ 2020」テーマソング
            // - 楽曲: http://www.youtube.com/watch?v=ygY2qObZv24
            // - 歌詞: https://piapro.jp/t/PLR7
            //player.createFromSongUrl("http://www.youtube.com/watch?v=ygY2qObZv24", {
            //  video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/1977449/history
            //    beatId: 3818852,
            //    chordId: 1955797,
            //    repetitiveSegmentId: 1942043,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=ygY2qObZv24
            //    lyricId: 50150,
            //    lyricDiffId: 3158
            //  }
            //});
        }
    },

    // 動画オブジェクトの準備が整ったとき
    onVideoReady: (v) => {
        //楽曲情報
        document.querySelector("#song span").textContent = player.data.song.name;
        document.querySelector("#artist span").textContent = player.data.song.artist.name;
        // 定期的に呼ばれる各単語の "animate" 関数をセットする
        let w = player.video.firstChar;
        while (w) {
            w.animate = animateChar;
            w = w.next;
        }
    },

    // 再生コントロールが可能となったとき
    onTimerReady: () => {
        // 再生ボタンの設定
        document.querySelector("#start").addEventListener("click", () => {
            player.requestPlay();

        });
        // 停止ボタンの設定
        document.querySelector("#stop").addEventListener("click", () => {
            player.requestPause();
        });
        // オートスクロールボタンの設定
        document.querySelector("#auto").addEventListener("click", () => {
            if (auto_sw) {
                document.querySelector("#auto span").textContent = "OFF";
            } else {
                document.querySelector("#auto span").textContent = "ON";
            }
            auto_sw = !auto_sw;
        });
        // 再生ボタンとオートスクロールボタンを表示
        document.querySelector("#start").className = "abled";
        document.querySelector("#auto").className = "abled";
    },

    // 再生位置情報が更新されたとき
    onTimeUpdate: (position) => {
        // オートスクロールスイッチがtrueのとき，スクロールする
        if (auto_sw) {
            window.scrollBy(0, 1);
        }
        let beat = player.findBeat(position);
        if (b !== beat) {
            b = beat;
            document.querySelector("#circle").style.width = "0px";
            document.querySelector("#circle").style.height = "0px";
            // 声の入りに合わせて円を表示し始める
            if (circle_sw2) {
                circle_sw1 = true;
            }
        } else {
            if (circle_sw1) {
                // サビとサビ以外の設定
                if (player.findChorus(position)) {
                    document.querySelector("#circle").style.borderStyle = "solid";
                    document.querySelector("#circle").style.borderWidth = "20px";
                    document.querySelector("#circle").style.borderColor = "#9DFF0F";
                } else {
                    document.querySelector("#circle").style.borderStyle = "solid";
                    document.querySelector("#circle").style.borderWidth = "20px";
                    document.querySelector("#circle").style.borderColor = "white";
                }
                //円の表示
                document.querySelector("#circle").style.width = Math.floor(600 * (position - beat.startTime) / beat.duration) + "px";
                document.querySelector("#circle").style.height = Math.floor(600 * (position - beat.startTime) / beat.duration) + "px";
            }
        }
    },

    // 再生されたとき
    onPlay: () => {
        document.querySelector("#start").className = "disabled";
        document.querySelector("#stop").className = "abled";
    },

    // 再生が一時停止されたとき
    onPause: () => {
        document.querySelector("#start").className = "abled";
        document.querySelector("#stop").className = "disabled";
    },

    //再生が停止されたとき
    onStop: () => {
        document.querySelector("#circle").style.borderWidth = "0px";
        document.querySelector("#circle").style.opacity = "0";
    }
});

// 発声されていたら #text に表示する
const animateChar = function(now, unit) {
    if (unit.contains(now)) {
        // 円の表示の準備
        circle_sw2 = true;
        // 文字を一度だけ表示する
        if (t <= now) {
            t = unit.endTime;
            const div = document.createElement("div");
            // 最初の文字は別設定
            if (unit.parent.parent.firstChar === unit) {
                div.style.fontSize = "70px";
                // 2セットで 1 行
                if (newline_sw) {
                    document.querySelector("#text").appendChild(document.createElement('br'));
                } else {
                    document.querySelector("#text").appendChild(document.createTextNode("　"));
                }
                newline_sw = !newline_sw;
            } else {
                div.style.paddingBottom = "15px";
            }
            // 発声中の文字は表示を変える
            div.style.fontWeight = "bold";
            div.style.color = "white";
            div.style.backgroundColor = "rgb(78, 169, 174)";
            div.appendChild(document.createTextNode(unit.text));
            document.querySelector("#text").appendChild(div);
            // 前に発声していた文字は表示を戻す
            if (before) {
                before.style.fontWeight = "";
                before.style.color = "";
                before.style.backgroundColor = "";
            }
            before = div;
        }
        // 間奏に入った場合
    } else if (before && t < now) {
        before.style.fontWeight = "";
        before.style.color = "";
        before.style.backgroundColor = "";
        before = null;
    }
}