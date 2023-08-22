'use client'

import db, { IDBMusic, IDBPlaylist } from '@/db'
import { useEffect, useState } from 'react'
import PlaylistCover from './playlistCover'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

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
    <div className="relative w-full overflow-hidden rounded aspect-square group">
      <Link href={`/playlist/${props.data.id!}`}>
        <PlaylistCover musics={musics} />
        <div className="absolute top-0 left-0 invisible w-full h-full bg-white/30 group-hover:visible"></div>
      </Link>
      <div className="absolute bottom-0 left-0 flex items-center justify-between w-full gap-2 p-1">
        <span className="block max-w-full p-1 pl-3 pr-3 overflow-hidden rounded select-none text-ellipsis whitespace-nowrap w-fit bg-zinc-900 text-zinc-300">
          {props.data.title}
        </span>
        <button className="flex items-center justify-center w-8 h-8 rounded bg-zinc-900/80 text-zinc-300 hover:bg-zinc-900 shrink-0">
          <FontAwesomeIcon icon={faEllipsisVertical} className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
