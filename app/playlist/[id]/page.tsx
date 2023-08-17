'use client'

import Check from '@/components/ui/check'
import MusicList from '@/components/ui/musicList'
import Tag from '@/components/ui/tag'
import TagInput from '@/components/ui/tagInput'
import db from '@/db'
import useTagInput from '@/hooks/useTagInput'
import {
  faFaceSadTear,
  faFolderOpen,
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLiveQuery } from 'dexie-react-hooks'
import { useParams } from 'next/navigation'
import { KeyboardEvent, useEffect, useState } from 'react'

export default function PlaylistDetailPage() {
  const [editTitle, setEditTitle] = useState(false)
  const [title, setTitle] = useState('')

  const params = useParams()
  const { tags: selectedTags, addTagHandler, delTagHandler } = useTagInput()

  const titleSubmitHandler = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (!playlist) return
    if (e.key !== 'Enter') return
    try {
      await db.playlists.update(playlist.id!, { title })
      setEditTitle(false)
    } catch (error) {
      console.error(error)
    }
  }

  const titleCancelHandler = () => {
    setTitle(playlist?.title ?? '')
    setEditTitle(false)
  }

  const playlist = useLiveQuery(() => {
    try {
      const id = parseInt(params['id'] as string)
      return db.playlists.get(id)
    } catch (error) {
      console.error(error)
    }
  }, [params['id']])

  const searchResult = useLiveQuery(() => {
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

  useEffect(() => {
    if (playlist?.title) setTitle(playlist?.title)
  }, [playlist?.title])

  return (
    <div className="p-8">
      <section className="mb-3">
        {editTitle ? (
          <input
            type="text"
            value={title}
            className="pb-1 text-3xl font-semibold bg-transparent border-b outline-none border-zinc-300 text-zinc-400 w-72"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={titleSubmitHandler}
            onBlur={titleCancelHandler}
            autoFocus
          />
        ) : (
          <h3
            className="text-3xl font-semibold cursor-pointer hover:underline text-zinc-300 w-fit"
            onClick={() => setEditTitle(true)}
          >
            {playlist?.title}
          </h3>
        )}
      </section>
      <section className="mb-5">
        <h4 className="mb-3 ml-1 text-lg font-semibold text-zinc-400">
          Playlist
        </h4>
        <ul className="flex flex-col gap-1 border rounded-md border-zinc-600 bg-zinc-800">
          {playlist && playlist.musics.length > 0 ? null : (
            <li className="flex flex-col items-center justify-center w-full gap-4 text-zinc-400 h-52">
              <FontAwesomeIcon icon={faFolderOpen} className="w-20 h-20" />
              <p>The playlist is empty</p>
            </li>
          )}
        </ul>
      </section>
      <section>
        <h4 className="mb-3 ml-1 text-lg font-semibold text-zinc-400">
          Add Music
        </h4>
        <TagInput onSubmit={addTagHandler} />
        <ul className="flex flex-wrap gap-1 mt-2 mb-5 ">
          {Array.from(selectedTags)?.map((tag, i) => {
            return <Tag key={i} tagName={tag} onDelete={delTagHandler} />
          }) ?? null}
        </ul>
        <ul className="flex flex-col gap-1 p-3 border rounded-md border-zinc-600 bg-zinc-800">
          {searchResult && searchResult.length > 0 ? (
            <>
              <li className="grid items-center w-full gap-5 p-2 mb-1 text-sm border-b select-none h-14 border-zinc-600 text-zinc-400 grid-cols-musicList">
                <Check checked={false} />
                <p></p>
                <p>Title</p>
                <p>Artist</p>
              </li>
              {searchResult.map((music, i) => {
                return (
                  <MusicList
                    key={i}
                    data={music}
                    defaultPlaylist={playlist?.id!}
                  />
                )
              })}
            </>
          ) : (
            <li className="flex flex-col items-center justify-center w-full gap-4 text-zinc-400 h-52">
              <FontAwesomeIcon icon={faFaceSadTear} className="w-20 h-20" />
              <p>No search results found</p>
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}
