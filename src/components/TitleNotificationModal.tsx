import { TITLES } from '../game/titles/TitleData'
import { useGameStore } from '../store/gameStore'

export function TitleNotificationModal() {
  const { newlyUnlockedTitles, dismissTitleNotification } = useGameStore()
  if (!newlyUnlockedTitles || newlyUnlockedTitles.length === 0) return null

  const titleDefs = newlyUnlockedTitles
    .map((id) => TITLES.find((t) => t.id === id))
    .filter(Boolean) as (typeof TITLES)[number][]

  return (
    <div className="title-notif-overlay" onClick={dismissTitleNotification}>
      <div className="title-notif-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="title-notif-header">称号獲得！</div>
        <div className="title-notif-list">
          {titleDefs.map((t) => (
            <div key={t.id} className="title-notif-item">
              <div className="title-notif-name">「{t.name}」</div>
              <div className="title-notif-desc">{t.description}</div>
            </div>
          ))}
        </div>
        <button className="title-notif-close" onClick={dismissTitleNotification}>
          閉じる
        </button>
      </div>
    </div>
  )
}
