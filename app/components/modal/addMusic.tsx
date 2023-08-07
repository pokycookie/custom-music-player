'use client'

import { useState } from 'react'
import LabelInput from '../ui/labelInput'
import { validateURL } from '@/utils/validateInput'
import { ICreateMusic, createMusic } from '@/utils/dexie'
import TimeInput from '../ui/timeInput'
import ToggleSection from '../ui/toggleSection'
import TagInput from '../ui/tagInput'
import Tag from '../ui/tag'

interface IProps {
  close: () => void
}

export default function AddMusic(props: IProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [tags, setTags] = useState<Set<string>>(new Set())
  const [tagsOptions, setTagsOptions] = useState(false)
  const [timeOptions, setTimeOptions] = useState(false)

  const addHandler = async () => {
    const data: ICreateMusic = { title, artist, url }

    if (timeOptions && startTime) data.start = startTime
    if (timeOptions && endTime) data.end = endTime
    if (tagsOptions && tags.size > 0) data.tags = Array.from(tags)

    if (await createMusic(data)) props.close()
  }

  const addTagHandler = (tag: string) => {
    setTags((prev) => {
      const newSet = new Set(prev)
      newSet.add(tag)
      return newSet
    })
  }

  const delTagHandler = (tag: string) => {
    setTags((prev) => {
      const newSet = new Set(prev)
      newSet.delete(tag)
      return newSet
    })
  }

  return (
    <article className="flex flex-col justify-between w-full h-full p-4 rounded-md bg-zinc-800">
      <h2 className="mb-3 ml-2 text-lg font-semibold text-gray-400">
        Add New Music
      </h2>
      <section className="flex flex-col gap-3 mb-6">
        <LabelInput
          lable="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <LabelInput
          lable="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <LabelInput
          lable="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          info={validateURL(url)}
        />
        <ToggleSection
          title="tags"
          open={tagsOptions}
          onChange={() => setTagsOptions((prev) => !prev)}
        >
          <ul className="flex flex-wrap gap-2">
            {Array.from(tags).map((tag, i) => {
              return <Tag key={i} tagName={tag} onDelete={delTagHandler} />
            })}
            <TagInput onSubmit={addTagHandler} />
          </ul>
        </ToggleSection>
        <ToggleSection
          title="time options"
          open={timeOptions}
          onChange={() => setTimeOptions((prev) => !prev)}
        >
          <div className="flex gap-3">
            <TimeInput unit="start" onChange={(v) => setStartTime(v)} />
            <TimeInput unit="end" onChange={(v) => setEndTime(v)} />
          </div>
        </ToggleSection>
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
