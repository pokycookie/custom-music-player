'use client'

import { useEffect, useState } from 'react'
import LabelInput from '../ui/labelInput'
import TagInput from '../ui/tagInput'
import useTagInput from '@/hooks/useTagInput'
import Tag from '../ui/tag'
import db from '@/db'

interface IProps {
  close: () => void
  id: number
  title: string
  tags?: string[]
}

export default function EditPlaylist(props: IProps) {
  const [title, setTitle] = useState(props.title)

  const { tags, addTagHandler, delTagHandler } = useTagInput()

  useEffect(() => {
    if (!props.tags) return
    for (const tag of props.tags) addTagHandler(tag)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tags])

  const editHandler = async () => {
    try {
      await db.playlists.update(props.id, { title, tags: Array.from(tags) })
      props.close()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <article className="flex flex-col justify-between w-full h-full p-4 rounded-md bg-zinc-800">
      <h2 className="mb-3 ml-2 text-lg font-semibold text-gray-400">
        Edit Playlist
      </h2>
      <section className="mb-6">
        <div className="mb-2">
          <LabelInput
            lable="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <TagInput onSubmit={addTagHandler} />
        <ul className="flex flex-wrap gap-2 mt-2">
          {Array.from(tags).map((tag, i) => {
            return <Tag key={i} tagName={tag} onDelete={delTagHandler} />
          })}
        </ul>
      </section>
      <section className="flex justify-end gap-2">
        <button
          className="p-2 pl-3 pr-3 text-sm text-gray-400 uppercase rounded bg-zinc-900 hover:bg-zinc-700"
          onClick={props.close}
        >
          cancel
        </button>
        <button
          className="p-2 pl-3 pr-3 text-sm text-gray-400 uppercase border border-transparent rounded bg-zinc-900 hover:bg-zinc-700 hover:border-purple-600 outline-purple-600"
          onClick={editHandler}
        >
          update
        </button>
      </section>
    </article>
  )
}
