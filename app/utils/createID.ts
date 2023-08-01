export function createMusicID(url: string, start?: number, end?: number) {
  const youtubeRegex = /^https:\/\/youtu.be\/.*$/
  const soundcloudRegex = /^https:\/\/on\.soundcloud\.com\/.*$/

  let type: 'youtube' | 'soundcloud'
  let urlType = ''
  let videoID = ''
  if (youtubeRegex.test(url)) {
    urlType = 'yt'
    type = 'youtube'
    videoID = url.split('https://youtu.be/')[1]
  } else if (soundcloudRegex.test(url)) {
    urlType = 'sc'
    type = 'soundcloud'
    videoID = url.split('https://on.soundcloud.com/')[1]
  } else {
    throw new Error('invalid url')
  }

  let id = `${urlType}@${videoID}`
  if (start) id += `^${start}`
  if (end) id += `$${end}`

  return { id, videoID, type }
}
