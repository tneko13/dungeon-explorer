import { useEffect, useRef, useState, useCallback } from 'react'
import type { StoryChapter } from '../game/story/StoryData'

interface Props {
  chapter: StoryChapter
  onComplete: () => void
}

const CHAR_INTERVAL_MS = 45 // 1文字あたりのms

export function StoryScene({ chapter, onComplete }: Props) {
  const [sceneIdx, setSceneIdx] = useState(0)
  const [bgLoaded, setBgLoaded] = useState(false)
  const [displayedChars, setDisplayedChars] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scene = chapter.scenes[sceneIdx]
  const fullText = scene.text
  const isTyping = displayedChars < fullText.length
  const isLast = sceneIdx >= chapter.scenes.length - 1

  // シーン切り替え時：タイプライター開始
  useEffect(() => {
    setBgLoaded(false)
    setDisplayedChars(0)
    if (intervalRef.current) clearInterval(intervalRef.current)

    // 少し遅らせてからタイプ開始（背景フェードインと合わせる）
    const startTimer = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setDisplayedChars((n) => {
          if (n >= fullText.length) {
            clearInterval(intervalRef.current!)
            return n
          }
          return n + 1
        })
      }, CHAR_INTERVAL_MS)
    }, 300)

    return () => {
      clearTimeout(startTimer)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [sceneIdx, fullText])

  const advance = useCallback(() => {
    if (isLast) {
      onComplete()
    } else {
      setSceneIdx((i) => i + 1)
    }
  }, [isLast, onComplete])

  // タップ処理：アニメーション中 → 全文即表示、完了後 → 次のシーンへ
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.story-skip-btn')) return
    if (isTyping) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setDisplayedChars(fullText.length)
    } else {
      advance()
    }
  }

  // 表示中テキスト（改行を \n で分割してレンダリング）
  const visibleText = fullText.slice(0, displayedChars)

  const bgStyle = scene.bg
    ? { backgroundImage: `url(${import.meta.env.BASE_URL}${scene.bg})` }
    : {}

  return (
    <div className="story-screen" onClick={handleClick}>
      {/* 背景 */}
      <div
        className={`story-bg ${bgLoaded ? 'story-bg-loaded' : ''}`}
        style={bgStyle}
      >
        {scene.bg && (
          <img
            src={`${import.meta.env.BASE_URL}${scene.bg}`}
            alt=""
            style={{ display: 'none' }}
            onLoad={() => setBgLoaded(true)}
          />
        )}
      </div>

      {/* 暗幕オーバーレイ */}
      <div className="story-overlay" />

      {/* テキストボックス */}
      <div className="story-textbox story-text-visible">
        <div className="story-chapter-title">{chapter.title}</div>
        <div className="story-text">
          {visibleText.split('\n').map((line, i) => (
            <p key={i}>{line || '\u00a0'}</p>
          ))}
        </div>
      </div>

      {/* 次へ ▼ インジケーター（タイプ完了時のみ表示） */}
      {!isTyping && (
        <div className="story-next-indicator">▼</div>
      )}

      {/* スキップボタン */}
      <button
        className="story-skip-btn"
        onClick={(e) => { e.stopPropagation(); onComplete() }}
      >
        スキップ ›
      </button>
    </div>
  )
}

