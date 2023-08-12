import crypto from 'crypto'

export function IntegrityEncoding(data: any) {
  const stringify = JSON.stringify(data)
  const result = crypto.createHash('sha512').update(stringify).digest('base64')

  return result
}
