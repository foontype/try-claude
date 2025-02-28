# Babylon.js AnimationGroup

## はじめに

AnimationGroupはBabylon.jsの強力な機能で、複数のアニメーションを単一のユニットとして整理、同期、および制御することができます。異なるシーンオブジェクトを含む複雑なアニメーションシーケンスを管理するための効率的な方法を提供します。

## 基本概念

AnimationGroupは、一緒に実行すべき複数のアニメーションのコンテナとして機能します。以下の統一的な制御を提供します：
- アニメーションの開始と停止
- 再生速度の制御
- アニメーションのブレンディング
- 時間の同期

## 基本的な使い方

### AnimationGroupの作成

```javascript
// 新しいアニメーショングループを作成
const animationGroup = new BABYLON.AnimationGroup("walkCycle");

// グループにアニメーションを追加
animationGroup.addTargetedAnimation(leftLegAnimation, leftLeg);
animationGroup.addTargetedAnimation(rightLegAnimation, rightLeg);
animationGroup.addTargetedAnimation(torsoAnimation, torso);
```

### アニメーション再生の制御

```javascript
// アニメーションの再生開始
animationGroup.play(true); // ブールパラメータはループを示します

// アニメーションの一時停止
animationGroup.pause();

// アニメーションの再開
animationGroup.play();

// アニメーションの停止
animationGroup.stop();

// アニメーションを初期状態にリセット
animationGroup.reset();

// 特定のフレームに移動
animationGroup.goToFrame(30);
```

## 主要なプロパティ

- `name`: アニメーショングループの一意の識別子
- `targetedAnimations`: グループ内のすべてのアニメーションを含む配列
- `from`と`to`: アニメーションシーケンスの開始フレームと終了フレームを定義
- `isPlaying`: アニメーショングループが現在再生中かどうかを示すブール値
- `speedRatio`: 再生速度を制御（1.0が通常速度）
- `weight`: 他のアニメーションとブレンドする際の影響度を制御（0.0から1.0）

## 高度な機能

### アニメーションのブレンディング

アニメーションブレンディングにより、異なるアニメーション状態間の滑らかな遷移が可能になります：

```javascript
// 歩行アニメーションから走行アニメーションへのブレンド
walkAnimationGroup.stop();
runAnimationGroup.play(true);
runAnimationGroup.setWeightForAllAnimations(0);

// 走行アニメーションの重みを徐々に増加
engine.runRenderLoop(() => {
    if (runAnimationGroup.weight < 1.0) {
        runAnimationGroup.setWeightForAllAnimations(runAnimationGroup.weight + 0.01);
    }
});
```

### 時間制御

アニメーションタイミングの細かい制御：

```javascript
// 再生速度の変更
animationGroup.speedRatio = 2.0; // 倍速

// 特定のフレームから開始
animationGroup.play(true);
animationGroup.goToFrame(10);

// アニメーションの一部分のみを再生
animationGroup.play(true);
animationGroup.from = 10;
animationGroup.to = 50;
```

### イベント

AnimationGroupはアニメーション制御のための複数のイベントを提供します：

```javascript
// アニメーション開始時に呼び出される
animationGroup.onAnimationGroupPlayObservable.add(() => {
    console.log("アニメーションが開始しました");
});

// アニメーション終了時に呼び出される
animationGroup.onAnimationGroupEndObservable.add(() => {
    console.log("アニメーションが終了しました");
});

// アニメーションループごとに呼び出される
animationGroup.onAnimationGroupLoopObservable.add(() => {
    console.log("アニメーションがループしました");
});
```

## アセットロードとの統合

アニメーション付きモデルをロードする際にAnimationGroupsは自動的に作成されます：

```javascript
BABYLON.SceneLoader.ImportMesh("", "models/", "character.glb", scene, (meshes, particleSystems, skeletons, animationGroups) => {
    // アニメーショングループにアクセス
    const walkAnimation = animationGroups[0];
    const runAnimation = animationGroups[1];
    
    // 歩行アニメーションを再生
    walkAnimation.play(true);
});
```

## パフォーマンスに関する考慮事項

- 関連するアニメーションを整理するためにAnimationGroupsを使用する
- 必要のないアニメーションを有効/無効にする
- パフォーマンスが重要なアプリケーションでは`deterministic`プロパティを調整する
- 複数の重複するアニメーションよりもアニメーションの重みを使用したブレンディングを検討する

## 一般的なユースケース

1. **キャラクターアニメーション**: キャラクターのスケルタルアニメーションのグループ化
2. **UI遷移**: 複数のUI要素アニメーションの調整
3. **環境エフェクト**: 環境オブジェクトのアニメーションの同期
4. **ゲーム状態遷移**: ゲーム状態変更のアニメーション管理
5. **複雑なオブジェクトアニメーション**: 複数の可動部品を持つオブジェクトのアニメーション調整

## 他のアニメーション方法との比較

AnimationGroupは個々のアニメーションを管理する場合に比べていくつかの利点を提供します：
- 複数のアニメーションの簡略化された制御
- 同期されたタイミング
- 統一された再生コントロール
- バッチ更新による優れたパフォーマンス
- 簡略化されたイベント処理

## まとめ

Babylon.jsのAnimationGroupsは、3Dアプリケーションでの複雑なアニメーションを管理するための堅牢なシステムを提供します。関連するアニメーションをグループ化することで、開発者は簡略化された制御ロジックで洗練されたアニメーションシーケンスを作成でき、よりメンテナンス性が高く効率的なコードになります。