'use client'

import EditPlaylist from '@/components/modal/editPlaylist'
import Carousel from '@/components/ui/carousel'
import Check from '@/components/ui/check'
import MusicAlbum from '@/components/ui/musicAlbum'
import MusicList from '@/components/ui/musicList'
import PlaylistCover from '@/components/ui/playlistCover'
import PlaylistMusicList from '@/components/ui/playlistMusicList'
import Tag from '@/components/ui/tag'
import TagInput from '@/components/ui/tagInput'
import db, { IDBMusic } from '@/db'
import useModal from '@/hooks/useModal'
import useTagInput from '@/hooks/useTagInput'
import { useCurrentPlaylistStore } from '@/store/CurrentPlaylist'
import {
  faFaceSadTear,
  faFolderOpen,
} from '@fortawesome/free-regular-svg-icons'
import {
  faArrowLeft,
  faPen,
  faPlay,
  faShuffle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLiveQuery } from 'dexie-react-hooks'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { KeyboardEvent, useEffect, useState } from 'react'

export default function PlaylistDetailPage() {
  const [editTitle, setEditTitle] = useState(false)
  const [title, setTitle] = useState('')
  const [musics, setMusics] = useState<IDBMusic[]>([])

  const replace = useCurrentPlaylistStore((state) => state.replace)
  const params = useParams()
  const { tags: selectedTags, addTagHandler, delTagHandler } = useTagInput()

  const { modal, openModal, closeModal, setContent } = useModal({
    autoClose: false,
    className: 'w-2/3 h-fit max-w-lg',
  })

  const titleSubmitHandler = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (!playlist) return
    if (e.key !== 'Enter') return
    if (title.trim() === '') return
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

  const playHandler = () => {
    replace(musics)
  }

  const shufflePlayHandler = () => {
    const shuffle = [...musics]
    shuffle.sort(() => Math.random() - 0.5)
    replace(shuffle)
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

  const recommend = useLiveQuery(() => {
    if ((playlist?.tags.length ?? 0) === 0) {
      return db.musics.toArray()
    } else {
      return db.musics
        .filter((music) => {
          const playlistTags = new Set(playlist?.tags)
          return music.tags.some((tag) => playlistTags.has(tag))
        })
        .toArray()
    }
  }, [playlist?.tags])

  useEffect(() => {
    if (playlist?.title) setTitle(playlist?.title)
  }, [playlist?.title])

  useEffect(() => {
    const id = parseInt(params['id'] as string)
    setContent(
      <EditPlaylist
        close={closeModal}
        title={title}
        tags={playlist?.tags}
        id={id}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, playlist?.tags, params['id']])

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
      <Link
        href="/playlist"
        className="flex items-center justify-center w-10 h-10 p-3 mb-6 rounded-full bg-zinc-600 text-zinc-400 hover:bg-zinc-500 hover:text-zinc-300"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>
      <section className="w-full mb-8">
        <div className="flex w-full gap-5">
          <div className="w-44 h-44 shrink-0">
            <PlaylistCover musics={musics} />
          </div>
          <div className="flex flex-col justify-between pt-1 pb-1 overflow-hidden grow">
            <div className="w-full mb-2">
              {editTitle ? (
                <input
                  type="text"
                  value={title}
                  className="w-full pb-1 mb-2 text-3xl font-semibold bg-transparent border-b outline-none border-zinc-300 text-zinc-400"
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={titleSubmitHandler}
                  onBlur={titleCancelHandler}
                  autoFocus
                />
              ) : (
                <h3
                  className="w-full pb-1 mb-2 overflow-hidden text-3xl font-semibold border-b border-transparent cursor-pointer hover:underline text-zinc-300 text-ellipsis whitespace-nowrap"
                  onClick={() => setEditTitle(true)}
                >
                  {playlist?.title}
                </h3>
              )}
              <div className="flex gap-2 pl-1 text-zinc-400">
                <span className="flex items-center gap-1 ">
                  <p className="font-semibold text-purple-400">
                    {musics.length}
                  </p>
                  <p className="text-sm">
                    {musics.length === 1 ? 'song' : 'songs'}
                  </p>
                </span>
                <span>/</span>
                <span className="flex items-center gap-1">
                  <p className="font-semibold text-purple-400">
                    {playlist?.tags.length ?? 0}
                  </p>
                  <p className="text-sm">
                    {(playlist?.tags.length ?? 0) === 1 ? 'tag' : 'tags'}
                  </p>
                </span>
                <button
                  className="flex items-center justify-center text-zinc-400 hover:text-zinc-300"
                  onClick={openModal}
                >
                  <FontAwesomeIcon icon={faPen} className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={playHandler}
                className="flex items-center justify-center gap-3 p-1 pl-3 pr-3 rounded-md text-zinc-400 bg-zinc-800 hover:bg-zinc-600 hover:text-zinc-300"
              >
                <FontAwesomeIcon icon={faPlay} className="w-4 h-4" />
                <span className="whitespace-nowrap">Play</span>
              </button>
              <button
                onClick={shufflePlayHandler}
                className="flex items-center justify-center gap-3 p-1 pl-3 pr-3 rounded-md text-zinc-400 bg-zinc-800 hover:bg-zinc-600 hover:text-zinc-300"
              >
                <FontAwesomeIcon icon={faShuffle} className="w-4 h-4" />
                <span className="whitespace-nowrap">Shuffle Play</span>
              </button>
            </div>
          </div>
        </div>
        <ul className="flex flex-wrap gap-1 mt-4">
          {playlist?.tags.map((tag, i) => {
            return (
              <li
                key={i}
                className="flex items-center gap-1 p-1 pl-3 pr-3 text-sm border rounded-full select-none border-zinc-600 text-zinc-500 bg-zinc-900"
              >
                <p>#</p>
                <p>{tag}</p>
              </li>
            )
          })}
        </ul>
      </section>
      <section className="mb-8">
        <ul className="flex flex-col gap-1 p-3 border rounded-md border-zinc-600 bg-zinc-800">
          {musics.length > 0 ? (
            <>
              <li className="grid items-center w-full gap-5 p-2 mb-1 text-sm border-b select-none h-14 border-zinc-600 text-zinc-400 grid-cols-musicList">
                <Check checked={false} />
                <p></p>
                <p>Title</p>
                <p>Artist</p>
              </li>
              {musics.map((music, i) => {
                return (
                  <PlaylistMusicList
                    key={i}
                    data={music}
                    index={i}
                    playlist={playlist?.id!}
                  />
                )
              })}
            </>
          ) : (
            <li className="flex flex-col items-center justify-center w-full gap-4 text-zinc-400 h-52">
              <FontAwesomeIcon icon={faFolderOpen} className="w-20 h-20" />
              <p>The playlist is empty</p>
            </li>
          )}
        </ul>
      </section>
      <section className="mb-8">
        <h4 className="mb-3 ml-1 text-xl font-semibold text-zinc-400">
          Recommend
        </h4>
        <Carousel showCount={4}>
          {recommend?.map((music, i) => {
            return <MusicAlbum data={music} key={i} />
          })}
        </Carousel>
      </section>
      <section>
        <h4 className="mb-3 ml-1 text-xl font-semibold text-zinc-400">
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
      {modal}
    </div>
  )
}
