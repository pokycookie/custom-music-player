'use client'

import { useState } from 'react'
import Check from '../ui/check'
import ToggleSection from '../ui/toggleSection'
import useAllCheck from '@/hooks/useAllCheck'
import { IFileData, IFilePlaylist } from '@/utils/fileSystem'
import { IDBMusic } from '@/db'
import { importMusic, importPlaylist } from '@/utils/dexie'

interface IProps {
  close: () => void
  data?: IFileData['data']
}

export default function ImportModal(props: IProps) {
  const [musicOption, setMusicOption] = useState(false)
  const [playlistOption, setPlaylistOption] = useState(false)

  const musicChecks = useAllCheck()
  const playlistChecks = useAllCheck()

  const importHandler = async () => {
    const checkedMusics: IDBMusic[] = []
    if (props.data && props.data.musics && musicOption) {
      for (const i of Array.from(musicChecks.checks)) {
        checkedMusics.push(props.data.musics[i])
      }
    }
    const checkedPlaylists: IFilePlaylist[] = []
    if (props.data && props.data.playlists && playlistOption) {
      for (const i of Array.from(playlistChecks.checks)) {
        checkedPlaylists.push(props.data.playlists[i])
      }
    }

    await importMusic(checkedMusics)
    await importPlaylist(checkedPlaylists)

    props.close()
  }

  return (
    <article className="flex flex-col justify-between w-full h-full p-4 rounded-md bg-zinc-800">
      <ToggleSection
        open={musicOption}
        title="import music"
        onChange={() => setMusicOption((prev) => !prev)}
      >
        <div className="h-full overflow-hidden">
          <div className="flex items-center justify-between gap-3 p-2 pb-3 mb-2 border-b border-zinc-600">
            <Check
              checked={musicChecks.allCheck}
              onChange={(checked) =>
                musicChecks.allCheckHandler(
                  checked,
                  props.data?.musics?.length ?? 0
                )
              }
            />
            <span className="flex items-center gap-2 select-none">
              <p className="font-semibold text-purple-400">
                {musicChecks.checks.size}
              </p>
              <p className="text-sm text-zinc-500">selected</p>
            </span>
          </div>
          <ul className="pl-2 pr-4 mb-8 overflow-y-auto max-h-56">
            {props.data?.musics?.map((music, i) => {
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
        open={playlistOption}
        title="import playlist"
        onChange={() => setPlaylistOption((prev) => !prev)}
      >
        <div className="h-full overflow-hidden">
          <div className="flex items-center justify-between gap-3 p-2 pb-3 mb-2 border-b border-zinc-600">
            <Check
              checked={playlistChecks.allCheck}
              onChange={(checked) =>
                playlistChecks.allCheckHandler(
                  checked,
                  props.data?.playlists?.length ?? 0
                )
              }
            />
            <span className="flex items-center gap-2 select-none">
              <p className="font-semibold text-purple-400">
                {playlistChecks.checks.size}
              </p>
              <p className="text-sm text-zinc-500">selected</p>
            </span>
          </div>
          <ul className="pl-2 pr-4 overflow-y-auto max-h-56">
            {props.data?.playlists?.map((music, i) => {
              return (
                <li
                  key={i}
                  className="flex items-center gap-3 pt-1 pb-1 text-sm text-zinc-500"
                >
                  <Check
                    checked={playlistChecks.checks.has(i)}
                    onChange={(checked) =>
                      playlistChecks.checkHandler(i, checked)
                    }
                  />
                  <span className="flex items-center justify-between w-full">
                    <p className="text-zinc-400">{music.title}</p>
                  </span>
                </li>
              )
            }) ?? null}
          </ul>
        </div>
      </ToggleSection>
      <section className="flex justify-end gap-2 mt-6">
        <button
          className="p-2 pl-3 pr-3 text-sm text-gray-400 uppercase rounded bg-zinc-900 hover:bg-zinc-700"
          onClick={props.close}
        >
          cancel
        </button>
        <button
          className="p-2 pl-3 pr-3 text-sm text-gray-400 uppercase border border-transparent rounded bg-zinc-900 hover:bg-zinc-700 hover:border-purple-600 outline-purple-600"
          onClick={importHandler}
        >
          import
        </button>
      </section>
    </article>
  )
}
