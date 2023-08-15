import { useState } from 'react'

export default function useToggleTag() {
  const [tags, setTags] = useState<Set<string>>(new Set())

  const toggle = (tagName: string) => {
    setTags((prev) => {
      const tmpSet = new Set(prev)
      if (tmpSet.has(tagName)) tmpSet.delete(tagName)
      else tmpSet.add(tagName)
      return tmpSet
    })
  }

  return { tags, toggle }
}
