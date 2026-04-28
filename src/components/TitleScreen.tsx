import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { imgLogo } from '../utils/imagePaths'

interface Props {
  onStart: () => void
  onShowPrologue: () => void
}

export function TitleScreen({ onStart, onShowPrologue }: Props) {
  const { viewedStoryIds } = useGameStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const prologueViewed = viewedStoryIds.includes('prologue')

  const handleStart = () => {
    if (!prologueViewed) {
      onShowPrologue()
    } else {
      onStart()
    }
  }

  return (
    <div className={`title-screen ${visible ? 'title-visible' : ''}`} onClick={handleStart}>
      <div className="title-bg" />

      <div className="title-content">
        <div className="title-logo">
          <img src={imgLogo()} alt="Arveil Chronicle" className="title-logo-img" />
        </div>

        <div className="title-tap-hint">
          {prologueViewed ? 'タップしてはじめる' : 'タップしてはじめる'}
        </div>

        <div className="title-footer">
          <span>© Arveil Chronicle</span>
        </div>
      </div>
    </div>
  )
}
