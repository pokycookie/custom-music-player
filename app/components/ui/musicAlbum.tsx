import { IDBMusic } from '@/db'
import { useCurrentPlaylistStore } from '@/store/CurrentPlaylist'
import ImageWithFallback from './imageWithFallback'
import { MouseEvent } from 'react'
import useContextMenu from '@/hooks/useContextMenu'
import {
  faEdit,
  faForward,
  faLayerGroup,
  faLink,
  faPlay,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { useCurrentPlayMusicStore } from '@/store/currentPlayMusic'
import useModal from '@/hooks/useModal'
import ChoosePlaylist from '../modal/choosePlaylist'
import { getOriginalSrc } from '@/utils/music'

interface IProps {
  data: IDBMusic
}

export default function MusicAlbum(props: IProps) {
  const playlistAdd = useCurrentPlaylistStore((state) => state.add)
  const startDrag = useCurrentPlaylistStore((state) => state.startDrag)
  const contextOpen = useContextMenu().open

  const currentPlayIdx = useCurrentPlayMusicStore((state) => state.index)

  const { modal, openModal, closeModal, setContent } = useModal({
    autoClose: true,
    className: 'w-2/3 h-fit max-w-lg',
  })

  const contextMenuHandler = (e: MouseEvent) => {
    contextOpen(e, [
      { title: 'Play now', icon: faPlay, onClick: playNow },
      { title: 'Play next', icon: faForward, onClick: playNext },
      { title: 'Add to queue', icon: faLayerGroup, onClick: playLast },
      { title: 'Add to playlist', icon: faPlus, onClick: playlistHandler },
      { title: 'Open original page', icon: faLink, onClick: openOriginal },
      { title: 'Edit', icon: faEdit },
    ])
  }

  const dndHandler = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (e.button === 0) startDrag(props.data)
  }

  const playNow = () => playlistAdd(props.data, { restart: true, index: 0 })
  const playNext = () => {
    if (currentPlayIdx !== null) {
      playlistAdd(props.data, { restart: false })
    } else {
      playNow()
    }
  }
  const playLast = () => {
    if (currentPlayIdx !== null) {
      playlistAdd(props.data, { restart: false })
    } else {
      playNow()
    }
  }
  const playlistHandler = () => {
    setContent(<ChoosePlaylist close={closeModal} musics={[props.data.id]} />)
    openModal()
  }
  const openOriginal = () => {
    window.open(getOriginalSrc(props.data), '_blank')
  }

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
      {modal}
    </div>
  )
}
