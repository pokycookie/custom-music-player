import db, { IDBMusic } from '@/db'
import { createMusicID } from './createID'

export interface ICreateMusic {
  url: string
  title: string
  artist: string
  start?: number
  end?: number
  tags?: string[]
}

export async function createMusic({
  artist,
  title,
  url,
  end,
  start,
  tags,
}: ICreateMusic) {
  try {
    const { id, videoID, type } = createMusicID(url, start, end)
    if (title.trim() === '') throw new Error('no title')
    if (artist.trim() === '') throw new Error('no artist')
    if (start && end && start > end) throw new Error('invalid time')
    const updated = new Date()

    const data: IDBMusic = { id, videoID, type, title, artist, updated }

    if (start) data.startTime = start
    if (end) data.endTime = end

    if (tags && tags.length > 0) {
      data.tags = tags
      for (const tag of tags) {
        const dbTag = await db.tags.get(tag)
        if (dbTag) {
          // const musics = [...dbTag.musics, id]
          // db.tags.update(tag, { musics })
        } else {
          db.tags.add({ tagName: tag, musics: [] })
        }
      }
    }

    db.musics.add(data)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function importMusic(data: IDBMusic[]) {
  try {
    for (const music of data) {
      // 같은 id의 music이 이미 존재하면 continue
      if (await db.musics.get(music.id)) continue
      for (const tag of music.tags ?? []) {
        // 같은 이름의 tag가 이미 존재하면 continue
        if (await db.tags.get(tag)) continue
        db.tags.add({ tagName: tag, musics: [] })
      }
      music.updated = new Date()
      db.musics.add(music)
    }
  } catch (error) {
    console.error(error)
  }
}
