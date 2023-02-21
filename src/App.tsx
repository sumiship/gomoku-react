import './App.css'
import FieldComponent from './components/Field/Field'
import { updatedField, is5Chain, Field, initField, coordinateDecode, coordinateEncode } from './modules/field'
import { Player, toggledPlayer } from './modules/player'
import { useReducer, useState } from 'react'
import MenuComponent from './components/Menu/Menu'
import { searchBestCoordinate, useNullCellManager } from './modules/searchBestCoordinate'

let player: Player = 1
let field: Field = []
let isCPU = [false, false]
const nullCellManager = useNullCellManager()
const App: React.FC = () => {
  const [playerState, setPlayerState] = useState(1)
  const [fieldState, setFieldState] = useState<Field>([])
  const [disableField, setDisabledField] = useState(true)
  const [isOpenMenu, toggleIsOpenMenu] = useReducer(b => !b, true)
  const [isEnd, setIsEnd] = useState(true)
  const [isMovingCPU, setIsMovingCPU] = useState(false)
  const [lastHand, setLastHand] = useState<null | number>(null)

  const cellClick = (coordinateCode: number) => {
    setLastHand(coordinateCode)
    setDisabledField(true)
    field = updatedField(field, { type: 'push', player, coordinateCode })
    setFieldState(field)

    if (is5Chain(field, coordinateDecode(coordinateCode))) {
      console.log('end')
      setIsEnd(true)
      return
    }

    player = toggledPlayer(player)
    setPlayerState(player)

    nullCellManager.putCell(coordinateDecode(coordinateCode))
    isCPU[player - 1] ? callCpu() : setDisabledField(false)
  }

  const callCpu = () => {
    setIsMovingCPU(true)
    window.setTimeout(() => {
      const ans = searchBestCoordinate(field, player, nullCellManager.cells)
      setIsMovingCPU(false)
      cellClick(coordinateEncode(ans))
    }, 50)
  }

  const gameStart = (isCPU1: boolean, isCPU2: boolean) => {
    setLastHand(null)
    nullCellManager.reset()
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
          <FieldComponent disabled={disableField} field={fieldState} cellClick={cellClick} lastHand={lastHand} />
        </div>
        <div className="sideContents">
          <div onClick={gameEnd} className="stopButton">
            END
          </div>
          <div className={`nowColor ${playerState === 1 ? 'player1' : 'player2'}`}>
            {isMovingCPU ? 'SEARCH' : isEnd ? 'WIN' : '　'}
          </div>
          {/* <div onClick={callCpu}>test</div> */}
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
