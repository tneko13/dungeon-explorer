import type { ExpeditionResult } from '../types'

interface Props {
  result: ExpeditionResult
  onClose: () => void
}

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  complete:  { text: '踏破成功！',     cls: 'result-complete'  },
  retreated: { text: '撤退帰還',       cls: 'result-retreated' },
  failed:    { text: 'パーティ全滅...',  cls: 'result-failed'   },
  timeout:   { text: '制限時間超過',   cls: 'result-timeout'  },
}

export function ExpeditionResultModal({ result, onClose }: Props) {
  const st = STATUS_LABEL[result.status] ?? { text: result.status, cls: '' }

  return (
    <div className="result-overlay" onClick={onClose}>
      <div className="result-dialog" onClick={(e) => e.stopPropagation()}>
        <div className={`result-status ${st.cls}`}>{st.text}</div>
        <div className="result-dungeon">{result.dungeonName}</div>

        {/* 報酬 */}
        <div className="result-section">
          <div className="result-section-title">報酬</div>
          {result.goldGained > 0 && (
            <div className="result-row"><span className="result-key">Zel</span><span className="result-val gold">+{result.goldGained.toLocaleString()}</span></div>
          )}
          {result.goldPenalty > 0 && (
            <div className="result-row"><span className="result-key">ペナルティ</span><span className="result-val penalty">−{result.goldPenalty.toLocaleString()} Zel（所持金半減）</span></div>
          )}
          {result.goldGained === 0 && result.goldPenalty === 0 && (
            <div className="result-empty">報酬なし</div>
          )}
          {result.droppedItems.map((item) => (
            <div key={item.id} className="result-row">
              <span className="result-key">装備品</span>
              <span className="result-val item">{item.name}</span>
            </div>
          ))}
        </div>

        {/* パーティ結果 */}
        <div className="result-section">
          <div className="result-section-title">パーティ</div>
          {result.memberResults.map((m) => (
            <div key={m.name} className="result-member-row">
              <span className="result-member-name">{m.name}</span>
              {m.expGained > 0 && (
                <span className="result-member-exp">EXP +{m.expGained}</span>
              )}
              {m.levelAfter > m.levelBefore ? (
                <span className="result-levelup">Lv{m.levelBefore} → Lv{m.levelAfter} ↑</span>
              ) : (
                <span className="result-level">Lv{m.levelAfter}</span>
              )}
            </div>
          ))}
        </div>

        <button className="result-close-btn" onClick={onClose}>閉じる</button>
      </div>
    </div>
  )
}
