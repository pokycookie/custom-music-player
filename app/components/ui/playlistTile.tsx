'use client'

import db, { IDBMusic, IDBPlaylist } from '@/db'
import { MouseEvent, useEffect, useState } from 'react'
import PlaylistCover from './playlistCover'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisVertical,
  faFileExport,
  faLayerGroup,
  faPlay,
  faShuffle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import useContextMenu from '@/hooks/useContextMenu'
import { useCurrentPlaylistStore } from '@/store/CurrentPlaylist'
import { exportData } from '@/utils/fileSystem'
import useModal from '@/hooks/useModal'
import EditPlaylist from '../modal/editPlaylist'

interface IProps {
  data: IDBPlaylist
}

export default function PlaylistTile(props: IProps) {
  const [musics, setMusics] = useState<IDBMusic[]>([])

  const contextOpen = useContextMenu().open
  const replace = useCurrentPlaylistStore((state) => state.replace)
  const addMusics = useCurrentPlaylistStore((state) => state.add)

  const { modal, openModal, closeModal, setContent } = useModal({
    autoClose: false,
    className: 'w-2/3 h-fit max-w-lg',
  })

  const contextMenuHandler = (e: MouseEvent) => {
    contextOpen(e, [
      { title: 'Play', icon: faPlay, onClick: playHandler },
      { title: 'Shuffle play', icon: faShuffle, onClick: shuffleHandler },
      { title: 'Add to queue', icon: faLayerGroup, onClick: queueHandler },
      { title: 'Export', icon: faFileExport, onClick: exportHandler },
      { title: 'Edit', icon: faEdit, onClick: openModal },
      { title: 'Delete', icon: faTrash, status: 'danger' },
    ])
  }

  const playHandler = () => {
    replace(musics)
  }
  const shuffleHandler = () => {
    const shuffle = [...musics]
    shuffle.sort(() => Math.random() - 0.5)
    replace(shuffle)
  }
  const queueHandler = () => {
    musics.forEach((music) => addMusics(music))
  }
  const exportHandler = () => {
    exportData({ musics: [], playlists: [props.data] })
  }

  useEffect(() => {
    setContent(
      <EditPlaylist
        close={closeModal}
        title={props.data.title}
        tags={props.data.tags}
        id={props.data.id!}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data])

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
    <div
      className="relative w-full overflow-hidden rounded aspect-square group"
      onContextMenu={contextMenuHandler}
    >
      <Link href={`/playlist/${props.data.id!}`}>
        <PlaylistCover musics={musics} />
        <div className="absolute top-0 left-0 invisible w-full h-full bg-white/30 group-hover:visible"></div>
      </Link>
      <div className="absolute bottom-0 left-0 flex items-center justify-between w-full gap-2 p-1">
        <span className="block max-w-full p-1 pl-3 pr-3 overflow-hidden rounded select-none text-ellipsis whitespace-nowrap w-fit bg-zinc-900 text-zinc-300">
          {props.data.title}
        </span>
        <button
          className="flex items-center justify-center w-8 h-8 rounded bg-zinc-900/80 text-zinc-300 hover:bg-zinc-900 shrink-0"
          onClick={contextMenuHandler}
        >
          <FontAwesomeIcon icon={faEllipsisVertical} className="w-5 h-5" />
        </button>
      </div>
      {modal}
    </div>
  )
}
