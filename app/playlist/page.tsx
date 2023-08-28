'use client'

import AddPlaylist from '@/components/modal/addPlaylist'
import PlaylistTile from '@/components/ui/playlistTile'
import db from '@/db'
import useModal from '@/hooks/useModal'
import useResize from '@/hooks/useResize'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

export default function PlaylistPage() {
  const [wrapCount, setWrapCount] = useState(0)

  const ulREF = useRef<HTMLUListElement>(null)

  const playlists = useLiveQuery(() => db.playlists.toArray())
  const { modal, openModal, closeModal, setContent } = useModal({
    autoClose: false,
    className: 'w-2/3 h-fit max-w-lg',
  })

  useEffect(() => {
    setContent(<AddPlaylist close={closeModal} autoLink />)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useResize(() => {
    if (!ulREF.current) return
    const rect = ulREF.current.getBoundingClientRect()
    const minWidth = 224
    setWrapCount(Math.floor(rect.width / minWidth))
  })

  return (
    <div className="w-full p-8">
      <ul className="flex flex-wrap" ref={ulREF}>
        <WrapLi className="w-56 p-2 grow" wrapCount={wrapCount}>
          <button
            className="flex items-center justify-center w-full rounded aspect-square bg-zinc-600 hover:bg-zinc-500"
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlus} className="w-6 h-6 text-zinc-300" />
          </button>
        </WrapLi>
        {playlists?.map((playlist, i) => {
          return (
            <WrapLi key={i} className="w-56 p-2 grow" wrapCount={wrapCount}>
              <PlaylistTile data={playlist} />
            </WrapLi>
          )
        }) ?? null}
      </ul>
      {modal}
    </div>
  )
}

const WrapLi = styled.li<{ wrapCount: number }>((props) => ({
  maxWidth: `${100 / props.wrapCount}%`,
}))
