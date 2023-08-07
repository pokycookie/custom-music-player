'use client'

import { KeyboardEvent, useMemo, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import styled from '@emotion/styled'
import db from '@/db'

interface IProps {
  onSubmit?: (tag: string) => void
}

export default function TagInput(props: IProps) {
  const [value, setValue] = useState('')
  const [focus, setFocus] = useState(false)
  const [dropdownIdx, setDropDownIdx] = useState(0)

  const wrapperREF = useRef<HTMLDivElement>(null)
  const ulREF = useRef<HTMLUListElement>(null)

  const tags = useLiveQuery(() => {
    return db.tags.toArray()
  })

  const tagOptions = useMemo(() => {
    setDropDownIdx(0)
    if (!tags) return []
    const result = tags
      .filter((tag) =>
        tag.tagName.trim().toLowerCase().includes(value.trim().toLowerCase())
      )
      .map((e) => ({ tagName: e.tagName, created: false }))

    if (!result.some((e) => e.tagName === value) && value.trim().length > 0)
      result.splice(0, 0, { tagName: value, created: true })

    return result
  }, [tags, value])

  const keyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.key

    if (e.key === 'Enter') {
      if (props.onSubmit) props.onSubmit(tagOptions[dropdownIdx].tagName)
      setValue('')
    }

    if (key === 'ArrowUp') {
      e.preventDefault()
      setDropDownIdx((prev) => {
        const nextIdx = Math.max(0, prev - 1)
        if (ulREF.current) {
          const li = ulREF.current.childNodes[nextIdx] as HTMLLIElement
          li.scrollIntoView()
        }
        return nextIdx
      })
    }
    if (key === 'ArrowDown') {
      e.preventDefault()
      setDropDownIdx((prev) => {
        const nextIdx = Math.min(tagOptions.length - 1, prev + 1)
        if (ulREF.current) {
          const li = ulREF.current.childNodes[nextIdx] as HTMLLIElement
          li.scrollIntoView()
        }
        return nextIdx
      })
    }
  }

  return (
    <div className="relative w-full" ref={wrapperREF}>
      <div className="flex w-full gap-1 p-2 pl-3 pr-3 text-sm text-gray-400 border rounded-md outline-1 focus-within:outline outline-purple-400 border-zinc-600 bg-zinc-900">
        <span>#</span>
        <input
          className="w-full bg-transparent outline-none"
          value={value}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={keyDownHandler}
        />
      </div>
      <motion.ul
        ref={ulREF}
        initial={{ height: 0, border: 'none' }}
        animate={{
          height: focus ? 'auto' : 0,
          border: focus ? 'solid 1px #52525b' : 'solid 0px transparent',
        }}
        transition={{ delay: 0.1 }}
        className="absolute w-full overflow-x-hidden overflow-y-auto rounded max-h-40 bg-zinc-900 top-11"
      >
        {tagOptions.map((tag, i) => {
          return (
            <TagList
              key={i}
              className="w-full p-2 pl-3 pr-3 text-sm cursor-pointer text-zinc-400 h-9 hover:bg-zinc-700"
              selected={dropdownIdx === i}
              onClick={(e) => {
                e.stopPropagation()
                setValue(tag.tagName)
              }}
            >
              {tag.created ? '(new) ' : ''}# {tag.tagName}
            </TagList>
          )
        })}
      </motion.ul>
    </div>
  )
}

const TagList = styled.li<{ selected: boolean }>((props) => ({
  backgroundColor: props.selected ? '#3f3f46' : 'transparent',
}))
