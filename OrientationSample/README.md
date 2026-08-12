# iOS Orientation Sample

このフォルダは iPhone (UIKit) 向けの最小サンプルです。ボタンで画面向きを操作します。

含まれるファイル:
- AppDelegate.swift
- SceneDelegate.swift
- ViewController.swift
- Info.plist

使い方:
1. Xcode で新しい Single View App (UIKit, Swift) を作成します。
2. プロジェクトの既存ファイルと置き換えるか、このフォルダのファイルをプロジェクトに追加してください。
3. Info.plist の "Supported interface orientations (iPhone)" に必要な向きが含まれていることを確認してください（上向き/下向き/左右）。
4. 実機またはシミュレータでビルドして実行します。

注意:
- UIDevice.current.setValue(...) による強制回転は多くのアプリで使われていますが、ガイドラインや将来の互換性の問題に注意してください。
- portrait-upside-down がデバイスや設定で無効な場合、期待通りに回転しないことがあります。
