import { useState } from 'react'
import './Menu.css'

export type Props = {
  gameStart: (isCpu1: boolean, isCpu2: boolean) => void
}

const MenuComponent: React.FC<Props> = ({ gameStart }) => {
  const [isCPU1, setIsCPU1] = useState(false)
  const [isCPU2, setIsCPU2] = useState(false)
  return (
    <div className="MenuComponent">
      <div className="playerSelectContainer player1">
        <div className="label">先攻</div>
        <div onClick={() => setIsCPU1(false)} className={`selectArea ${isCPU1 || 'active'}`}>
          Player
        </div>
        <div onClick={() => setIsCPU1(true)} className={`selectArea ${isCPU1 && 'active'}`}>
          CPU
        </div>
      </div>
      <div className="playerSelectContainer player2">
        <div className="label">後攻</div>
        <div onClick={() => setIsCPU2(false)} className={`selectArea ${isCPU2 || 'active'}`}>
          Player
        </div>
        <div onClick={() => setIsCPU2(true)} className={`selectArea ${isCPU2 && 'active'}`}>
          CPU
        </div>
      </div>
      <div onClick={() => gameStart(isCPU1, isCPU2)} className="startButton">
        Start
      </div>
    </div>
  )
}

export default MenuComponent
