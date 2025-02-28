# 要求仕様

## 実装方法
* project5 ディレクトリ以下に実装してください

## 修正1
* babylon.js の内臓衝突判定を有効にします
  * シーン全体で衝突判定を有効にするために、scene.collisionsEnabled を true に設定します。
    * scene.collisionsEnabled = true;
  * 衝突判定をしたい各メッシュに対して、mesh.checkCollisions を true に設定します。
  * オブジェクトの移動、今の場合はプレイヤーの移動には camera.moveWithCollisions(new BABYLON.Vector3(x, y, z))）を使用します。

## 参考リンク
* babylon.js 最新APIリファレンス
  *  https://doc.babylonjs.com/typedoc/modules/BABYLON
