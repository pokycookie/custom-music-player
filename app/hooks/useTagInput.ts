import { useState } from 'react'

export default function useTagInput() {
  const [tags, setTags] = useState<Set<string>>(new Set())

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

  return { tags, addTagHandler, delTagHandler }
}
