import { IDBMusic } from '@/db'
import { randomBytes } from 'crypto'
import { create } from 'zustand'

interface ICurrentPlaylistMusic extends IDBMusic {
  key: string
}

interface ICurrentPlaylistState {
  // Current playlist
  currentPlaylist: ICurrentPlaylistMusic[]

  // Current playlist methods
  add: (music: IDBMusic, options?: { index?: number; restart: boolean }) => void
  del: (indexs: Set<number>) => void
  replace: (musics: IDBMusic[]) => void
  shuffle: (index: number) => void

  // Drag and Drop to add new music to the current playlist
  dndMusic: ICurrentPlaylistMusic | null
  startDrag: (music: IDBMusic) => void
  endDrag: (index: number) => void
  cancelDND: () => void

  // Current playing music
  currentPlayMusic: ICurrentPlaylistMusic | null
  setCurrentPlayMusic: (music: ICurrentPlaylistMusic | null) => void

  // Restart가 필요할 때마다 true <-> false 토글 (useEffect dependency용)
  restartFlag: boolean
}

export const useCurrentPlaylistStore = create<ICurrentPlaylistState>((set) => ({
  // Current playlist
  currentPlaylist: [],

  // Current playlist methods
  add: (music, options) => {
    set((state) => {
      const result: Partial<ICurrentPlaylistState> = {}

      const newPlaylist = [...state.currentPlaylist]
      const newPlaylistMusic: ICurrentPlaylistMusic = {
        ...music,
        key: music.id + randomBytes(8).toString('hex'),
      }

      if (options?.index) newPlaylist.splice(options.index, 0, newPlaylistMusic)
      else newPlaylist.push(newPlaylistMusic)

      result.currentPlaylist = newPlaylist
      if (options?.restart) result.restartFlag = !state.restartFlag

      return result
    })
  },
  del: (indexs) => {
    set((state) => ({
      currentPlaylist: state.currentPlaylist.filter((_, i) => !indexs.has(i)),
    }))
  },
  replace: (musics) => {
    set((state) => {
      const newPlaylist: ICurrentPlaylistMusic[] = musics.map((music) => {
        return { ...music, key: music.id + randomBytes(8).toString('hex') }
      })
      return { currentPlaylist: newPlaylist, restartFlag: !state.restartFlag }
    })
  },
  shuffle: (index) => {
    set((state) => {
      const others = state.currentPlaylist.filter((_, i) => i !== index)
      others.sort(() => Math.random() - 0.5)
      return { currentPlaylist: [state.currentPlaylist[index], ...others] }
    })
  },

  // Drag and Drop to add new music to the current playlist
  dndMusic: null,
  startDrag: (music) =>
    set(() => ({
      dndMusic: { ...music, key: music.id + randomBytes(8).toString('hex') },
    })),
  endDrag: (index) =>
    set((state) => {
      if (!state.dndMusic) return {}
      const newPlaylist = [...state.currentPlaylist]
      newPlaylist.splice(index, 0, { ...state.dndMusic })
      return { dndMusic: null, currentPlaylist: newPlaylist }
    }),
  cancelDND: () => set(() => ({ dndMusic: null })),

  // Current playing music
  currentPlayMusic: null,
  setCurrentPlayMusic: (music) => set(() => ({ currentPlayMusic: music })),

  // Restart가 필요할 때마다 true <-> false 토글 (useEffect dependency용)
  restartFlag: false,
}))
