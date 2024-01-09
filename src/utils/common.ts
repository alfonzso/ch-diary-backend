import { Request, Response } from "express";

function range(start: number, end: number) {
  return [...Array(1 + end - start).keys()].map(v => start + v)
}

const clearAllCookies = (req: Request, res: Response) => {
  Object.keys(req.cookies).map((cookie) => {
    res.clearCookie(cookie);
  })
}

const tzDate = (_initDate: null | string | Date = null) => {
  let initDate = null
  if (_initDate === null) {
    initDate = new Date()
  } else {
    initDate = new Date(_initDate)
  }
  return new Date(initDate.toLocaleString("en-US", { timeZone: "Europe/Budapest" }))
}

function getDayName(date: Date) {
  // var date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: 'long' });
}

const datePlusXDay = (x: number, _initDate: null | string | Date = null) => {
  const _tzDate = tzDate(_initDate)
  return new Date(_tzDate.setDate(_tzDate.getDate() + x))
}

const toYYYYMMDD = (date: Date) => {
  return date.toISOString().split('T')[0]
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
  clearAllCookies,
  getDayName,
  tzDate,
  toYYYYMMDD,
  fixedDate,
  datePlusXDay,
  stringToNumber,
  translateKeyToEng
}