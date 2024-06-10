// const targets = [
//   10,
//   50,
//   100,
//   200,
//   300,
//   500,
//   800,
//   1000,
//   1500,
//   2000,
//   3500,
//   4000,
//   5000,
//   7000,
//   10000,
//   13000,
//   15000,
//   20000,
//   35000,
//   40000
// ]

export const useGetNextTarget = (count: number) => {
  // let startCount = count
  let mag = Math.floor(Math.log10(count))
  if (count === 10 ** mag) {
    mag += 1
  }
  return Math.ceil(count / 10 ** mag) * 10 ** mag
}
