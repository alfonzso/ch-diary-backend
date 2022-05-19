import { Service, Inject } from "typedi";
import { Logger } from "winston";
import { InterfoodImport } from "../types";
import { Tabletojson } from 'tabletojson';
import { Prisma } from "@prisma/client";

@Service()
export default class InterfoodService {
  constructor(
    @Inject('logger') private logger: Logger,
  ) {
  }

  private withoutTime(dateTime: Date) {
    const padTo2Digits = (num: number) => {
      return num.toString().padStart(2, '0');
    }

    const formatDate = (date: Date) => {
      return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-');
    }
    const year = dateTime.getFullYear()
    const month = dateTime.getMonth()
    const day = dateTime.getDate()

    return formatDate(new Date(year, month, day))
  }

  private stringToNumber(num: string) {
    let regex = /[+-]?\d+(\.\d+)?/g;
    return (num)!.match(regex)!.map(function (v) { return parseFloat(v); })[0]
  }

  async import(userId: string, multiLine: string): Promise<InterfoodImport[]> {
    try {

      interface foodPropFromInterfood {
        '0': string;
        '1': string;
        '2': string;
      }

      let yesterday: Date[] = []
      let interfoodImports: InterfoodImport[] = await Promise.all(
        multiLine.trim().split("\n").map(async line => {
          let [createdAt, interFoodType, foodName] = line.trim().split(";")

          let foodPropsFromTable = ((await Tabletojson.convertUrl(
            `https://www.interfood.hu/getosszetevok/?k=${interFoodType}&d=${createdAt}&l=hu`,
            function (tablesAsJson) {
              return tablesAsJson
            }
          )) as foodPropFromInterfood[][])[0]

          let foodProp: Prisma.FoodProperiteCreateInput = {
            gramm: this.stringToNumber(foodPropsFromTable[0][2]),
            kcal: this.stringToNumber(foodPropsFromTable[1][2]),
            fat: this.stringToNumber(foodPropsFromTable[2][2]),
            ch: this.stringToNumber(foodPropsFromTable[4][2]),
            portein: this.stringToNumber(foodPropsFromTable[6][2]),
          }

          // if (yesterday && yesterday.includes(createdAt)) {
          //   const latestDay = yesterday.sort()[yesterday.length - 1]
          //   let yesterdayAsDay = new Date(latestDay)
          //   yesterdayAsDay.setDate(yesterdayAsDay.getDate() + 1)
          //   yesterdayAsDay.setHours(12, 0, 0)
          //   // createdAt = this.withoutTime(yesterdayAsDay)
          //   createdAt = yesterdayAsDay.toDateString()
          //   yesterday.push(createdAt)
          // } else {
          //   const setToNoon = new Date(createdAt)
          //   setToNoon.setHours(12, 0, 0)
          //   // yesterday.push(this.withoutTime(setToNoon))
          //   yesterday.push(setToNoon.toDateString()+setToNoon.toTimeString())
          // }
          let createdAtAsDate = new Date(createdAt)
          // if (yesterday.includes(createdAtAsDate)) {
          // console.log(
          //   yesterday.filter(day => {
          //     console.log(day, createdAtAsDate)
          //     console.log(day.getTime(), createdAtAsDate.getTime())
          //     return day.getTime() === createdAtAsDate.getTime()
          //   }).length
          // )
          if (yesterday.filter(day => day.getTime() === createdAtAsDate.getTime()).length > 0) {
            // const latestDay = yesterday.sort()[yesterday.length - 1]
            const lastDay = yesterday.sort((a, b) => a.getTime() - b.getTime())[yesterday.length - 1];

            // console.log(
            //   "lastDay date --->", lastDay
            // )
            // let yesterdayAsDay = new Date(latestDay)
            createdAtAsDate.setDate(new Date(lastDay).getDate() + 1)
            // createdAt = this.withoutTime(yesterdayAsDay)
            // createdAt = yesterdayAsDay
            // createdAtAsDate = yesterdayAsDay
            yesterday.push(createdAtAsDate)
          } else {
            yesterday.push(createdAtAsDate)
          }

          // set all date to noon // +2 to gmt
          // createdAtAsDate.setHours(10, 0, 0)
          // console.log(
          //   "xxxxxxxxxxxxxxxxxxxxxxxx--->", createdAtAsDate
          // )
          // createdAtAsDate.setTime(createdAtAsDate.getTime() + 10 * 60 * 60 * 1000);
          const newDate = new Date(createdAtAsDate.getTime()) // .setHours(12, 0, 0)  // .setTime(createdAtAsDate.getTime() + 10 * 60 * 60 * 1000);
          newDate.setHours(12 +2, 0, 0)
          // console.log(
          //   "xxxxxxxxxxxxxxxxxxxxxxxx--->", newDate
          // )

          // return { userId, foodName, foodPortion: 450, createdAt: this.createDateAsUTC(createdAtAsDate), interFoodType, foodProp }
          return { userId, foodName, foodPortion: 450, createdAt: newDate, interFoodType, foodProp }
        }))

      return interfoodImports
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  createDateAsUTC(date: Date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 2, date.getMinutes(), date.getSeconds()));
  }

}