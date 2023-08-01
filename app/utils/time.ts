export function timeToNumber(
  hour: number = 0,
  minute: number = 0,
  second: number = 0
) {
  const H = hour * 60 * 60
  const M = minute * 60

  return H + M + second
}
