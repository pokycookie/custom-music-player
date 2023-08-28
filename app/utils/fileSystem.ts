import db, { IDBMusic, IDBPlaylist } from '@/db'
import { IntegrityEncoding } from './integrity'

export interface IFilePlaylist extends Omit<IDBPlaylist, 'musics' | 'id'> {
  musics: IDBMusic[]
}

export interface IFileData {
  data: {
    musics: IDBMusic[]
    playlists: IFilePlaylist[]
  }
  meta: {
    integrityHash: string
  }
}

export interface IFileDataProps {
  musics: IDBMusic[]
  playlists: IDBPlaylist[]
}

export async function exportData(data: IFileDataProps) {
  const mappedData: IFileData['data'] = {
    musics: data.musics,
    playlists: [],
  }

  for (const playlist of data.playlists) {
    const musics: IDBMusic[] = []
    for (const id of playlist.musics) {
      const music = await db.musics.get(id)
      if (music) musics.push(music)
    }
    delete playlist.id
    mappedData.playlists.push({ ...playlist, musics })
  }

  const fileName = `${Number(new Date())}.cmp`
  const meta: IFileData['meta'] = {
    integrityHash: IntegrityEncoding(mappedData),
  }

  const file = new File(
    [JSON.stringify({ data: mappedData, meta })],
    fileName,
    {
      type: 'text/plain',
    }
  )
  const url = window.URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function importData() {
  return new Promise<IFileData>((resolve, rejects) => {
    const link = document.createElement('input')
    link.type = 'file'
    link.accept = '.cmp'
    link.addEventListener('change', () => {
      if (!link.files || link.files.length === 0) {
        rejects()
        return
      }
      try {
        const file = link.files[0]
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = () => {
          const data = JSON.parse(reader.result as string, (_, value) => {
            if (typeof value === 'string') {
              const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
              if (dateRegex.test(value)) return new Date(value)
            }
            return value
          }) as IFileData
          if (!data?.data || !data?.meta || !data?.meta?.integrityHash)
            throw new Error('invalid file')
          if (IntegrityEncoding(data.data) !== data.meta.integrityHash)
            throw new Error('invalid file')
          resolve(data)
        }
      } catch (error) {
        rejects(error)
      }
    })
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}
