'use client'

import { useCurrentPlaylistStore } from '@/store/CurrentPlaylist'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'

interface IPos {
  x: number
  y: number
}

export default function MusicDND() {
  const [pos, setPos] = useState<IPos | null>(null)

  const dndMusic = useCurrentPlaylistStore((state) => state.dndMusic)

  const onMouseMove = (e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY })
  }

  useEffect(() => {
    if (dndMusic) {
      window.addEventListener('mousemove', onMouseMove)
    } else {
      window.removeEventListener('mousemove', onMouseMove)
      setPos(null)
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [dndMusic])

  return (
    <>
      {pos && dndMusic ? (
        <Tooltip
          pos={pos}
          className="fixed flex items-center gap-2 pl-3 pr-3 -translate-x-1/2 -translate-y-1/2 rounded pointer-events-none select-none w-72 h-9 text-zinc-300 bg-zinc-600 opacity-60"
        >
          <p className="overflow-hidden text-xs grow whitespace-nowrap overflow-ellipsis">
            {dndMusic.title}
          </p>
          <p className="w-20 overflow-hidden text-xs whitespace-nowrap overflow-ellipsis">
            {dndMusic.artist}
          </p>
        </Tooltip>
      ) : null}
    </>
  )
}

const Tooltip = styled.div<{ pos: IPos }>((props) => ({
  left: props.pos.x,
  top: props.pos.y,
}))
