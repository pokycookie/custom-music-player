import { IDBMusic } from '@/db'
import Image from 'next/image'

interface IProps {
  musics: IDBMusic[]
}

export default function PlaylistCover(props: IProps) {
  return (
    <div className="flex flex-wrap w-full h-full overflow-hidden rounded bg-zinc-600 shrink-0">
      {props.musics.slice(0, 4).map((music, i) => {
        return (
          <Image
            src={`https://i.ytimg.com/vi/${music.videoID}/original.jpg`}
            alt="thumbnail"
            width={800}
            height={800}
            className="object-cover w-1/2 grow aspect-square"
            draggable={false}
            key={i}
          />
        )
      })}
    </div>
  )
}
