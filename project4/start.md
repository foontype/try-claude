# Babylon.js AnimationGroup.start の仕様

## 概要

`AnimationGroup.start()` メソッドは、AnimationGroupに含まれるすべてのアニメーションを開始させるためのメソッドです。このメソッドは、アニメーションの再生を制御するためのいくつかのオプションを提供します。

## メソッドシグネチャ

```typescript
start(loop?: boolean, speedRatio?: number, from?: number, to?: number, isAdditive?: boolean): AnimationGroup
```

## パラメータ

| パラメータ | 型 | 必須 | デフォルト値 | 説明 |
|------------|------|----------|--------------|-------------|
| loop | boolean | いいえ | false | アニメーションをループ再生するかどうか |
| speedRatio | number | いいえ | 1.0 | 再生速度の比率（1.0が通常速度） |
| from | number | いいえ | グループの開始フレーム | アニメーションを開始するフレーム |
| to | number | いいえ | グループの終了フレーム | アニメーションを終了するフレーム |
| isAdditive | boolean | いいえ | false | アニメーションを加算モードで適用するかどうか |

## 戻り値

- `AnimationGroup`: メソッドチェーンを可能にするために、AnimationGroupインスタンス自身を返します。

## 動作詳細

1. **ループ再生**: `loop` パラメータをtrueに設定すると、指定された範囲（`from`から`to`まで）のアニメーションが繰り返し再生されます。

2. **再生速度**: `speedRatio` パラメータで再生速度を制御できます。
   - 1.0: 通常速度
   - 2.0: 2倍速
   - 0.5: 半分の速度
   - 負の値: 逆再生（例: -1.0で逆方向に通常速度）

3. **再生範囲**: `from`と`to`パラメータを使用して、アニメーションの特定の部分のみを再生できます。
   - 指定しない場合は、アニメーショングループに設定されている`from`と`to`の値が使用されます。
   - これらのパラメータを使用すると、アニメーショングループの元の範囲設定は上書きされます。

4. **加算モード**: `isAdditive`がtrueの場合、アニメーションの値は現在のオブジェクトの状態に加算されます。これは複数のアニメーションを組み合わせる場合に有用です。

## 使用例

### 基本的な使用方法

```javascript
// アニメーショングループの作成と設定
const animationGroup = new BABYLON.AnimationGroup("walkCycle");
animationGroup.addTargetedAnimation(walkAnimation, character);

// 通常の再生開始
animationGroup.start();
```

### ループ再生と速度調整

```javascript
// ループ再生で2倍速
animationGroup.start(true, 2.0);
```

### 特定の範囲の再生

```javascript
// フレーム10から50までの範囲をループ再生
animationGroup.start(true, 1.0, 10, 50);
```

### 加算モードでの再生

```javascript
// 加算モードでアニメーションを適用
animationGroup.start(false, 1.0, 0, 100, true);
```

## 注意点

1. **既存のアニメーション**: アニメーショングループが既に再生中の場合、`start()`を呼び出すと再生がリセットされ、指定されたパラメータで再開始されます。

2. **イベント**: `start()`メソッドを呼び出すと、`onAnimationGroupPlayObservable`イベントが発火します。

3. **重み付け**: アニメーション再生時の重み（weight）は`start()`メソッドでは直接制御できません。重み付けを変更するには、別途`setWeightForAllAnimations()`メソッドを使用する必要があります。

4. **非同期動作**: `start()`メソッドは即座に戻り値を返しますが、アニメーションは非同期で実行されます。

## 関連メソッド

- `play()`: `start()`と機能的に同じですが、名前が異なります。どちらを使用しても同じ結果になります。
- `pause()`: アニメーションを一時停止します。
- `reset()`: アニメーションを初期状態にリセットします。
- `restart()`: アニメーションを停止して初期状態から再開します。
- `stop()`: アニメーションを完全に停止します。

## 互換性

このメソッドはBabylon.js のすべてのバージョンで利用可能です。ただし、一部のパラメータ（特に`isAdditive`）は新しいバージョンで追加された可能性があります。