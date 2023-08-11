import { IDBMusic, IDBPlaylist } from '@/db'

interface IFileData {
  musics: IDBMusic[]
  playlists: IDBPlaylist[]
}

export function exportData(data: IFileData) {
  const fileName = `${Number(new Date())}.cmp`
  const file = new File([JSON.stringify(data)], fileName, {
    type: 'text/plain',
  })
  const url = window.URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
