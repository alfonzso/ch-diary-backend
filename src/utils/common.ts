function range(start: number, end: number) {
  return [...Array(1 + end - start).keys()].map(v => start + v)
}

const datePlusXDay = (x: number) => {
  const gmtDate = new Date().toLocaleString("en-US", { timeZone: "Europe/Budapest" })
  return new Date(new Date(gmtDate).setDate(new Date().getDate() + x))
}

const fixedDate = (date: Date) => {
  const offset = date.getTimezoneOffset()
  date = new Date(date.getTime() - (offset * 60 * 1000))
  let [dateAsYYYYMMDD, _] = date.toISOString().split('T')
  return dateAsYYYYMMDD
}

function stringToNumber(num: string) {
  let regex = /[+-]?\d+(\.\d+)?/g;
  let matched = num.match(regex)
  if (matched) {
    return matched.map(v => parseFloat(v)).find(Boolean) || 0;
  }
  return 0
}

const translateKeyToEng = (name: string) => {
  switch (name) {
    case 'Átlagos tápérték':
      return 'avgNutritionInGramm'
    case 'Energia':
      return 'energy'
    case 'Zsír':
      return 'fat'
    case 'Szénhidrát':
      return 'ch'
    case 'Fehérje':
      return 'protein'
    case 'Só':
      return 'salt'

    default:
      return ''
  }
}

export {
  range,
  fixedDate,
  datePlusXDay,
  stringToNumber,
  translateKeyToEng
}