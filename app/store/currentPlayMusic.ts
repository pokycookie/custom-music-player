import { create } from 'zustand'

interface ICurrentPlayMusicState {
  index: number | null
  setIndex: (index: number | null) => void
}

export const useCurrentPlayMusicStore = create<ICurrentPlayMusicState>(
  (set) => ({
    index: null,
    setIndex: (index) => set(() => ({ index })),
  })
)
