'use client'

import db from '@/db'
import { createPlaylist } from '@/utils/dexie'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLiveQuery } from 'dexie-react-hooks'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PlaylistPage() {
  const router = useRouter()

  const addHandler = async () => {
    const key = await createPlaylist()
    if (key) router.push(`/playlist/${key}`)
  }

  const playlists = useLiveQuery(() => db.playlists.toArray())

  return (
    <div className="w-full p-6">
      <ul className="flex flex-wrap gap-4">
        <button
          className="flex items-center justify-center w-40 h-40 rounded bg-zinc-600 hover:bg-zinc-500"
          onClick={addHandler}
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
    </div>
  )
}
