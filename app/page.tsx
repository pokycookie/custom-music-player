'use client'

import { useEffect, useState } from 'react'
import Carousel from './components/ui/carousel'
import db, { IDBMusic } from './db'
import MusicAlbum from './components/ui/musicAlbum'

export default function Home() {
  const [musics, setMusics] = useState<IDBMusic[]>([])

  useEffect(() => {
    const getMusics = async () => {
      const musics = await db.musics.toArray()
      setMusics(musics)
    }
    getMusics()
  }, [])

  return (
    <>
      <Carousel showCount={4} aspectRatio={1 / 1.5}>
        {musics.map((e, i) => {
          return <MusicAlbum key={i} data={e} />
        })}
      </Carousel>
      <Carousel showCount={4} aspectRatio={1 / 1.5}>
        {musics.map((e, i) => {
          return <MusicAlbum key={i} data={e} />
        })}
      </Carousel>
    </>
  )
}
