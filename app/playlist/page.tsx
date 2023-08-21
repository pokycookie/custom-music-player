'use client'

import AddPlaylist from '@/components/modal/addPlaylist'
import PlaylistCover from '@/components/ui/playlistCover'
import db from '@/db'
import useModal from '@/hooks/useModal'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLiveQuery } from 'dexie-react-hooks'
import Link from 'next/link'
import { useEffect } from 'react'

export default function PlaylistPage() {
  const playlists = useLiveQuery(() => db.playlists.toArray())

  const { modal, openModal, closeModal, setContent } = useModal({
    autoClose: false,
    className: 'w-2/3 h-fit max-w-lg',
  })

  useEffect(() => {
    setContent(<AddPlaylist close={closeModal} />)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full p-6">
      <ul className="flex flex-wrap gap-4">
        <button
          className="flex items-center justify-center w-40 h-40 rounded bg-zinc-600 hover:bg-zinc-500"
          onClick={openModal}
        >
          <FontAwesomeIcon icon={faPlus} className="w-6 h-6 text-zinc-300" />
        </button>
        {playlists?.map((playlist, i) => {
          return (
            <Link
              key={i}
              href={`/playlist/${playlist.id!}`}
              className="relative w-40 h-40 rounded bg-zinc-600 hover:bg-zinc-500"
            >
              <div className="absolute bottom-0 left-0 w-full p-2">
                <span className="block max-w-full p-1 pl-2 pr-2 overflow-hidden text-xs rounded-sm text-ellipsis whitespace-nowrap w-fit bg-zinc-800/70 text-zinc-400">
                  {playlist.title}
                </span>
              </div>
            </Link>
          )
        }) ?? null}
      </ul>
      {modal}
    </div>
  )
}
