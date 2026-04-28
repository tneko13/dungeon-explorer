const BASE = import.meta.env.BASE_URL

export const imgLogo             = ()             => `${BASE}images/logo/logo.png`
export const imgCharacterPortrait = (cls: string) => `${BASE}images/characters/${cls}.png`
const baseEnemyId = (id: string) => id.replace(/_guardian$/, '').replace(/_\d+$/, '')
export const imgEnemyIcon     = (id: string) => `${BASE}images/enemies/${baseEnemyId(id)}_icon.png`
export const imgEnemyPortrait = (id: string) => `${BASE}images/enemies/${baseEnemyId(id)}.png`
export const imgFacility         = (name: string) => `${BASE}images/facilities/${name}.jpg`
export const imgDungeonBg        = (dungeonId: string, floor: number, isBoss: boolean) => {
  if (isBoss) return `${BASE}images/dungeons/${dungeonId}_boss.jpg`
  const n = String(((floor - 1) % 10) + 1).padStart(2, '0')
  return `${BASE}images/dungeons/${dungeonId}_${n}.jpg`
}

/** 複数画像を並行プリロードする。3秒経過またはすべて完了で解決する。 */
export function preloadImages(urls: string[]): Promise<void> {
  if (urls.length === 0) return Promise.resolve()
  return new Promise((resolve) => {
    let remaining = urls.length
    const finish = () => { if (--remaining <= 0) { clearTimeout(timer); resolve() } }
    const timer = setTimeout(resolve, 3000)
    urls.forEach((src) => {
      const img = new Image()
      img.onload = img.onerror = finish
      img.src = src
    })
  })
}
