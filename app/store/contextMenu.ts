import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { create } from 'zustand'

export interface IContextMenuData {
  title: string
  icon?: IconProp
  subTitle?: string
  status?: 'normal' | 'danger'
  onClick?: () => void
}

interface IPos {
  x: number
  y: number
}

interface IContextMenuState {
  menu: IContextMenuData[]
  pos: IPos | null
  open: (menu: IContextMenuData[], pos: IPos) => void
  close: () => void
}

export const useContextMenuStore = create<IContextMenuState>((set) => ({
  menu: [],
  pos: null,
  open: (menu, pos) => {
    set(() => ({ menu, pos }))
  },
  close: () => {
    set(() => ({ pos: null }))
  },
}))
