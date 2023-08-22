'use client'

import { useEffect, useState } from 'react'
import Carousel from './components/ui/carousel'
import db, { IDBMusic } from './db'
import MusicAlbum from './components/ui/musicAlbum'
import { useLiveQuery } from 'dexie-react-hooks'

export default function Home() {
  const [musics, setMusics] = useState<IDBMusic[]>([])

  const dbMusics = useLiveQuery(() => db.musics.toArray())

  useEffect(() => {
    setMusics(dbMusics ?? [])
  }, [dbMusics])

  return (
    <article className="p-8">
      <div className="pl-2 pr-2">
        <Carousel showCount={4}>
          {musics.map((e, i) => {
            return <MusicAlbum key={i} data={e} />
          })}
        </Carousel>
        <Carousel showCount={4}>
          {musics.map((e, i) => {
            return <MusicAlbum key={i} data={e} />
          })}
        </Carousel>
      </div>
    </article>
  )
}
