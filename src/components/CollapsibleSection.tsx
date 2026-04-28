import { useState } from 'react'

/**
 * 図鑑デザインの折り畳みセクション（共通コンポーネント）
 * enc-dungeon-header スタイルを使用。
 * 図鑑のダンジョングループ・オプションのセクションで共用。
 */
export function CollapsibleSection({
  title,
  count,
  countComplete = false,
  defaultCollapsed = false,
  children,
}: {
  title: string
  count?: string        // e.g. "3 / 10" — 省略すると非表示
  countComplete?: boolean
  defaultCollapsed?: boolean
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  return (
    <div className="enc-dungeon-group unlocked">
      <button className="enc-dungeon-header" onClick={() => setCollapsed((v) => !v)}>
        <span className="enc-dungeon-name">{title}</span>
        <div className="enc-dungeon-header-right">
          {count != null && (
            <span className={`enc-count ${countComplete ? 'complete' : ''}`}>{count}</span>
          )}
          <span className="enc-collapse-icon">{collapsed ? '▶' : '▼'}</span>
        </div>
      </button>
      {!collapsed && children}
    </div>
  )
}
