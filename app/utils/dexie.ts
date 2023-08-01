import db, { IDBMusic } from '@/db'
import { createMusicID } from './createID'

export interface ICreateMusic {
  url: string
  title: string
  artist: string
  start?: number
  end?: number
}

export function createMusic({ artist, title, url, end, start }: ICreateMusic) {
  try {
    const { id, videoID, type } = createMusicID(url, start, end)
    if (title.trim() === '') throw new Error('no title')
    if (artist.trim() === '') throw new Error('no artist')
    if (start && end && start > end) throw new Error('invalid time')

    const data: IDBMusic = { id, videoID, type, title, artist }

    if (start) data.startTime = start
    if (end) data.endTime = end

    db.musics.add(data)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
