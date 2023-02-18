import { FIELD_SIZE } from './constants'

export type Coordinate = { x: number; y: number }

export const useCoordinateFunc = () => {
  const sum = (a: Coordinate, b: Coordinate): Coordinate => ({ x: a.x + b.x, y: a.y + b.y })
  const mult = (a: Coordinate, b: number): Coordinate => ({ x: a.x * b, y: a.y * b })
  const encode = (a: Coordinate): number => a.y * FIELD_SIZE + a.x
  const decode = (a: number): Coordinate => ({ x: a % FIELD_SIZE, y: Math.floor(a / FIELD_SIZE) })
  const isInside = (a: Coordinate, xMin: number, xMax: number, yMin: number, yMax: number): boolean =>
    a.x >= xMin && a.y >= yMin && a.x <= xMax && a.y <= yMax
  return {
    sum,
    mult,
    encode,
    decode,
    isInside
  }
}
