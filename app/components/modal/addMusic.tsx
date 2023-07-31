'use client'

import { useState } from 'react'
import LabelInput from '../ui/labelInput'
import { validateURL } from '@/utils/validateInput'
import { createMusic } from '@/utils/dexie'

interface IProps {
  close: () => void
}

export default function AddMusic(props: IProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  const addHandler = () => {
    if (createMusic(url, title, artist)) props.close()
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
        <div className="flex gap-3">
          {/* <LabelInput
            lable="Start time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <LabelInput
            lable="End time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          /> */}
        </div>
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
