export const useGetNextPetitionTarget = (count: number): number => {
  if (count <= 0) {
    return 100
  }
  const orderOfMag = Math.floor(Math.log(count) / Math.LN10 + 0.000000001)
  const nextCount = (Math.ceil(count / 10 ** orderOfMag)) * 10 ** orderOfMag
  if (nextCount === count) {
    return useGetNextPetitionTarget(count + 1)
  }
  return nextCount
}
