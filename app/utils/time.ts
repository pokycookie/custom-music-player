export function timeToNumber(
  hour: number = 0,
  minute: number = 0,
  second: number = 0
) {
  const H = hour * 60 * 60
  const M = minute * 60

  return H + M + second
}

export function numberToTimeString(time: number) {
  const resultArr = []

  const H = Math.floor(time / 3600)
  const M = Math.floor((time - H * 3600) / 60)
  const S = Math.floor(time - H * 3600 - M * 60)

  if (H > 0) resultArr.push(H)
  resultArr.push(M)
  resultArr.push(S)

  return resultArr.map((e) => String(e).padStart(2, '0')).join(':')
}
