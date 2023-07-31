import { IInputInfo } from '@/components/ui/labelInput'

export function validateURL(url: string): IInputInfo | null {
  const youtubeRegex = /^https:\/\/youtu.be\/.*$/
  const soundcloudRegex = /^https:\/\/on\.soundcloud\.com\/.*$/

  if (url.trim() === '') return null
  if (youtubeRegex.test(url))
    return { status: 'success', message: 'youtube URL' }
  if (soundcloudRegex.test(url))
    return { status: 'success', message: 'soundcloud URL' }
  return { status: 'danger', message: 'Invalid URL' }
}
