import './App.css'
import FieldComponent from './components/Field/Field'
import { updatedField, is5Chain, Field, initField } from './modules/field'
import { Player, toggledPlayer } from './modules/player'
import { useCoordinateFunc } from './modules/coordinate'
import { useEffect, useReducer, useState } from 'react'
import MenuComponent from './components/Menu/Menu'
import { FIELD_SIZE } from './modules/constants'

let player: Player = 1
let field: Field = []
let isCPU = [false, false]
const App: React.FC = () => {
  const [playerState, setPlayerState] = useState(1)
  const [fieldState, setFieldState] = useState<Field>([])
  const [disableField, setDisabledField] = useState(true)
  const [isOpenMenu, toggleIsOpenMenu] = useReducer(b => !b, true)
  const coordinateFunc = useCoordinateFunc()
  const [isEnd, setIsEnd] = useState(true)

  const cellClick = (coordinateCode: number) => {
    console.log('cellClick')

    setDisabledField(true)
    field = updatedField(field, { type: 'push', player, coordinateCode })
    setFieldState(field)

    if (is5Chain(field, coordinateFunc.decode(coordinateCode))) {
      console.log('end')
      setIsEnd(true)
      return
    }

    player = toggledPlayer(player)
    setPlayerState(player)
    console.log(isCPU)
    console.log(player)

    isCPU[player - 1] ? callCpu() : setDisabledField(false)
  }

  const callCpu = () => {
    const coordinate = { x: Math.floor(Math.random() * FIELD_SIZE), y: Math.floor(Math.random() * FIELD_SIZE) }
    window.setTimeout(() => {
      cellClick(coordinateFunc.encode(coordinate))
    }, 50)
  }

  const gameStart = (isCPU1: boolean, isCPU2: boolean) => {
    isCPU = [isCPU1, isCPU2]
    toggleIsOpenMenu()
    field = initField()
    setIsEnd(false)
    setFieldState(field)
    player = 1
    setPlayerState(player)
    isCPU1 ? callCpu() : setDisabledField(false)
  }

  const gameEnd = () => {
    toggleIsOpenMenu()
  }

  return (
    <div className="App">
      <div className="appContainer">
        <div className="fieldContainer">
          <FieldComponent disabled={disableField} field={fieldState} cellClick={cellClick} />
        </div>
        <div className="sideContents">
          <div onClick={gameEnd} className="stopButton">
            END
          </div>
          <div className={`nowColor ${playerState === 1 ? 'player1' : 'player2'}`}>{isEnd ? 'WIN' : '　'}</div>
        </div>
      </div>
      {isOpenMenu && (
        <div className="menuDialog">
          <div className="menuContainer">
            <MenuComponent gameStart={gameStart} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
