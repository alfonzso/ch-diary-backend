import { Request, Response } from "express";

export type MsgType = {
  msg?: string
  code?: number,
  content?: string | null
}

const msgTemplate = (res: Response, msgType: string, { msg, code = 0, content = null }: MsgType) => {
  res.setHeader('HX-Trigger', JSON.stringify({ [msgType]: msg }))
  if (content !== null) {
    res.render(content)
  } else {
    res.status(code).send()
  }
}

const successMsg = (res: Response, { msg, code = 200, content }: MsgType) => {
  return msgTemplate(res, "showSuccessMessage", { msg, code, content })
}

const errorMsg = (res: Response, { msg, code = 400, content }: MsgType) => {
  return msgTemplate(res, "showErrorMessage", { msg, code, content })
}

const warnMsg = (res: Response, { msg, code = 199, content }: MsgType) => {
  return msgTemplate(res, "showWarnMessage", { msg, code, content })
}

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
  errorMsg,
  successMsg,
  warnMsg,
  clearAllCookies,
  getDayName,
  tzDate,
  toYYYYMMDD,
  fixedDate,
  datePlusXDay,
  stringToNumber,
  translateKeyToEng
}