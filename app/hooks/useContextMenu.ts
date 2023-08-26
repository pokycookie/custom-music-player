import { IContextMenuData, useContextMenuStore } from '@/store/contextMenu'
import { MouseEvent } from 'react'

export default function useContextMenu() {
  const contextOpen = useContextMenuStore((state) => state.open)
  const contextClose = useContextMenuStore((state) => state.close)

  const open = (e: MouseEvent, menu: IContextMenuData[]) => {
    const x = e.clientX
    const y = e.clientY
    contextOpen(menu, { x, y })
  }

  return { open, close: contextClose }
}
