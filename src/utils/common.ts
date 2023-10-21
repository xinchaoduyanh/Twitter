export const NumberEnumToArray = (enumObject: { [key: string]: number | string }) => {
  return Object.values(enumObject).filter((value) => typeof value === 'number') as number[]
}
