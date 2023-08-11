import Dexie, { Table } from 'dexie'

export interface IDBMusic {
  id: string // '<type-simple>@<videoID>[^<startTime>][$<endTime>]
  type: 'youtube' | 'soundcloud' // 'yt' | 'sc'
  videoID: string
  title: string
  artist: string
  startTime?: number
  endTime?: number
  tags?: string[]
  updated: Date
}

export interface IDBTag {
  tagName: string
  musics: string[]
}

export interface IDBPlaylist {
  id: string
  title: string
  musics: string[]
}

class CustomMusic extends Dexie {
  musics!: Table<IDBMusic>
  tags!: Table<IDBTag>

  constructor() {
    super('customMusic')
    this.version(1).stores({
      musics: 'id, type, videoID, title, artist, tags, updated',
      tags: 'tagName, musics',
    })
  }
}

const db = new CustomMusic()

export default db
