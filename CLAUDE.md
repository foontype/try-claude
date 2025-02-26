# コードベース分析

## プロジェクト概要

このプロジェクトは、Docker コンテナを使用した開発環境を提供し、構造化された方法でタスクとターゲットを実行するためのツールを含んでいます。プロジェクト名は "try-claude" で、VS Code の devcontainer 機能を活用して一貫した開発環境を提供しています。

## プロジェクト構造

```
/
├── .devcontainer/          # VS Code の devcontainer 設定
├── .gitignore
├── .gitmodules
└── run/                    # 実行スクリプトとコンテナ設定
    ├── target.sh           # メインのターゲット実行スクリプト
    ├── containers/         # コンテナ関連ファイル
    │   └── workspace/      # ワークスペースコンテナの設定
    ├── devcontainer/       # devcontainer の Docker Compose 設定
    ├── on-workspace/       # ワークスペース上で実行するスクリプト
    ├── shell-tester/       # シェルスクリプトのテスト
    └── supports/           # サポートツール
        ├── bask/           # Bash タスクランナー
        └── btarget/        # ターゲット選択・実行ツール
```

## 開発環境

### devcontainer 設定

プロジェクトは VS Code の devcontainer 機能を使用して、Docker コンテナ内で一貫した開発環境を提供しています。

`.devcontainer/devcontainer.json` の主な設定:
- Docker Compose ファイル: `../run/devcontainer/docker-compose.yaml`
- サービス名: `workspace`
- ワークスペースフォルダ: `/workspace`
- コンテナ作成後のコマンド: `bash /init-container.sh`
- VS Code の設定とインストールする拡張機能

### Docker コンテナ

ワークスペースコンテナは Ubuntu ベースで、以下のツールがインストールされています:
- sudo
- git
- curl
- jq

コンテナは非ルートユーザーで実行され、UID と GID は環境変数から設定されます。

### 初期化スクリプト

コンテナ起動時に `/init-container.sh` が実行され、`/init-resources/` ディレクトリ内のすべてのスクリプトを順番に実行します:

1. `100-setup-local-terminal.sh`: ローカルターミナルの設定
2. `101-setup-workspace.sh`: ワークスペースのセットアップ (`run/target.sh setup` を実行)

## btarget ツール

btarget は、構造化された方法でターゲット（スクリプト）を選択して実行するための Bash ツールです。

### 主な機能

- サブディレクトリ内のターゲットを検索
- 入力または環境変数に基づいてターゲットを選択
- ターゲット名の省略形をサポート（ダッシュ区切りの各部分の先頭文字）
- 環境固有のターゲットをサポート
- カラー出力とヘルプメッセージを備えた CLI

### 動作の仕組み

1. `run/target.sh` が `btarget.sh` をソースとして読み込む
2. btarget は指定されたディレクトリ内のターゲットを検索
3. ターゲットは `run.sh`、`task.sh`、`workflow.sh` などのファイルを含むディレクトリ
4. 入力または環境変数に基づいてターゲットを選択
5. 選択されたターゲットディレクトリに移動し、対応するシェルスクリプトを実行

### 使用例

```bash
# 基本的な使用法
./run/target.sh <target-name>

# 省略形を使用
./run/target.sh t-n  # target-name に一致
```

## bask ツール

bask は Bash 用のタスクランナーで、Make に似ていますが純粋な Bash 構文を使用します。

### 主な機能

- Baskfile でタスクを定義
- タスク間の依存関係をサポート
- タスクの並列実行
- カラー出力とロギング機能
- タスク一覧の表示

### 動作の仕組み

1. Baskfile でタスクを定義（`task_` プレフィックスを持つ関数）
2. `bask` コマンドまたは Baskfile 自体を実行してタスクを実行
3. タスクは依存関係に従って順番に実行される

### 使用例

```bash
# Baskfile の例
task_hello() {
  echo "Hello, World!"
}

task_build() {
  bask_depends hello
  echo "Building..."
}

# 実行方法
bask build
```

## btarget と bask の連携

btarget と bask は連携して、構造化されたタスク実行システムを提供します:

1. btarget がターゲットを選択
2. 選択されたターゲットが bask を使用してタスクを定義・実行
3. これにより、スクリプトを整理して実行するための柔軟で構造化された方法を提供

### 実際の流れ

1. `run/target.sh <target>` を実行
2. btarget が `<target>` ディレクトリを見つけて移動
3. そのディレクトリ内の `run.sh`（または他のシェルスクリプト）を実行
4. `run.sh` が bask を使用してタスクを定義・実行

## まとめ

このプロジェクトは、Docker コンテナと VS Code の devcontainer 機能を使用して一貫した開発環境を提供し、btarget と bask というツールを組み合わせて構造化されたタスク実行システムを実現しています。これにより、複雑なプロジェクトでも整理された方法でタスクを定義・実行できます。
