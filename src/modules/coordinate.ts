export type Coordinate = { x: number; y: number }

export const useCoordinateFunc = () => {
  const sum = (a: Coordinate, b: Coordinate): Coordinate => ({ x: a.x + b.x, y: a.y + b.y })
  const mult = (a: Coordinate, b: number): Coordinate => ({ x: a.x * b, y: a.y * b })
  return {
    sum,
    mult
  }
}
