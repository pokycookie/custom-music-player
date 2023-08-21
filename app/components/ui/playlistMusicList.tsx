import { IDBMusic } from '@/db'
import {
  faEllipsisVertical,
  faPlay,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Check from './check'
import { delPlaylistMusic } from '@/utils/dexie'
import { useCurrentPlaylistStore } from '@/store/CurrentPlaylist'

interface IProps {
  data: IDBMusic
  index: number
  playlist?: number
}

export default function PlaylistMusicList(props: IProps) {
  const cps = useCurrentPlaylistStore()

  const playHandler = () => {
    cps.add(props.data, { index: 0, restart: true })
  }

  const deleteHandler = async () => {
    if (props.playlist) {
      delPlaylistMusic(props.playlist, props.index)
    }
  }

  return (
    <li className="grid items-center w-full gap-5 p-2 rounded select-none grid-cols-musicList">
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
        onClick={playHandler}
      >
        <FontAwesomeIcon icon={faPlay} className="w-4 h-4" />
      </button>
      <button
        className="flex items-center justify-center w-full h-full justify-self-center text-zinc-400 hover:text-zinc-300"
        onClick={deleteHandler}
      >
        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
      </button>
      <button className="flex items-center justify-center w-full h-full justify-self-center text-zinc-400 hover:text-zinc-300">
        <FontAwesomeIcon icon={faEllipsisVertical} className="w-5 h-5" />
      </button>
    </li>
  )
}
