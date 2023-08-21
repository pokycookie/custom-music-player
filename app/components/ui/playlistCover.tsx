import { IDBMusic } from '@/db'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface IProps {
  musics: IDBMusic[]
}

export default function PlaylistCover(props: IProps) {
  const [videoID, setVideoID] = useState<string[]>([])

  useEffect(() => {
    if (props.musics.length >= 4)
      setVideoID(props.musics.slice(0, 4).map((e) => e.videoID))
    else if (props.musics.length >= 2)
      setVideoID(props.musics.slice(0, 2).map((e) => e.videoID))
    else if (props.musics.length === 1)
      setVideoID(props.musics.slice(0, 1).map((e) => e.videoID))
  }, [props.musics])

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded w-44 h-44 bg-zinc-800 shrink-0">
      {videoID.map((id, i) => {
        return (
          <Image
            src={`https://i.ytimg.com/vi/${id}/original.jpg`}
            alt="thumbnail"
            width={800}
            height={800}
            className="object-cover w-full rounded aspect-square"
            draggable={false}
            key={i}
          />
        )
      })}
    </div>
  )
}
