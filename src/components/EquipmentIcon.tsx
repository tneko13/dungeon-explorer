import type { Equipment } from '../types'
import { EQUIPMENT_MAP } from '../game/equipment/EquipmentData'

const BASE = import.meta.env.BASE_URL
const BLADE_SHEET = `${BASE}images/equipment/weapons_blade.png`  // 2048x2048, sword/greatsword/dagger/staff/bow
const OTHER_SHEET = `${BASE}images/equipment/weapons_other.png`  // 1024x1024, mace/fist/holy/scythe/accessory
const ARMOR_SHEET = `${BASE}images/equipment/armor.png`          // heavy(0-4,0-4) light(5-9,0-4) robe(0-4,5-9) holy_armor(5-9,5-9)

const BLADE_TAGS = new Set(['sword', 'greatsword', 'dagger', 'staff', 'bow'])

const SLOT_FALLBACK: Record<string, string> = {
  weapon: '⚔',
  armor: '🛡',
  accessory: '💍',
}

interface EquipmentIconProps {
  item: Equipment
  size?: number
  className?: string
}

export function EquipmentIcon({ item, size = 40, className }: EquipmentIconProps) {
  // localStorage保存済みアイテムはspriteCoordを持たない場合があるのでマスタから補完
  const master = EQUIPMENT_MAP.get(item.baseId ?? item.id)
  const coord = item.spriteCoord ?? master?.spriteCoord

  if (!coord) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          fontSize: size * 0.55,
          background: '#1a1a2e',
          borderRadius: 4,
          border: '1px solid #2a2a4a',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}
      >
        {SLOT_FALLBACK[item.slot] ?? '?'}
      </span>
    )
  }

  // セルサイズに依存せず bgSize = 10*size, offset = col/row * size で統一
  const GRID = 10
  const bgSize = `${GRID * size}px ${GRID * size}px`
  const bgX = -(coord.col * size)
  const bgY = -(coord.row * size)
  const image = item.slot === 'armor' ? ARMOR_SHEET
    : item.weaponTag && BLADE_TAGS.has(item.weaponTag) ? BLADE_SHEET
    : OTHER_SHEET

  return (
    <span
      className={className}
      title={item.name}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        backgroundImage: `url(${image})`,
        backgroundSize: bgSize,
        backgroundPosition: `${bgX}px ${bgY}px`,
        backgroundRepeat: 'no-repeat',
        flexShrink: 0,
        borderRadius: 4,
        border: '1px solid #2a2a4a',
        boxSizing: 'border-box',
      }}
    />
  )
}
