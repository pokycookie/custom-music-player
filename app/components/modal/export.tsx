'use client'

import { useState } from 'react'
import ToggleSection from '../ui/toggleSection'
import { exportData } from '@/utils/fileSystem'
import useAllCheck from '@/hooks/useAllCheck'
import Check from '../ui/check'
import { useLiveQuery } from 'dexie-react-hooks'
import db, { IDBMusic, IDBPlaylist } from '@/db'

interface IProps {
  close: () => void
}

export default function ExportModal(props: IProps) {
  const [musicOption, setMusicOption] = useState(false)
  const [playlistOptions, setPlaylistOption] = useState(false)

  const musicChecks = useAllCheck()

  const exportHandler = () => {
    const checkedMusics: IDBMusic[] = []
    if (musics && musicOption) {
      Array.from(musicChecks.checks).forEach((i) =>
        checkedMusics.push(musics[i])
      )
    }

    const checkedPlaylists: IDBPlaylist[] = []

    exportData({ musics: checkedMusics, playlists: checkedPlaylists })
    props.close()
  }

  const musics = useLiveQuery(() => db.musics.toArray())

  return (
    <article className="flex flex-col justify-between w-full h-full p-4 rounded-md bg-zinc-800">
      <ToggleSection
        open={musicOption}
        title="export music"
        onChange={() => setMusicOption((prev) => !prev)}
      >
        <div className="h-full overflow-hidden">
          <div className="flex items-center justify-between gap-3 p-2 pb-3 mb-2 border-b border-zinc-600">
            <Check
              checked={musicChecks.allCheck}
              onChange={(checked) =>
                musicChecks.allCheckHandler(checked, musics?.length ?? 0)
              }
            />
            <span className="flex items-center gap-2 select-none">
              <p className="font-semibold text-purple-600">
                {musicChecks.checks.size}
              </p>
              <p className="text-sm text-zinc-500">selected</p>
            </span>
          </div>
          <ul className="pl-2 pr-4 overflow-y-auto max-h-56">
            {musics?.map((music, i) => {
              return (
                <li
                  key={i}
                  className="flex items-center gap-3 pt-1 pb-1 text-sm text-zinc-500"
                >
                  <Check
                    checked={musicChecks.checks.has(i)}
                    onChange={(checked) => musicChecks.checkHandler(i, checked)}
                  />
                  <span className="flex items-center justify-between w-full">
                    <p className="text-zinc-400">{music.title}</p>
                    <p className="text-xs">{music.artist}</p>
                  </span>
                </li>
              )
            }) ?? null}
          </ul>
        </div>
      </ToggleSection>
      <ToggleSection
        open={playlistOptions}
        title="export playlist"
        onChange={() => setPlaylistOption((prev) => !prev)}
      ></ToggleSection>
      <section className="flex justify-end gap-2 mt-6">
        <button
          className="p-2 pl-3 pr-3 text-sm text-gray-400 uppercase rounded bg-zinc-900 hover:bg-zinc-700"
          onClick={props.close}
        >
          cancel
        </button>
        <button
          className="p-2 pl-3 pr-3 text-sm text-gray-400 uppercase border border-transparent rounded bg-zinc-900 hover:bg-zinc-700 hover:border-purple-600 outline-purple-600"
          onClick={exportHandler}
        >
          export
        </button>
      </section>
    </article>
  )
}