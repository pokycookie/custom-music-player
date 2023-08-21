'use client'

import useTagInput from '@/hooks/useTagInput'
import { createPlaylist } from '@/utils/dexie'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import TagInput from '../ui/tagInput'
import Tag from '../ui/tag'
import LabelInput from '../ui/labelInput'

interface IProps {
  close: () => void
}

export default function AddPlaylist(props: IProps) {
  const router = useRouter()

  const [title, setTitle] = useState('')

  const { tags, addTagHandler, delTagHandler } = useTagInput()

  const addHandler = async () => {
    const key = await createPlaylist({
      title: title.trim() !== '' ? title : undefined,
      tags: tags.size !== 0 ? Array.from(tags) : undefined,
    })
    if (key) router.push(`/playlist/${key}`)
  }

  return (
    <article className="flex flex-col justify-between w-full h-full p-4 rounded-md bg-zinc-800">
      <h2 className="mb-3 ml-2 text-lg font-semibold text-gray-400">
        Add New Playlist
      </h2>
      <section className="mb-6">
        <div className="mb-2">
          <LabelInput
            lable="Playlist title"
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
          onClick={addHandler}
        >
          add
        </button>
      </section>
    </article>
  )
}
