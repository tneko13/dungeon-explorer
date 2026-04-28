/**
 * TimeEngine
 * ブラウザを閉じている間の経過時間を計算して
 * ゲーム状態に反映するオフライン進行エンジン
 */

export class TimeEngine {
  /**
   * 前回の保存時刻から現在までの経過ミリ秒を返す
   */
  static getElapsedMs(lastSavedAt: number): number {
    return Date.now() - lastSavedAt
  }

  /**
   * オフライン経過時間を上限付きで返す（最大24時間）
   */
  static getOfflineElapsedMs(lastSavedAt: number, maxMs = 24 * 60 * 60 * 1000): number {
    return Math.min(this.getElapsedMs(lastSavedAt), maxMs)
  }
}
