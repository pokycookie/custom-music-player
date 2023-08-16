'use client'

import MusicAlbum from '@/components/ui/musicAlbum'
import db from '@/db'
import useResize from '@/hooks/useResize'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRef, useState } from 'react'
import styled from '@emotion/styled'
import TagInput from '@/components/ui/tagInput'
import useTagInput from '@/hooks/useTagInput'
import Tag from '@/components/ui/tag'
import Dropdown from '@/components/ui/dropdown'

export default function SearchPage() {
  const [wrapCount, setWrapCount] = useState(0)
  const [tagOption, setTagOption] = useState<'or' | 'and'>('or')

  const ulREF = useRef<HTMLUListElement>(null)

  const { tags: selectedTags, addTagHandler, delTagHandler } = useTagInput()

  const result = useLiveQuery(() => {
    return db.musics
      .filter((music) => {
        const tags = new Set(music.tags)
        for (const tag of Array.from(selectedTags)) {
          if (tags.has(tag)) return true
        }
        return false
      })
      .toArray()
  }, [selectedTags])

  useResize(() => {
    if (!ulREF.current) return
    const rect = ulREF.current.getBoundingClientRect()
    const minWidth = 176 // w-44 11rem 176px
    setWrapCount(Math.floor(rect.width / minWidth))
  })

  return (
    <div className="p-8">
      <section className="mb-7">
        <div className="flex items-center justify-between w-full gap-3 p-2 pl-3 mb-2 text-sm text-gray-400 border [border-radius:5px_26px_26px_5px] outline-1 focus-within:outline outline-purple-400 border-zinc-600 bg-zinc-900">
          <input type="text" className="w-full bg-transparent outline-none" />
          <button className="flex items-center justify-center p-2 border rounded-full border-zinc-600 bg-zinc-900 hover:bg-zinc-800">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="w-4 h-4 text-zinc-400"
            />
          </button>
        </div>
        <div className="w-[calc(100%-26px)] mb-3 flex gap-2">
          <div className="w-28 shrink-0">
            <Dropdown value={tagOption.toUpperCase()} autoClose>
              <button
                className="w-full h-8 p-1 pl-2 pr-2 text-sm uppercase text-zinc-400 hover:bg-zinc-700"
                onClick={() => setTagOption('or')}
              >
                or
              </button>
              <button
                className="w-full h-8 p-1 pl-2 pr-2 text-sm uppercase text-zinc-400 hover:bg-zinc-700"
                onClick={() => setTagOption('and')}
              >
                and
              </button>
            </Dropdown>
          </div>
          <TagInput onSubmit={addTagHandler} />
        </div>
        <ul className="flex flex-wrap gap-1">
          {Array.from(selectedTags)?.map((tag, i) => {
            return <Tag key={i} tagName={tag} onDelete={delTagHandler} />
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
