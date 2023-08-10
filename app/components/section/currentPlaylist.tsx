'use client'

import { useCurrentPlaylistStore } from '@/store/CurrentPlaylist'
import Check from '../ui/check'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'

const playlistHeight = 36

interface IProps {
  checks: Set<number>
  currentPlayIdx: number | null
  checkHandler: (index: number, checked: boolean) => void
  changeMusic: (idx: number) => void
  clearChecks: () => void
}

export default function CurrentPlaylist(props: IProps) {
  const [pos, setPos] = useState<number | null>(null)

  const prevIdx = useRef(0) // 드래그를 시작한 위치
  const playlistUlREF = useRef<HTMLUListElement>(null)

  const cps = useCurrentPlaylistStore()

  // Reorder playlist

  const onMouseDown = (index: number) => {
    prevIdx.current = index
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)
  }

  const onMouseUp = (e: MouseEvent) => {
    const ul = playlistUlREF.current
    if (!ul) return
    const rect = ul.getBoundingClientRect()
    const top = Math.max(e.clientY - rect.top, 0)
    const tmpPos = Math.min(
      Math.floor((top + ul.scrollTop) / playlistHeight) * playlistHeight,
      (cps.currentPlaylist.length - 1) * playlistHeight
    )

    const prev = prevIdx.current
    const next = (tmpPos ?? 0) / playlistHeight

    if (prev !== next) {
      const reorderPlaylist = [...cps.currentPlaylist]
      const selectedMusic = reorderPlaylist[prev]

      reorderPlaylist.splice(prev, 1)
      reorderPlaylist.splice(next, 0, selectedMusic)

      cps.reorder(reorderPlaylist)
      props.clearChecks()
    }

    setPos(null)

    window.removeEventListener('mouseup', onMouseUp)
    window.removeEventListener('mousemove', onMouseMove)
  }

  const onMouseMove = (e: MouseEvent) => {
    const ul = playlistUlREF.current
    if (!ul) return
    const rect = ul.getBoundingClientRect()
    const top = Math.max(e.clientY - rect.top, 0)
    const tmpPos = Math.min(
      Math.floor((top + ul.scrollTop) / playlistHeight) * playlistHeight,
      (cps.currentPlaylist.length - 1) * playlistHeight
    )

    setPos(tmpPos)
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUpDND)
      window.removeEventListener('mousemove', onMouseMoveDND)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // DND

  const onMouseMoveDND = (e: MouseEvent) => {
    const ul = playlistUlREF.current
    if (!ul) return
    const rect = ul.getBoundingClientRect()
    const offsetTop = e.clientY - rect.top
    const offsetLeft = e.clientX - rect.left
    const top = Math.max(e.clientY - rect.top, 0)
    const tmpPos = Math.min(
      Math.floor((top + ul.scrollTop) / playlistHeight) * playlistHeight,
      cps.currentPlaylist.length * playlistHeight
    )

    if (offsetTop > 0 && offsetLeft > 0) setPos(tmpPos)
    else setPos(null)
  }

  const onMouseUpDND = (e: MouseEvent) => {
    const ul = playlistUlREF.current
    if (!ul) return
    const rect = ul.getBoundingClientRect()
    const offsetTop = e.clientY - rect.top
    const offsetLeft = e.clientX - rect.left
    const top = Math.max(e.clientY - rect.top, 0)
    const tmpPos = Math.min(
      Math.floor((top + ul.scrollTop) / playlistHeight) * playlistHeight,
      cps.currentPlaylist.length * playlistHeight
    )

    setPos(null)
    window.removeEventListener('mouseup', onMouseUpDND)
    window.removeEventListener('mousemove', onMouseMoveDND)

    // 플레이리스트 영역이 아닌곳에서 마우스 드롭시 곡을 추가하지 않음
    if (offsetTop < 0 || offsetLeft < 0) {
      cps.cancelDND()
      return
    }

    if (props.currentPlayIdx !== null) {
      // 현재 재생중인 음악이 있는 경우
      const index = (tmpPos ?? 0) / playlistHeight
      cps.endDrag(index)
    } else {
      // 현재 재생중인 음악이 없는 경우
      cps.endDrag(0)
      if (cps.dndMusic) cps.setCurrentPlayMusic(cps.dndMusic)
    }
    cps.cancelDND()
  }

  useEffect(() => {
    if (cps.dndMusic) {
      window.addEventListener('mouseup', onMouseUpDND)
      window.addEventListener('mousemove', onMouseMoveDND)
    } else {
      window.removeEventListener('mouseup', onMouseUpDND)
      window.removeEventListener('mousemove', onMouseMoveDND)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cps.dndMusic])

  return (
    <ul className="relative w-full overflow-y-scroll grow" ref={playlistUlREF}>
      {cps.currentPlaylist.map((music, i) => {
        return (
          <PlaylistLi
            key={i}
            selected={props.currentPlayIdx === i}
            className="flex items-center w-full gap-3 pl-3 pr-3 h-9 grid-cols-playlist text-zinc-400 hover:bg-zinc-900"
          >
            <Check
              checked={props.checks.has(i)}
              onChange={(checked) => props.checkHandler(i, checked)}
            />
            <span
              className="grid grid-cols-[1fr_80px] w-full gap-3 items-center"
              onMouseDown={() => onMouseDown(i)}
              onDoubleClick={() => props.changeMusic(i)}
            >
              <p className="w-full overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                {music.title}
              </p>
              <p className="w-full overflow-hidden text-xs whitespace-nowrap text-ellipsis">
                {music.artist}
              </p>
            </span>
          </PlaylistLi>
        )
      })}
      {pos !== null && !cps.dndMusic ? (
        <Indicator
          className="absolute flex justify-end w-full border-t-2 border-purple-400 pointer-events-none"
          pos={pos}
        >
          <p className="bg-purple-400 text-zinc-900 text-xs p-1 rounded-bl-sm rounded-br-sm max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
            {cps.currentPlaylist[prevIdx.current].title}
          </p>
        </Indicator>
      ) : null}
      {pos !== null && cps.dndMusic ? (
        <Indicator
          className="absolute flex justify-end w-full border-t-2 border-purple-400 pointer-events-none"
          pos={pos}
        >
          <p className="bg-purple-400 text-zinc-900 text-xs p-1 rounded-bl-sm rounded-br-sm max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
            {cps.dndMusic.title}
          </p>
        </Indicator>
      ) : null}
    </ul>
  )
}

const PlaylistLi = styled.li<{ selected: boolean }>((props) => ({
  color: props.selected ? '#c084fc' : '#a1a1aa',
}))

const Indicator = styled.div<{ pos: number | null }>((props) => ({
  top: props.pos ?? 0,
}))
