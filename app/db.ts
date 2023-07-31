import Dexie, { Table } from 'dexie'

export interface IDBMusic {
  id: number // '<type-simple><videoID>^<startTime>$<endTime>
  type: 'youtube' | 'soundcloud' // 'yt' | 'sc'
  videoID: string
  startTime?: number
  endTime?: number
}

export class CustomMusic extends Dexie {
  musics!: Table<IDBMusic>

  constructor() {
    super('customMusic')
    this.version(1).stores({
      musics: 'id, type, videoID',
    })
  }
}
