import { useReducer } from 'react'
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

export const initField = (): Field => Array(FIELD_SIZE ** 2).fill(0)

export const updatedField = (field: Field, action: updatedFieldAction): Field => {
  return [
    ...field.slice(0, action.coordinateCode),
    action.type === 'push' ? action.player : 0,
    ...field.slice(action.coordinateCode + 1)
  ]
}

const chainLength = (field: Field, coordinate: Coordinate, direction: Coordinate): number => {
  let length = 0
  for (let i = 1; i <= FIELD_SIZE; i++) {
    const searchCoordinate = coordinateFunc.sum(coordinate, coordinateFunc.mult(direction, i))
    if (coordinateFunc.isInside(searchCoordinate, 0, 0, FIELD_SIZE - 1, FIELD_SIZE - 1)) break
    if (field[coordinateFunc.encode(searchCoordinate)] !== field[coordinateFunc.encode(coordinate)]) break
    length++
  }
  for (let i = 1; i <= FIELD_SIZE; i++) {
    const searchCoordinate = coordinateFunc.sum(coordinate, coordinateFunc.mult(direction, -i))
    if (coordinateFunc.isInside(searchCoordinate, 0, 0, FIELD_SIZE - 1, FIELD_SIZE - 1)) break
    if (field[coordinateFunc.encode(searchCoordinate)] !== field[coordinateFunc.encode(coordinate)]) break
    length++
  }
  return length + 1
}

export const is5Chain = (field: Field, coordinate: Coordinate): boolean => {
  return directions.some(direction => chainLength(field, coordinate, direction) >= 5)
}
