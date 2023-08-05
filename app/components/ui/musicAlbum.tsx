import { IDBMusic } from '@/db'
import { useCurrentPlaylistStore } from '@/store/CurrentPlaylist'
import Image from 'next/image'

interface IProps {
  data: IDBMusic
}

export default function MusicAlbum(props: IProps) {
  const cps = useCurrentPlaylistStore()

  const doubleClickHandler = () => {
    cps.add(props.data, { restart: true, index: 0 })
  }

  return (
    <div
      className="w-full h-full p-2 rounded select-none bg-zinc-800"
      onDoubleClick={doubleClickHandler}
    >
      <Image
        src={`https://i.ytimg.com/vi/${props.data.videoID}/original.jpg`}
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
