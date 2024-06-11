export const useGetNextTarget = (count: number) => {
  if (count < 10) {
    return 10
  }
  const target = count / 0.8
  const mag = Math.floor(Math.log10(count))
  return Math.ceil(target / 10 ** mag) * 10 ** mag
}
