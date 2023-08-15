'use client'

import db from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useParams } from 'next/navigation'

export default function PlaylistDetailPage() {
  const params = useParams()

  const playlist = useLiveQuery(() => {
    try {
      const id = parseInt(params['id'] as string)
      return db.playlists.get(id)
    } catch (error) {
      console.error(error)
    }
  }, [params['id']])

  return (
    <div className="p-8">
      <section>
        <h3 className="text-3xl font-semibold text-zinc-300">
          {playlist?.title}
        </h3>
      </section>
    </div>
  )
}
