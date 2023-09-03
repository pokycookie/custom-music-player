import { IDBMusic } from '@/db'
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Check from './check'
import { delPlaylistMusic } from '@/utils/dexie'
import { useCurrentPlaylistStore } from '@/store/CurrentPlaylist'
import useContextMenu from '@/hooks/useContextMenu'
import { exportData } from '@/utils/fileSystem'
import { getOriginalSrc } from '@/utils/music'
import { useCurrentPlayMusicStore } from '@/store/currentPlayMusic'
import { MouseEvent } from 'react'
import useModal from '@/hooks/useModal'
import Caution from '../modal/caution'

interface IProps {
  data: IDBMusic
  index: number
  playlist?: number
}

export default function PlaylistMusicList(props: IProps) {
  const playlistAdd = useCurrentPlaylistStore((state) => state.add)
  const contextOpen = useContextMenu().open

  const currentPlayIdx = useCurrentPlayMusicStore((state) => state.index)

  const {
    modal: cautionModal,
    openModal: openCautionModal,
    closeModal: closeCautionModal,
    setContent: setCautionContent,
  } = useModal({
    autoClose: true,
    className: 'w-2/3 h-fit max-w-lg',
  })

  const contextMenuHandler = (e: MouseEvent) => {
    contextOpen(e, [
      { title: 'Play now', icon: faPlay, onClick: playNow },
      { title: 'Play next', icon: faForward, onClick: playNext },
      { title: 'Add to queue', icon: faLayerGroup, onClick: playLast },
      { title: 'Open original page', icon: faLink, onClick: openOriginal },
      { title: 'Export', icon: faFileExport, onClick: exportMusic },
      {
        title: 'Remove from this playlist',
        icon: faTrash,
        status: 'danger',
        onClick: deleteHandler,
      },
    ])
  }
  const playNow = () => playlistAdd(props.data, { restart: true, index: 0 })
  const playNext = () => {
    if (currentPlayIdx !== null) {
      playlistAdd(props.data, { restart: false, index: currentPlayIdx + 1 })
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
  const openOriginal = () => {
    window.open(getOriginalSrc(props.data), '_blank')
  }
  const exportMusic = () => {
    exportData({ musics: [props.data], playlists: [] })
  }
  const deleteHandler = async () => {
    if (!props.playlist) return

    setCautionContent(
      <Caution
        close={closeCautionModal}
        content={[
          `Are you sure you want to remove '${props.data.title}' from this playlist?`,
        ]}
        submitText="delete"
        onSubmit={async () => {
          if (!props.playlist) return
          await delPlaylistMusic(props.playlist, props.index)
          closeCautionModal()
        }}
      />
    )
    openCautionModal()
  }

  return (
    <li
      className="grid items-center w-full gap-5 p-2 rounded select-none grid-cols-musicList"
      onContextMenu={contextMenuHandler}
    >
      <Check checked={false} />
      <Image
        src={`https://i.ytimg.com/vi/${props.data.videoID}/original.jpg`}
        alt="thumbnail"
        width={800}
        height={800}
        className="object-cover w-12 rounded aspect-square"
        draggable={false}
      />
      <p className="overflow-hidden text-sm font-semibold text-zinc-400 whitespace-nowrap text-ellipsis">
        {props.data.title}
      </p>
      <p className="overflow-hidden text-xs text-zinc-400 whitespace-nowrap text-ellipsis">
        {props.data.artist}
      </p>
      <button
        className="flex items-center justify-center w-full h-full justify-self-center text-zinc-400 hover:text-zinc-300"
        onClick={playNow}
      >
        <FontAwesomeIcon icon={faPlay} className="w-4 h-4" />
      </button>
      <button
        className="flex items-center justify-center w-full h-full justify-self-center text-zinc-400 hover:text-zinc-300"
        onClick={deleteHandler}
      >
        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
      </button>
      <button
        className="flex items-center justify-center w-full h-full justify-self-center text-zinc-400 hover:text-zinc-300"
        onClick={contextMenuHandler}
      >
        <FontAwesomeIcon icon={faEllipsisVertical} className="w-5 h-5" />
      </button>
      {cautionModal}
    </li>
  )
}
