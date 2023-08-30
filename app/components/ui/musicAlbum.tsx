import { IDBMusic } from '@/db'
import { useCurrentPlaylistStore } from '@/store/CurrentPlaylist'
import ImageWithFallback from './imageWithFallback'
import { MouseEvent } from 'react'
import useContextMenu from '@/hooks/useContextMenu'
import {
  faEdit,
  faEllipsisVertical,
  faFileExport,
  faForward,
  faLayerGroup,
  faLink,
  faPlay,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { useCurrentPlayMusicStore } from '@/store/currentPlayMusic'
import useModal from '@/hooks/useModal'
import ChoosePlaylist from '../modal/choosePlaylist'
import { getOriginalSrc } from '@/utils/music'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { exportData } from '@/utils/fileSystem'
import EditMusic from '../modal/editMusic'

interface IProps {
  data: IDBMusic
}

export default function MusicAlbum(props: IProps) {
  const playlistAdd = useCurrentPlaylistStore((state) => state.add)
  const startDrag = useCurrentPlaylistStore((state) => state.startDrag)
  const contextOpen = useContextMenu().open

  const currentPlayIdx = useCurrentPlayMusicStore((state) => state.index)

  const {
    modal: playlistModal,
    openModal: openPlaylistModal,
    closeModal: closePlaylistModal,
    setContent: setPlaylistContent,
  } = useModal({
    autoClose: true,
    className: 'w-2/3 h-fit max-w-lg',
  })

  const {
    modal: editModal,
    openModal: openEditModal,
    closeModal: closeEditModal,
    setContent: setEditContent,
  } = useModal({
    autoClose: false,
    className: 'w-2/3 h-fit max-w-lg',
  })

  const contextMenuHandler = (e: MouseEvent) => {
    contextOpen(e, [
      { title: 'Play now', icon: faPlay, onClick: playNow },
      { title: 'Play next', icon: faForward, onClick: playNext },
      { title: 'Add to queue', icon: faLayerGroup, onClick: playLast },
      { title: 'Add to playlist', icon: faPlus, onClick: playlistHandler },
      { title: 'Open original page', icon: faLink, onClick: openOriginal },
      { title: 'Export', icon: faFileExport, onClick: exportMusic },
      { title: 'Edit', icon: faEdit, onClick: editHandler },
      { title: 'Delete', icon: faTrash, status: 'danger' },
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
    setPlaylistContent(
      <ChoosePlaylist close={closePlaylistModal} musics={[props.data.id]} />
    )
    openPlaylistModal()
  }
  const openOriginal = () => {
    window.open(getOriginalSrc(props.data), '_blank')
  }
  const exportMusic = () => {
    exportData({ musics: [props.data], playlists: [] })
  }
  const editHandler = () => {
    setEditContent(
      <EditMusic
        close={closeEditModal}
        id={props.data.id}
        title={props.data.title}
        artist={props.data.artist}
        tags={props.data.tags}
      />
    )
    openEditModal()
  }

  return (
    <div
      className="relative flex items-center justify-center w-full h-full p-1 overflow-hidden rounded select-none group bg-zinc-800"
      onMouseDown={dndHandler}
      onContextMenu={contextMenuHandler}
    >
      <div className="w-full overflow-hidden">
        <ImageWithFallback
          src={`https://i.ytimg.com/vi/${props.data.videoID}/original.jpg`}
          fallback={`https://img.youtube.com/vi/${props.data.videoID}/0.jpg`}
          alt="thumbnail"
          width={800}
          height={800}
          className="object-cover w-full transition-all rounded aspect-square group-hover:scale-125"
          draggable={false}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full p-2 bg-zinc-900/90">
        <p className="w-full max-w-full mb-1 overflow-hidden text-sm text-gray-300 whitespace-nowrap text-ellipsis shrink">
          {props.data.title}
        </p>
        <p className="w-full max-w-full overflow-hidden text-xs text-gray-400 whitespace-nowrap text-ellipsis shrink">
          {props.data.artist}
        </p>
      </div>
      <button
        className="absolute flex items-center justify-center invisible w-8 h-8 rounded group-hover:visible top-2 right-2 bg-zinc-900/80 text-zinc-300 hover:bg-zinc-900 shrink-0"
        onClick={contextMenuHandler}
      >
        <FontAwesomeIcon icon={faEllipsisVertical} className="w-5 h-5" />
      </button>
      <button
        className="absolute invisible w-12 h-12 rounded-full group-hover:visible bg-zinc-900/90 hover:text-zinc-200 hover:bg-zinc-900"
        onClick={playNow}
      >
        <FontAwesomeIcon icon={faPlay} className="w-4 h-4 text-zinc-300" />
      </button>
      {playlistModal}
      {editModal}
    </div>
  )
}
