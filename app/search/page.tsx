'use client'

import MusicAlbum from '@/components/ui/musicAlbum'
import ToggleTag from '@/components/ui/toggleTag'
import db from '@/db'
import useResize from '@/hooks/useResize'
import useToggleTag from '@/hooks/useToggleTag'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRef, useState } from 'react'
import styled from '@emotion/styled'

export default function SearchPage() {
  const [wrapCount, setWrapCount] = useState(0)

  const ulREF = useRef<HTMLUListElement>(null)

  const tags = useLiveQuery(() => db.tags.toArray())
  const selectedTags = useToggleTag()

  const result = useLiveQuery(() => {
    return db.musics
      .filter((music) => {
        const tags = new Set(music.tags)
        for (const tag of Array.from(selectedTags.tags)) {
          if (tags.has(tag)) return true
        }
        return false
      })
      .toArray()
  }, [selectedTags.tags])

  useResize(() => {
    if (!ulREF.current) return
    const rect = ulREF.current.getBoundingClientRect()
    const minWidth = 176 // w-44 11rem 176px
    setWrapCount(Math.floor(rect.width / minWidth))
  })

  return (
    <div className="p-8">
      <section className="mb-7">
        <div className="flex items-center justify-between w-full gap-3 p-2 pl-3 mb-4 text-sm text-gray-400 border [border-radius:5px_26px_26px_5px] outline-1 focus-within:outline outline-purple-400 border-zinc-600 bg-zinc-900">
          <input type="text" className="w-full bg-transparent outline-none" />
          <button className="flex items-center justify-center p-2 border rounded-full border-zinc-600 bg-zinc-900 hover:bg-zinc-800">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="w-4 h-4 text-zinc-400"
            />
          </button>
        </div>
        <ul className="flex flex-wrap gap-1">
          {tags?.map((e) => {
            return (
              <ToggleTag
                key={e.tagName}
                tagName={e.tagName}
                selected={selectedTags.tags.has(e.tagName)}
                onChange={selectedTags.toggle}
              />
            )
          }) ?? null}
        </ul>
      </section>
      <section>
        <ul className="flex flex-wrap" ref={ulREF}>
          {result?.map((music, i) => {
            return (
              <WrapLi key={i} className="p-1 w-44 grow" wrapCount={wrapCount}>
                <MusicAlbum data={music} />
              </WrapLi>
            )
          }) ?? null}
        </ul>
      </section>
    </div>
  )
}

const WrapLi = styled.li<{ wrapCount: number }>((props) => ({
  maxWidth: `${100 / props.wrapCount}%`,
}))
