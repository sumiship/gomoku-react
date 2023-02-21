import { FIELD_SIZE } from './constants'
import { Coordinate, useCoordinateFunc } from './coordinate'
import { Player } from './player'

const coordinateFunc = useCoordinateFunc()

type Cell = 0 | Player
export type Field = Cell[]

const directions: Coordinate[] = [
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 }
]

type updatedFieldAction = {
  type: 'push' | 'pop'
  player: Player
  coordinateCode: number
}

export const coordinateEncode = (a: Coordinate): number => a.y * FIELD_SIZE + a.x
export const coordinateDecode = (a: number): Coordinate => ({ x: a % FIELD_SIZE, y: Math.floor(a / FIELD_SIZE) })
export const isInside = (a: Coordinate): boolean => a.x >= 0 && a.y >= 0 && a.x < FIELD_SIZE && a.y < FIELD_SIZE
export const adjacentCoordinate = (a: Coordinate): Coordinate[] =>
  [
    ...directions.map(direction => coordinateFunc.sum(direction, a)),
    ...directions.map(direction => coordinateFunc.sum(coordinateFunc.mult(direction, -1), a))
  ].filter(m => isInside(m))

export const initField = (): Field => Array(FIELD_SIZE ** 2).fill(0)

export const updatedField = (field: Field, action: updatedFieldAction): Field => {
  return [
    ...field.slice(0, action.coordinateCode),
    action.type === 'push' ? action.player : 0,
    ...field.slice(action.coordinateCode + 1)
  ]
}

// export const comparisonCenter = (a: number, b: number): boolean => {
//   const [aCoo, bCoo] = [a, b].map(e => coordinateDecode(e))
//   const diffA = (aCoo.x - (FIELD_SIZE - 1) / 2) ** 2 + (aCoo.y - (FIELD_SIZE - 1) / 2) ** 2
//   const diffB = (bCoo.x - (FIELD_SIZE - 1) / 2) ** 2 + (bCoo.y - (FIELD_SIZE - 1) / 2) ** 2
//   return diffA <= diffB
// }

const chainLength = (field: Field, coordinate: Coordinate, direction: Coordinate): number => {
  let length = 0
  const baseCell = field[coordinateEncode(coordinate)]
  for (let i = 1; i <= FIELD_SIZE; i++) {
    const searchCoordinate = coordinateFunc.sum(coordinate, coordinateFunc.mult(direction, i))

    if (!isInside(searchCoordinate)) break
    if (field[coordinateEncode(searchCoordinate)] !== baseCell) break

    length++
  }
  for (let i = 1; i <= FIELD_SIZE; i++) {
    const searchCoordinate = coordinateFunc.sum(coordinate, coordinateFunc.mult(direction, -i))
    if (!isInside(searchCoordinate)) break
    if (field[coordinateEncode(searchCoordinate)] !== baseCell) break
    length++
  }

  return length + 1
}

export const is5Chain = (field: Field, coordinate: Coordinate): boolean => {
  return directions.some(direction => chainLength(field, coordinate, direction) >= 5)
}

/**
 * 空白を含めて5chainになる可能性がないなら長さ0、可能性があるなら間の空白も加えてchainを作るが空白自体はchainの長さに入れない。
 * ex)
 * ** ** -> 4
 * .****. -> 0
 * **.** -> 2, 2
 */
const looseChainLength = (field: Field, coordinate: Coordinate, direction: Coordinate): number => {
  let length = 0
  const baseCell = field[coordinateEncode(coordinate)]
  for (let i = 1; i <= FIELD_SIZE; i++) {
    const searchCoordinate = coordinateFunc.sum(coordinate, coordinateFunc.mult(direction, i))
    if (!isInside(searchCoordinate)) break
    const searchCell = field[coordinateEncode(searchCoordinate)]
    if (searchCell === 0) continue
    if (searchCell !== baseCell) break
    length++
  }
  for (let i = 1; i <= FIELD_SIZE; i++) {
    const searchCoordinate = coordinateFunc.sum(coordinate, coordinateFunc.mult(direction, -i))
    if (!isInside(searchCoordinate)) break
    const searchCell = field[coordinateEncode(searchCoordinate)]
    if (searchCell === 0) continue
    if (searchCell !== baseCell) break
    length++
  }

  return length + 1
}

export const evalField = (field: Field): number => {
  let player1Point = 0
  let player2Point = 0
  field.forEach((cell, index) => {
    if (cell === 1)
      player1Point += directions
        .map(direction => looseChainLength(field, coordinateDecode(index), direction) ** 2)
        .reduce((sum, e) => sum + e, 0)
    if (cell === 2)
      player2Point += directions
        .map(direction => looseChainLength(field, coordinateDecode(index), direction) ** 2)
        .reduce((sum, e) => sum + e, 0)
  })
  return player1Point - player2Point
}
