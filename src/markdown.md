class: center, middle

# Node.jsでのゲームサーバ開発 愛すべきバッドノウハウ3選

---
# まだ

Node.jsでのサーバサイド開発が
もっともっと普及してほしい！

https://twitter.com/teppeis/status/545940492219727873
http://mizchi.hatenablog.com/entry/2014/10/08/003228

いかにNodeがWebアプリ開発に向いているか熱弁したい！
他を知らない
「よくない」「辛い」と感じるところを考察することはできるのでは？

今回はゲーム(特にソーシャルゲーム)のAPIサーバ開発に限って論じる
サーバ側開発一般に通じる話もあるはず
ES5まで

「バッドノウハウ」とは？
http://0xcc.net/misc/bad-knowhow.html
(引用)

ここでは
- TODO, 定義する

本題の前に
ゲームサーバ開発の特徴を挙げる

---
# ゲームサーバの特徴
- 定型的なAPIが少ない
  - 単なるCRUDがほぼない
  - RESTfulとか無理
- ユーザに強く結びついている
  - 「誰に対しても同じデータを返す」ようなAPIがめったにない
- マスターデータの存在

---
# マスターデータとは
ゲームそのものに関してのデータ
- 運営側が用意するもの
- クエスト、イベント、敵、マップ、などなど

---
# マスターデータにまつわる話
- 入力支援 (管理画面、スプレッドシート等)
- 管理 (バックアップ、タグ付けなど)
- 利用 (持ち方など)
- 検証 validation

ゲームの障害のうちの約8割(推定)はマスターデータが原因

---
# マスターデータにまつわる話

ゲーム開発はマスターデータ無しには語れない

参考: Final Fantasy Record Keeperのマスターデータを支える技術 (DeNA 渋川さん)
http://www.slideshare.net/dena_study/final-fantasy-record-keeper

入力支援の話は上の記事で語り尽くされている

ここでは利用の話を少ししたい

---
# マスターデータの利用
Nodeアプリ起動時にDBから読み込み、整形してプロセス上のオブジェクトとして乗せる
通常の量なら十分乗る
IDをキーにする

ex) Quest マスタ
```javascript
{ 'quest01': { quest_id: 'quest01', map_id: 'map01', tasks: [ ... ] },
  'quest02': { quest_id: 'quest02', map_id: 'map05', tasks: [ ... ] } }
```

---

# 有利な点
- データストアとして最速
- 非同期呼び出しにならない
- (起動時に)好きなように変形して持てる(冗長でもOK、リレーションも実体を直接参照)

---

# 注意点と対策
注意点:
- 誤って書き換えてしまう可能性がある
  - ただのJavaScript上のオブジェクトなので。。
  - やらかして障害にした経験あり

対策:
- 起動時にObject.freezeを再帰的に行う
  - use strictしておけば、変更しようとした瞬間にTypeError

---

ここまでグッドノウハウ

ここからバッドノウハウ

---

async.angelFall

---

# async.angelFall
Bad度★☆☆☆☆
Node度★★★★★
ゲーム度★★☆☆☆
かたさ: ふつう

---

# 概要

非同期フロー制御に関する戦い

---

# Node.jsの規約

callbackスタイル
- 関数の最後にcallback
- callbackの第1引数はError Object(エラーでなければnull or undefined)

---
# 同期コード例

---
# 非同期コード(plain)例
callback sucks

---
# 問題点
- if (err) 句が無駄に多い
- ネストが深くなる
- 並列に走らせ、全て終わったら次に行く、のようなコードが書きにくい

---
# 非同期フロー制御

非同期フローを制御するモジュールが、問題を解決する

弊社では async (by caolan) を利用してきた

---
# asyncについて

直列な非同期コードを書き換える方法がいくつか存在する

- async.waterfall
- async.series
- async.auto

弊社ではasync.seriesが主流だった

---
# async.series コード例

---
# 問題点
`if (err)` 多すぎ

async.waterfallにしてみた

---
# async.waterfall コード例

`if (err)` がなくなり、コードが短くなった

---
# async.waterfallの問題点

- next に渡される引数の個数に応じて、次の関数に入る引数の個数が変わる
- コールバックする引数の個数を増やすことがbreaking changeに繋がる

bad!!

---
# neo-async

- asyncのクローン
- 機能を増やし、速度を向上させている
- 弊社エンジニア @suguru03 がフルスクラッチで作成

---
# neo-async.angelFall

- async.waterfallと基本的には同じ
- next に渡される引数の個数が変わっても、次の関数に入る引数の個数が変わらない

---
# 技術的背景
- 次の関数が受ける、引数の個数を見ている
  - Function.length 定義された仮引数の個数が取れる

やや黒魔術

---
# async.waterfall / neo-async.angelFall の問題点

- 関数の区切りが意味の区切りにならないことがある
  - フローにif文が入ると辛い

---
# 同期コード例

---
# 非同期コード(plain)例

---
# async.waterfall / neo-async.angelFall の例

たまにGOTOみたいの欲しくなる

BAD!!

---
# 結論
我々は非同期フロー制御で疲弊している

こんなふうに書きたい: asyncblock (by scriby)

---
# asyncblock
コード例sync, defer

---
# asyncblock の技術

- node-fibers
- source transformation

非常に黒魔術

---
# 非同期フロー制御のこれから


- ES2015  generators
- ES2016? async/await

今年いっぱいでケリをつけたい

Async Advent Calendarやります

---
グローバル変数の上書き

---
# グローバル変数 Date の上書き

|a|b|
|--------|------|
|Bad度   |★★☆☆☆ |
|Node度  |★★★☆☆ |
|ゲーム度|★★★☆☆ |
|かたさ  |やわめ|

---
# 概要
Date を上書きする

- Date =
- (global.Date =)

---
# 背景
時限式でリリースさせる機能・データに関しての動作確認を行いたい
- イベント
- 曜日限定クエスト
- 誕生日キャンペーン

マスターデータで時間/日付/曜日などを指定してる

---
# 既存の手法
例えば、36時間後の状態にしたい時

1. サーバマシンの時刻を36時間すすめる
2. マスターデータを36時間巻き戻す

---
# 既存の手法の問題点
1. サーバマシンの時刻を36時間すすめる
  - 影響が未知数
2. マスターデータを36時間巻き戻す
  - 確認にリアルさがない(ex. 表示される日付がずれる)
  - 「曜日」「日付」に関する項目は確認できない

---
# そこで
JavaScriptの Date を変更する

変更内容:
- new Date() (引数なし)
- Date.now()

それ以外は、そのまま

---

# 上書きの理由

prototype拡張ではなく、上書きじゃないとダメ

- new Date() の対応が必要
- prototype拡張では、関数自体は変更できない

---

# time-master

作った Github: qsona/time-master

- TimeMaster.WrappedDate
  - 時刻をずらしたDate
- TimeMaster.forward() で時刻をずらす
- TimeMaster.overwrite() で上書き

---

# 問題点
- ログの時間がずれる

対策
- ログ吐く関数を以下のように書き換える
  - ログ吐く瞬間だけ、時間戻す
  - ログ吐いたら、また時間をずらす

---
# Why BAD?
- 行儀の悪い行為には危険がある
  - prototype拡張とぶつかった話

(image)

---
# How BAD?

- ステージング環境までなので、バッドくらい
- 本番だったら超very badノウハウ

---
# 少し技術的な話
Dateの挙動
new Date() => オブジェクトが返る
Date() => 文字列が返る
そんな挙動を作ることは可能なのか？

---
# 少し技術的な話
A.可能

new 演算子の挙動
new X(); すると
- returnされたものがtypeof 'object'のとき、それをそのまま返す
- そうでないとき、X.prototypeをプロトタイプにもつオブジェクトを返す

```javascript
function X() { this.x = 1; return 'string'; }
X(); // => 'string'
new X(); // => { x: 1 }
```

time-masterのWrapperDateはこの挙動だけ真似できていない

---
Fat Service, Skinny Model

---
Fat Service, Skinny Model
Bad度★★★☆☆
Node度★★★★★
ゲーム度★★★☆☆
かたさ: かため

---
# 概要
オブジェクト指向とは
データ + 振る舞い

Fat Model, Skinny Controllerとは

---
process.on('uncaughtException')

---
# process.on('uncaughtException')
...そして何もなかったように続行
Bad度★★★★★
Node度★★★★★
ゲーム度★★☆☆☆
かたさ: ふつう

超ベリーバッドノウハウ

---
# 背景
Node.jsにおいて例外がthrowされた場合、プロセスが終了する
- サーバ自体が終了する
- cluster利用時は、発生したworkerが終了
普通は、終了を検知して再起動する(pm2など)

---
# 問題 (1)

再起動に時間がかかる

特にマスターデータの影響
- DBから読み込んでプロセスにのせる
- 使いやすい形に変形
- Object.freezeをdeepに行う

---
(image)

---
# 問題 (2)

1. あるユーザのデータが壊れる + バグによりTypeError発生
2. そのユーザがリクエストする度に発生する
3. 1秒に1回再起動=>到底間に合わない
4. 全ユーザが利用不能に

---
# そこで

エラーが起きても、プロセスを終了しないようにしたい

---
# やり方
uncaughtExceptionをハンドルする

起動時に呼ばれるコードで
```javascript
process.on('uncaughtException', function(err) {
  console.log(err);
  // 障害端末を鳴らすコード
  // 終了はしない
});
```
---
# やり方 2
domainを利用する

例えばExpressのミドルウェアに次のものを入れる
```javascript
var domain = require('domain');
// middleware
function(req, res, next) {
  var d = domain.create();
  d.on('error', function(err) {
    // 障害端末を鳴らすコード
    next(err);
  });
  d.run(next);
}
```

--- 比較
- domain を使うとリクエストの情報が落ちないで済む
  - ちゃんとレスポンスを返せる
  - ユーザ情報をログに出せる

--- Why BAD?
何由来か全く不明なエラーを、握りつぶしている

---
https://nodejs.org/api/process.html#process_event_uncaughtexception
https://nodejs.org/api/domain.html#domain_warning_don_t_ignore_errors
https://www.joyent.com/developers/node/design/errors

---
# だめ
だめといわれても

---
# キャッチしないと起こる現象
- TypeError を出すと即障害になる
- TypeError を出さないことが正義
- a && a.b && a.b.c のような書き方が流行る(不必要であっても)
  - 「ナチュラルな握りつぶし」

---
# 余談: neo-async 誕生秘話
http://suguru03.github.io/slide/20151008_neo-async/#23
https://twitter.com/axross_/status/653732904137134080

---
# 余談: neo-async 誕生秘話
1. async.eachの第一引数にundefinedが渡ってTypeError出た
2. 連続再起動、しばらくユーザがアクセスできない障害に
3. neo-asyncの誕生!!

---
# 閑話休題
「あるべき論」をもう少し深くやる必要がある

- そもそもcallback(err)とthrow err使い分けられんのか
- 非同期関数中でcallback(err)出来なくて困る
- 同期関数はcallbackで通知できない
- try-catch強力過ぎる問題

---
# そもそもcallback(err)とthrow err使い分けられんのか問題
express try-catchしてる

---
# 非同期関数中でcallback(err)出来なくて困る問題

---
# try-catch強力過ぎる問題
- ReferenceErrorとか

例外 Advent Calendarに期待してる

---
# まとめ
結論、問題になるのは
- 非同期フロー制御
- エラー処理
古くて新しい話題
ES2015, 2016やそれを含むNodeの新バージョンで解決されていくことが望まれる
