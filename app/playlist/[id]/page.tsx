'use client'

import Check from '@/components/ui/check'
import MusicList from '@/components/ui/musicList'
import PlaylistCover from '@/components/ui/playlistCover'
import PlaylistMusicList from '@/components/ui/playlistMusicList'
import Tag from '@/components/ui/tag'
import TagInput from '@/components/ui/tagInput'
import db, { IDBMusic } from '@/db'
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
  const [musics, setMusics] = useState<IDBMusic[]>([])

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

  const tagDeleteHandler = async (tagName: string) => {
    try {
      const id = parseInt(params['id'] as string)
      const tags = new Set((await db.playlists.get(id))?.tags)
      tags.delete(tagName)
      db.playlists.update(id, { tags: Array.from(tags) })
    } catch (error) {
      console.error(error)
    }
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

  useEffect(() => {
    const getMusics = async () => {
      if (!playlist?.musics) return
      const tmpMusics: IDBMusic[] = []
      for (const id of playlist.musics) {
        try {
          const music = await db.musics.get(id)
          if (music) tmpMusics.push(music)
        } catch (error) {
          console.error(error)
        }
      }
      setMusics(tmpMusics)
    }
    getMusics()
  }, [playlist?.musics])

  return (
    <div className="w-full p-8">
      <section className="w-full mb-5">
        <div className="flex w-full gap-5">
          {/* <div className="overflow-hidden rounded w-44 h-44 bg-zinc-800 shrink-0"></div> */}
          <PlaylistCover musics={musics} />
          <div className="overflow-hidden grow">
            {editTitle ? (
              <input
                type="text"
                value={title}
                className="w-full pb-1 text-3xl font-semibold bg-transparent border-b outline-none border-zinc-300 text-zinc-400"
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={titleSubmitHandler}
                onBlur={titleCancelHandler}
                autoFocus
              />
            ) : (
              <h3
                className="w-full pb-1 overflow-hidden text-3xl font-semibold border-b border-transparent cursor-pointer hover:underline text-zinc-300 text-ellipsis whitespace-nowrap"
                onClick={() => setEditTitle(true)}
              >
                {playlist?.title}
              </h3>
            )}
          </div>
        </div>
        <ul className="flex flex-wrap gap-2 mt-4">
          {playlist?.tags.map((tag, i) => {
            return <Tag key={i} tagName={tag} onDelete={tagDeleteHandler} />
          })}
        </ul>
      </section>
      <section className="mb-5">
        <h4 className="mb-3 ml-1 text-lg font-semibold text-zinc-400">
          Playlist
        </h4>
        <ul className="flex flex-col gap-1 p-3 border rounded-md border-zinc-600 bg-zinc-800">
          {musics.length > 0 ? (
            musics.map((music, i) => {
              return (
                <PlaylistMusicList
                  key={i}
                  data={music}
                  index={i}
                  playlist={playlist?.id!}
                />
              )
            })
          ) : (
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
