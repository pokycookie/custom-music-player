import Dexie, { Table } from 'dexie'

export interface IDBMusic {
  id: string // '<type-simple>@<videoID>[^<startTime>][$<endTime>]
  type: 'youtube' | 'soundcloud' // 'yt' | 'sc'
  videoID: string
  title: string
  artist: string
  startTime?: number
  endTime?: number
}

class CustomMusic extends Dexie {
  musics!: Table<IDBMusic>

  constructor() {
    super('customMusic')
    this.version(1).stores({
      musics: 'id, type, videoID, title, artist',
    })
  }
}

const db = new CustomMusic()

export default db
