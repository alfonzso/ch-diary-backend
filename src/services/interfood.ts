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

  private sortInterfoodData(multiLine: string[]): InterfoodImport[] {
    type interFoodDataAsObject = {
      date: string;
      typeLetter: string;
      typeNumber: number;
      name: string;
    }
    const res: InterfoodImport[] = (multiLine.map(line => {
      let [date, typeLetter, typeNumber, name] = line.trim().split(";")
      return { date, typeLetter, typeNumber: parseInt(typeNumber), name }
    }) as interFoodDataAsObject[])
      .sort((a, b) => {
        if (a.date === b.date) {
          return a.typeNumber - b.typeNumber
        } else {
          return a.date.localeCompare(b.date)
        }
      }).map(line => {
        return { createdAt: new Date(line.date), foodName: line.name, interFoodType: `${line.typeLetter}${line.typeNumber}` }
      })
    return res
  }

  async import(userId: string, multiLine: string[]): Promise<InterfoodImport[]> {
    try {

      interface foodPropFromInterfood {
        '0': string;
        '1': string;
        '2': string;
      }

      let yesterday: Date[] = []

      console.log(
        multiLine.sort()
      )

      let interfoodImports: InterfoodImport[] = await Promise.all(
        this.sortInterfoodData(multiLine).map(async ({ createdAt, interFoodType, foodName }) => {
          console.log(
            createdAt, interFoodType, foodName
          )
          // multiLine.sort().map(async line => {
          // let [createdAt, interFoodType, foodName] = line.trim().split(";")
          Tabletojson.convert
          let foodPropsFromTable = ((await Tabletojson.convertUrl(
            `https://www.interfood.hu/getosszetevok/?k=${interFoodType}&d=${createdAt.toLocaleDateString('en-CA')}&l=hu`,
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

          let createdAtAsDate = new Date(createdAt)
          if (yesterday.filter(day => day.getTime() === createdAtAsDate.getTime()).length > 0) {
            const lastDay = yesterday.sort((a, b) => a.getTime() - b.getTime())[yesterday.length - 1];
            createdAtAsDate.setDate(new Date(lastDay).getDate() + 1)
            yesterday.push(createdAtAsDate)
          } else {
            yesterday.push(createdAtAsDate)
          }

          const newDate = new Date(createdAtAsDate.getTime())
          // gmt + 2, set to 'noon'
          newDate.setHours(12 + 2, 0, 0)

          return { userId, foodName, foodPortion: 450, createdAt: newDate, interFoodType, foodProp }
        }))

      return interfoodImports
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  // createDateAsUTC(date: Date) {
  //   return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 2, date.getMinutes(), date.getSeconds()));
  // }

}