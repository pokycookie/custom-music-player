import { IDBMusic } from '@/db'
import { useCurrentPlaylistStore } from '@/store/CurrentPlaylist'
import ImageWithFallback from './imageWithFallback'
import { MouseEvent } from 'react'
import useContextMenu from '@/hooks/useContextMenu'
import {
  faEdit,
  faForward,
  faPlay,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'

interface IProps {
  data: IDBMusic
}

export default function MusicAlbum(props: IProps) {
  const playlistAdd = useCurrentPlaylistStore((state) => state.add)
  const startDrag = useCurrentPlaylistStore((state) => state.startDrag)
  const contextOpen = useContextMenu().open

  const contextMenuHandler = (e: MouseEvent) => {
    contextOpen(e, [
      { title: 'Play now', icon: faPlay, onClick: playNow },
      { title: 'Play next', icon: faForward },
      { title: 'Add to playlist', icon: faPlus },
      { title: 'Edit', icon: faEdit },
    ])
  }

  const dndHandler = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (e.button === 0) startDrag(props.data)
  }

  const playNow = () => playlistAdd(props.data, { restart: true, index: 0 })
  const playNext = () => playlistAdd(props.data, { restart: false })

  return (
    <div
      className="w-full h-full p-2 rounded select-none bg-zinc-800"
      onDoubleClick={playNow}
      onMouseDown={dndHandler}
      onContextMenu={contextMenuHandler}
    >
      <ImageWithFallback
        src={`https://i.ytimg.com/vi/${props.data.videoID}/original.jpg`}
        fallback={`https://img.youtube.com/vi/${props.data.videoID}/0.jpg`}
        alt="thumbnail"
        width={800}
        height={800}
        className="object-cover w-full mb-3 rounded aspect-square"
        draggable={false}
      />
      <p className="w-full max-w-full mb-1 overflow-hidden text-sm text-gray-400 whitespace-nowrap text-ellipsis shrink">
        {props.data.title}
      </p>
      <p className="w-full max-w-full mb-2 overflow-hidden text-xs text-gray-500 whitespace-nowrap text-ellipsis shrink">
        {props.data.artist}
      </p>
    </div>
  )
}
