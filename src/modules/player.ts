import { useReducer, useState } from 'react'

export type Player = 1 | 2

export const toggledPlayer = (player: Player): Player => ((player % 2) + 1) as Player
