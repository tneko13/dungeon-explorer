import { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react'
import './App.css'
import { useGameStore } from './store/gameStore'
import { DUNGEONS, DUNGEON_MAP } from './game/dungeon/DungeonData'
import { ENEMY_POOL, BOSS_DATA } from './game/dungeon/EnemyData'
import { getDungeonDropList, getItemDisplayName } from './game/equipment/EquipmentData'
import { EquipmentIcon } from './components/EquipmentIcon'
import { PartyPanel } from './components/PartyPanel'
import { DungeonPanel } from './components/DungeonPanel'
import { ExpeditionStatus } from './components/ExpeditionStatus'
import { ExpeditionResultModal } from './components/ExpeditionResultModal'
import { TitleNotificationModal } from './components/TitleNotificationModal'
import { BaseScreen } from './components/BaseScreen'
import { Dialog } from './components/Dialog'
import { TitleScreen } from './components/TitleScreen'
import { StoryScene } from './components/StoryScene'
import { STORY_CHAPTERS } from './game/story/StoryData'
import {
  imgDungeonBg, imgCharacterPortrait,
  imgEnemyPortrait, imgEnemyIcon, imgLogo, preloadImages,
} from './utils/imagePaths'
import type { AppScreen } from './types'

type BaseTab = 'formation' | 'myparty' | 'encyclopedia' | 'forge' | 'titles' | 'options'
const BASE_TABS: [BaseTab, string][] = [
  ['formation', '編成'], ['forge', '鍛冶'], ['myparty', 'マイパーティ'],
  ['encyclopedia', '図鑑'], ['titles', '称号'], ['options', 'オプション'],
]

// 開発環境のみバンドルに含まれる。本番ビルドでは lazy() ごと tree-shake される。
const DebugPanel = import.meta.env.DEV
  ? lazy(() => import('./components/DebugPanel').then((m) => ({ default: m.DebugPanel })))
  : null

type ConfirmState =
  | { type: 'start'; dungeonId: string }
  | { type: 'drop-list'; dungeonId: string }
  | { type: 'retreat' }

const SOURCE_LABEL = { enemy: '敵', chest: '宝箱' } as const

/** ダンジョン入場時にプリロードする画像URLを収集する */
function getDungeonPreloadUrls(
  dungeonId: string,
  floors: number,
  enemyIds: string[],
  classNames: string[],
): string[] {
  const urls: string[] = []
  const bgCount = Math.min(floors, 10)
  for (let f = 1; f <= bgCount; f++) urls.push(imgDungeonBg(dungeonId, f, false))
  urls.push(imgDungeonBg(dungeonId, 1, true))
  enemyIds.forEach((id) => { urls.push(imgEnemyPortrait(id)); urls.push(imgEnemyIcon(id)) })
  classNames.forEach((cls) => { urls.push(imgCharacterPortrait(cls)) })
  return urls
}

export default function App() {
  const store = useGameStore()
  const { resources, party, unlockedDungeons, expedition, expeditionResult, discoveredEquipmentIds, pendingStoryId, notifEnabled } = store
  const [baseTab, setBaseTab] = useState<BaseTab>('formation')

  // DEV環境ではタイトルをスキップ（DebugPanelと同じ仕組み）
  const [screen, setScreen] = useState<AppScreen>(import.meta.env.DEV ? 'game' : 'title')
  // ストーリー再生リクエスト: { chapterId, afterStory }
  const [storyRequest, setStoryRequest] = useState<{ chapterId: string; afterScreen: AppScreen } | null>(null)

  // 画面遷移フェード
  const [transitioning, setTransitioning] = useState(false)
  const transTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /** ローディングオーバーレイを出しながら非同期処理を実行する */
  const withLoading = useCallback(async (fn: () => Promise<void> | void) => {
    if (transTimerRef.current) clearTimeout(transTimerRef.current)
    setTransitioning(true)
    await new Promise<void>(r => { transTimerRef.current = setTimeout(r, 280) })
    await fn()
    requestAnimationFrame(() => requestAnimationFrame(() => setTransitioning(false)))
  }, [])

  const changeScreen = useCallback((next: AppScreen, setup?: () => void) => {
    withLoading(async () => { setup?.(); setScreen(next) })
  }, [withLoading])

  const [confirm, setConfirm] = useState<ConfirmState | null>(null)

  const tickRef = useRef(store.tick)
  const confirmRef = useRef(confirm)
  useEffect(() => { tickRef.current = store.tick }, [store.tick])
  useEffect(() => { confirmRef.current = confirm }, [confirm])
  useEffect(() => {
    const id = setInterval(() => { if (!confirmRef.current) tickRef.current() }, 1000)
    return () => clearInterval(id)
  }, [])

  const activeDungeon = expedition ? DUNGEON_MAP.get(expedition.dungeonId) ?? null : null
  const unlockedList = DUNGEONS.filter((d) => unlockedDungeons.includes(d.id))

  // ダンジョンクリア後のストーリー自動再生
  // （ページリロード後など expeditionResult がない状態で pendingStoryId が残っている場合のみ発火）
  useEffect(() => {
    if (pendingStoryId && screen === 'game' && !expeditionResult) {
      const id = pendingStoryId
      store.setPendingStory(null)
      changeScreen('story', () => setStoryRequest({ chapterId: id, afterScreen: 'game' }))
    }
  }, [pendingStoryId, screen, expeditionResult, changeScreen])

  const handleStoryComplete = () => {
    if (!storyRequest) return
    const req = storyRequest
    store.markStoryViewed(req.chapterId)
    changeScreen(req.afterScreen, () => setStoryRequest(null))
  }

  const handleGoTitle = () => {
    store.goToTitle()
    changeScreen('title')
  }

  const handleShowStory = (chapterId: string) => {
    changeScreen('story', () => setStoryRequest({ chapterId, afterScreen: 'game' }))
  }

  const handleShowPrologue = () => {
    changeScreen('story', () => setStoryRequest({ chapterId: 'prologue', afterScreen: 'game' }))
  }

  const prevExpStatusRef = useRef<string | null>(null)
  useEffect(() => {
    const status = expedition?.status ?? null
    const prev = prevExpStatusRef.current
    if (
      status !== prev &&
      (status === 'complete' || status === 'failed') &&
      notifEnabled &&
      'Notification' in window &&
      Notification.permission === 'granted' &&
      document.visibilityState === 'hidden'
    ) {
      const name = activeDungeon?.name ?? 'ダンジョン'
      const body = status === 'complete'
        ? `「${name}」を踏破した！帰還して報酬を受け取ろう`
        : `「${name}」でパーティが全滅…帰還して報酬を受け取ろう`
      new Notification('DUNGEON EXPLORER', { body })
    }
    prevExpStatusRef.current = status
  }, [expedition?.status])

  const handleConfirmStart = () => {
    if (confirm?.type !== 'start') return
    const dungeonId = confirm.dungeonId
    const dungeon = DUNGEON_MAP.get(dungeonId)
    setConfirm(null)
    const enemyIds = [
      ...(ENEMY_POOL[dungeonId] ?? []).map((e) => e.id),
      ...(BOSS_DATA[dungeonId] ? [BOSS_DATA[dungeonId].id] : []),
    ]
    const classNames = party.members.map((c) => c.class)
    withLoading(async () => {
      if (dungeon) await preloadImages(getDungeonPreloadUrls(dungeonId, dungeon.floors, enemyIds, classNames))
      store.startExpedition(dungeonId)
    })
  }

  const handleCloseResult = () => {
    const pendingId = pendingStoryId
    store.clearResult()
    if (pendingId) {
      store.setPendingStory(null)
      changeScreen('story', () => setStoryRequest({ chapterId: pendingId, afterScreen: 'game' }))
    }
    // story なし: ロードなしでそのまま編成画面へ（結果モーダルが閉じるだけ）
  }

  const handleFinishExpedition = () => {
    withLoading(async () => { store.finishExpedition() })
  }

  const handleConfirmRetreat = () => {
    setConfirm(null)
    withLoading(async () => { store.manualRetreat() })
  }

  const confirmDungeonId = confirm?.type === 'start' || confirm?.type === 'drop-list' ? confirm.dungeonId : null
  const confirmDungeon = confirmDungeonId ? DUNGEON_MAP.get(confirmDungeonId) ?? null : null
  const dropList = confirmDungeon ? getDungeonDropList(confirmDungeon.difficulty) : []
  const discoveredSet = new Set(discoveredEquipmentIds ?? [])

  const avgPartyLevel = party.members.length > 0
    ? Math.round(party.members.reduce((s, m) => s + m.level, 0) / party.members.length)
    : 1

  return (
    <div className="app">
      {/* タイトル画面 */}
      {screen === 'title' && (
        <TitleScreen
          onStart={() => changeScreen('game')}
          onShowPrologue={handleShowPrologue}
        />
      )}

      {/* ストーリー画面 */}
      {screen === 'story' && storyRequest && (() => {
        const chapter = STORY_CHAPTERS.find((c) => c.id === storyRequest.chapterId)
        return chapter ? (
          <StoryScene chapter={chapter} onComplete={handleStoryComplete} />
        ) : null
      })()}

      {/* ゲーム本体 */}
      {screen === 'game' && (
        <>
          <header className="header">
            <img src={imgLogo()} alt="Arveil Chronicle" className="header-logo" />
            {!expedition && (
              <nav className="header-tabs">
                {BASE_TABS.map(([t, label]) => (
                  <button key={t} className={`header-tab-btn ${baseTab === t ? 'active' : ''}`} onClick={() => setBaseTab(t)}>
                    {label}
                  </button>
                ))}
              </nav>
            )}
        <div className="resources">
          <div className="resource">
            <span className="resource-value">{resources.gold.toLocaleString()} Zel</span>
          </div>
        </div>
      </header>

      {/* ダンジョン開始確認モーダル */}
      {confirm?.type === 'start' && confirmDungeon && (
        <Dialog open onClose={() => setConfirm(null)} className="confirm-start-dialog">
          <div className="confirm-title">探索開始確認</div>
          <div className="confirm-dungeon-name">{confirmDungeon.name}</div>
          <div className="confirm-dungeon-meta">
            <span>{confirmDungeon.floors}階層</span>
            <span>推奨Lv{confirmDungeon.recommendedLevel}</span>
            <span>難易度 {'★'.repeat(Math.min(confirmDungeon.difficulty, 5))}{confirmDungeon.difficulty > 5 ? '+' : ''}</span>
          </div>
          {avgPartyLevel < confirmDungeon.recommendedLevel && (
            <div className="confirm-level-warn">
              ⚠ パーティ平均Lv{avgPartyLevel} — 推奨Lv{confirmDungeon.recommendedLevel}を下回っています。全滅のリスクがあります。
            </div>
          )}
          <div className="confirm-actions">
            <button className="confirm-ok" onClick={handleConfirmStart}>探索開始</button>
            <button className="confirm-drop-list-btn" onClick={() => setConfirm({ type: 'drop-list', dungeonId: confirm.dungeonId })}>ドロップ一覧</button>
            <button className="confirm-cancel" onClick={() => setConfirm(null)}>キャンセル</button>
          </div>
        </Dialog>
      )}

      {/* ドロップ一覧モーダル */}
      {confirm?.type === 'drop-list' && confirmDungeon && (
        <Dialog open onClose={() => setConfirm({ type: 'start', dungeonId: confirm.dungeonId })} className="confirm-start-dialog">
          <div className="confirm-title">{confirmDungeon.name} — ドロップ一覧</div>
          <div className="confirm-drop-list">
            {dropList.map(({ item, source }) => {
              const known = discoveredSet.has(item.id)
              return (
                <div key={item.id} className={`confirm-drop-row ${known ? 'known' : 'unknown'}`}>
                  <EquipmentIcon item={item} size={36} />
                  <span className="confirm-drop-slot">{item.slot === 'weapon' ? '武器' : item.slot === 'armor' ? '防具' : 'アクセ'}</span>
                  <span className="confirm-drop-name">{known ? getItemDisplayName(item) : '???'}</span>
                  <span className="confirm-drop-source">{SOURCE_LABEL[source]}</span>
                </div>
              )
            })}
          </div>
          <div className="confirm-actions">
            <button className="confirm-cancel" onClick={() => setConfirm({ type: 'start', dungeonId: confirm.dungeonId })}>戻る</button>
          </div>
        </Dialog>
      )}

      {/* 撤退確認モーダル */}
      {confirm?.type === 'retreat' && expedition && (
        <Dialog open onClose={() => setConfirm(null)}>
          <div className="confirm-title">撤退確認</div>
          <div className="confirm-sub">撤退すると部分報酬で帰還します</div>
          {(expedition.accumulatedGold > 0 || expedition.droppedItems.length > 0) && (
            <div className="confirm-retreat-rewards">
              <div className="confirm-drop-title">現在の獲得報酬</div>
              {expedition.accumulatedGold > 0 && (
                <div className="confirm-retreat-gold">{expedition.accumulatedGold.toLocaleString()} Zel</div>
              )}
              {expedition.droppedItems.map((item, i) => (
                <div key={i} className="confirm-retreat-item">{getItemDisplayName(item)}</div>
              ))}
            </div>
          )}
          <div className="confirm-actions">
            <button className="confirm-ok confirm-retreat-ok" onClick={handleConfirmRetreat}>撤退する</button>
            <button className="confirm-cancel" onClick={() => setConfirm(null)}>戦闘継続</button>
          </div>
        </Dialog>
      )}

      {!expedition && <BaseScreen tab={baseTab} onGoTitle={handleGoTitle} onShowStory={handleShowStory} />}

      {!expedition && (
        <div className="main-panels">
          <PartyPanel members={party.members} />
          <DungeonPanel
            dungeons={unlockedList}
            expedition={expedition}
            party={party.members}
            onStart={(id) => setConfirm({ type: 'start', dungeonId: id })}
          />
        </div>
      )}

      {expedition && activeDungeon && (
        <ExpeditionStatus
          dungeon={activeDungeon}
          onFinish={handleFinishExpedition}
          onRequestRetreat={() => setConfirm({ type: 'retreat' })}
        />
      )}

      {expeditionResult && (
        <ExpeditionResultModal result={expeditionResult} onClose={handleCloseResult} />
      )}

      {!expeditionResult && <TitleNotificationModal />}

      {import.meta.env.DEV && DebugPanel && (
        <Suspense fallback={null}>
          <DebugPanel />
        </Suspense>
      )}
        </>
      )}

      {/* 画面遷移フェードオーバーレイ */}
      <div className={`screen-loading-overlay${transitioning ? ' screen-loading-visible' : ''}`}>
        <div className="screen-loading-spinner" />
      </div>
    </div>
  )
}
