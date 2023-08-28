'use client'

import { useLiveQuery } from 'dexie-react-hooks'
import Dropdown from '../ui/dropdown'
import db, { IDBPlaylist } from '@/db'
import { useState } from 'react'
import { addPlaylistMusic } from '@/utils/dexie'

interface IProps {
  musics: string[]
  close: () => void
}

export default function ChoosePlaylist(props: IProps) {
  const [selectedPlaylist, setSelectedPlaylist] = useState<IDBPlaylist | null>(
    null
  )

  const playlists = useLiveQuery(() => db.playlists.toArray())

  const saveHandler = async () => {
    if (selectedPlaylist === null) return
    try {
      for (const music of props.musics)
        await addPlaylistMusic(selectedPlaylist.id!, music)
      props.close()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <article className="flex flex-col justify-between w-full h-full p-4 rounded-md bg-zinc-800">
      <h2 className="mb-3 ml-2 text-lg font-semibold text-gray-400">
        Choose Playlist
      </h2>
      <section className="mb-6">
        <Dropdown
          value={
            selectedPlaylist === null
              ? 'Please choose playlist'
              : selectedPlaylist.title
          }
          autoClose
        >
          {playlists?.map((playlist, i) => {
            return (
              <button
                key={i}
                onClick={() => setSelectedPlaylist(playlist)}
                className="flex items-center justify-start w-full p-2 pl-3 pr-3 text-sm outline-none focus:bg-zinc-800 focus:text-zinc-300 h-9 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
              >
                {playlist.title}
              </button>
            )
          })}
        </Dropdown>
      </section>
      <section className="flex justify-end gap-2">
        <button
          className="p-2 pl-3 pr-3 text-sm text-gray-400 uppercase rounded bg-zinc-900 hover:bg-zinc-700"
          onClick={props.close}
        >
          cancel
        </button>
        <button
          className="p-2 pl-3 pr-3 text-sm text-gray-400 uppercase border border-transparent rounded bg-zinc-900 hover:bg-zinc-700 hover:border-purple-600 outline-purple-600"
          onClick={saveHandler}
        >
          save
        </button>
      </section>
    </article>
  )
}
