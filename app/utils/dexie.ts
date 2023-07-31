import db from '@/db'
import { createMusicID } from './createID'

export function createMusic(
  url: string,
  title: string,
  artist: string,
  start?: number,
  end?: number
) {
  try {
    const { id, videoID, type } = createMusicID(url)
    if (title.trim() === '') throw new Error('no title')
    if (artist.trim() === '') throw new Error('no artist')
    db.musics.add({ id, videoID, type, title, artist })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
