'use client'

import { useContextMenuStore } from '@/store/contextMenu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef } from 'react'

export default function ContextMenu() {
  const { menu, pos, close } = useContextMenuStore()
  const menuREF = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const callback = (e: globalThis.MouseEvent) => {
      if (!menuREF.current) return
      if (!menuREF.current.contains(e.target as HTMLElement)) close()
    }

    window.addEventListener('mousedown', callback)
    return () => window.removeEventListener('mousedown', callback)
  }, [close])

  return (
    <>
      {pos && menu.length > 0 ? (
        <div
          className="fixed"
          style={{ left: pos.x, top: pos.y }}
          ref={menuREF}
        >
          <ul className="p-1 rounded shadow-lg shadow-zinc-800 bg-zinc-900 text-zinc-400">
            {menu.map((m, i) => {
              return (
                <li
                  key={i}
                  onClick={() => {
                    if (m.onClick) m.onClick()
                    close()
                  }}
                  className="flex items-center justify-between p-2 pl-5 pr-5 text-sm rounded cursor-pointer hover:text-zinc-300 hover:bg-zinc-800"
                >
                  <span className="flex items-center gap-2">
                    {m.icon ? (
                      <FontAwesomeIcon icon={m.icon} className="w-3 h-3" />
                    ) : null}
                    <p>{m.title}</p>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </>
  )
}
