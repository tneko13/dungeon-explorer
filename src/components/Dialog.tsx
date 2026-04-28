import React from 'react'

interface DialogProps {
  /** falsy のとき非表示 */
  open: boolean
  /** オーバーレイクリックで閉じる（省略時 true） */
  onClose?: () => void
  /** 追加クラス名（ダイアログ本体に適用） */
  className?: string
  children: React.ReactNode
}

/**
 * 共通ダイアログ。
 * オーバーレイ（暗転背景）＋ダイアログ本体をまとめたラッパー。
 */
export function Dialog({ open, onClose, className = '', children }: DialogProps) {
  if (!open) return null
  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div
        className={`confirm-dialog ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
