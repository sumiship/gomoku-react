import { FIELD_SIZE } from './constants'
import { Coordinate } from './coordinate'
import {
  adjacentCoordinate,
  coordinateDecode,
  coordinateEncode,
  evalField,
  Field,
  is5Chain,
  updatedField
} from './field'
import { Player, toggledPlayer } from './player'

const ATTENUATION_RATE = 1.1

export const useNullCellManager = () => {
  const cells: number[] = []

  const reset = () => {
    cells.length = 0
    cells.push(...[...Array(FIELD_SIZE ** 2)].map((_, i) => i))
  }

  const putCell = (lastHand: Coordinate) => {
    const lastHandCode = coordinateEncode(lastHand)
    const adjacentCells = adjacentCoordinate(lastHand).map(e => coordinateEncode(e))
    const includeAdjacentCells: number[] = []
    const filtered = cells.filter(e => {
      if (e === lastHandCode) return false
      if (adjacentCells.includes(e)) {
        includeAdjacentCells.push(e)
        return false
      }
      return true
    })
    cells.length = 0
    cells.push(...includeAdjacentCells, ...filtered)
  }

  reset()
  return {
    cells,
    reset,
    putCell
  }
}

export const searchBestCoordinate = (field: Field, player: Player, nullCells: number[]): Coordinate => {
  // console.log(nullCells)
  if (nullCells.length === field.length) return { x: Math.floor(FIELD_SIZE / 2), y: Math.floor(FIELD_SIZE / 2) }

  // const cutOffLevel = Math.max(Math.floor(field.length / nullCells.length), 4)
  const cutOffLevel = 4

  const answer = maxMini(
    field,
    nullCells,
    null,
    player,
    -1 * Number.MAX_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
    cutOffLevel
  )
  console.log(answer)
  return coordinateDecode(answer.bestHand)
}

const maxMini = (
  field: Field,
  coordinateCodeList: number[],
  lastHand: number | null,
  player: Player,
  alpha: number,
  beta: number,
  cutOff: number
): { value: number; bestHand: number } => {
  // ;[...Array(cutOff)].forEach(() => {
  //   console.log('---------------------------')
  // })
  // console.log(`Player: ${player}, cutOff: ${cutOff}, beta: ${beta}`)
  // console.log('lastHand: ', lastHand !== null && coordinateDecode(lastHand))

  const isEnd = lastHand !== null && is5Chain(field, coordinateDecode(lastHand))
  if (isEnd) return { value: -1 * Number.MAX_SAFE_INTEGER, bestHand: lastHand }
  if (coordinateCodeList.length === 0 || cutOff-- <= 0)
    return { value: (player === 1 ? 1 : -1) * evalField(field), bestHand: lastHand! }
  let max = -1 * Number.MAX_SAFE_INTEGER
  let maxIndex = 0
  for (let index = 0; index < coordinateCodeList.length; index++) {
    const coordinate = coordinateCodeList[index]

    const newList = [...coordinateCodeList.slice(0, index), ...coordinateCodeList.slice(index + 1)]
    const newField = updatedField(field, { type: 'push', coordinateCode: coordinate, player })
    const ans = maxMini(
      newField,
      newList,
      coordinate,
      toggledPlayer(player),
      -ATTENUATION_RATE * beta,
      -ATTENUATION_RATE * alpha,
      cutOff
    )
    ans.value /= ATTENUATION_RATE
    // console.log('getAns: ', ans)

    if (-1 * ans.value > max) {
      max = ans.value * -1
      maxIndex = index
    }
    if (max >= beta) {
      return { value: max, bestHand: coordinateCodeList[maxIndex] }
    }
    alpha = Math.max(max, alpha)
  }
  return { value: max, bestHand: coordinateCodeList[maxIndex] }
}
