'use client'

import db, { IDBMusic, IDBPlaylist } from '@/db'
import { useEffect, useState } from 'react'
import PlaylistCover from './playlistCover'

interface IProps {
  data: IDBPlaylist
}

export default function PlaylistTile(props: IProps) {
  const [musics, setMusics] = useState<IDBMusic[]>([])

  useEffect(() => {
    const getMusics = async () => {
      if (!props.data?.musics) return
      const tmpMusics: IDBMusic[] = []
      for (const id of props.data.musics) {
        try {
          const music = await db.musics.get(id)
          if (music) tmpMusics.push(music)
        } catch (error) {
          console.error(error)
        }
      }
      setMusics(tmpMusics)
    }
    getMusics()
  }, [props.data?.musics])

  return (
    <div className="relative w-40 h-40 overflow-hidden rounded group">
      <PlaylistCover musics={musics} />
      <div className="absolute top-0 left-0 invisible w-full h-full bg-white/30 group-hover:visible"></div>
      <div className="absolute bottom-0 left-0 max-w-full p-1 text-ellipsis whitespace-nowrap w-fit">
        <span className="block p-1 pl-2 pr-2 overflow-hidden text-xs rounded-sm bg-zinc-800/90 text-zinc-400">
          {props.data.title}
        </span>
      </div>
    </div>
  )
}
