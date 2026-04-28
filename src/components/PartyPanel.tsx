import type { Character } from '../types'
import { CLASS_LABEL, PORTRAIT_CROP } from '../game/party/CharacterData'
import { STANCE_LABELS } from '../game/combat/CombatEngine'
import { getItemDisplayName } from '../game/equipment/EquipmentData'
import { imgCharacterPortrait } from '../utils/imagePaths'

function CharIcon({ cls }: { cls: string }) {
  const crop = PORTRAIT_CROP[cls] ?? { ix: 50, iy: 0 }
  const size = 52
  const bgW = Math.round(size * 3.8)
  return (
    <div className="char-panel-icon" style={{
      backgroundImage: `url(${imgCharacterPortrait(cls)})`,
      backgroundSize: `${bgW}px auto`,
      backgroundPosition: `${crop.ix}% ${crop.iy}%`,
      backgroundRepeat: 'no-repeat',
    }} />
  )
}

interface Props {
  members: Character[]
}

export function PartyPanel({ members }: Props) {
  return (
    <div className="panel">
      <div className="panel-title">パーティ</div>
      {members.map((char) => {
        const hpRatio = char.maxHp > 0 ? (char.hp / char.maxHp) * 100 : 0
        return (
          <div key={char.id} className="character-card">
            <div className="character-card-body">
            <CharIcon cls={char.class} />
            <div className="character-card-info">
            <div className="character-header">
              <span className="character-name">{char.name}</span>
              <span className={`class-badge ${char.class}`}>{CLASS_LABEL[char.class]}</span>
              <span className="character-level">Lv.{char.level}</span>
            </div>
            <div className="hp-bar-wrap">
              <span className="hp-text">HP {char.hp}/{char.maxHp}</span>
              <div className="hp-bar">
                <div className="hp-fill" style={{ width: `${hpRatio}%` }} />
              </div>
            </div>
            <div className="hp-bar-wrap">
              <span className="hp-text">MP {char.mp}/{char.maxMp}</span>
              <div className="hp-bar">
                <div className="mp-fill" style={{ width: `${char.maxMp > 0 ? (char.mp / char.maxMp) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="stat-row">
              <span>ATK {char.attack}</span>
              <span>DEF {char.defense}</span>
              <span>SPD {char.speed}</span>
            </div>
            <div className="party-stance-equip">
              <span className="party-stance-badge">{STANCE_LABELS[char.stance]}</span>
              <span className="party-equip-item">{char.equipment.weapon    ? getItemDisplayName(char.equipment.weapon)    : '—'}</span>
              <span className="party-equip-item">{char.equipment.armor     ? getItemDisplayName(char.equipment.armor)     : '—'}</span>
              <span className="party-equip-item">{char.equipment.accessory ? getItemDisplayName(char.equipment.accessory) : '—'}</span>
            </div>
            {char.skills.length > 0 && (
              <div className="skill-tags">
                {char.skills.map((s) => (
                  <span key={s.id} className={`skill-tag ${s.type}`}>{s.name}</span>
                ))}
              </div>
            )}
            </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
