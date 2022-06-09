import { Service, Inject } from "typedi";
import { Logger } from "winston";
import { InterfoodImport } from "../types";
import { Tabletojson } from 'tabletojson';
import { Prisma } from "@prisma/client";
// import * as crossf from 'cross-fetch';
import 'cross-fetch/polyfill';

interface foodPropFromInterfood {
  '0': string;
  '1': string;
  '2': string;
}

@Service()
export default class InterfoodService {
  constructor(
    @Inject('logger') private logger: Logger,
  ) {
  }

  // private withoutTime(dateTime: Date) {
  //   const padTo2Digits = (num: number) => {
  //     return num.toString().padStart(2, '0');
  //   }

  //   const formatDate = (date: Date) => {
  //     return [
  //       date.getFullYear(),
  //       padTo2Digits(date.getMonth() + 1),
  //       padTo2Digits(date.getDate()),
  //     ].join('-');
  //   }
  //   const year = dateTime.getFullYear()
  //   const month = dateTime.getMonth()
  //   const day = dateTime.getDate()

  //   return formatDate(new Date(year, month, day))
  // }

  private stringToNumber(num: string) {
    let regex = /[+-]?\d+(\.\d+)?/g;
    return (num)!.match(regex)!.map(function (v) { return parseFloat(v); })[0]
  }

  private orderChecker(interfoodImports: InterfoodImport[], sortedInterfoodData: InterfoodImport[]) {
    let errorHappened = false
    interfoodImports.sort((a, b) => { return a.createdAt.getTime() - b.createdAt.getTime() })
      .map((foodImports: InterfoodImport, index: number) => {
        if (foodImports.foodName !== sortedInterfoodData[index].foodName) errorHappened = true
      })

    if (errorHappened) console.error("import with wrong order ( not sure ): ", interfoodImports);
  }

  private getNettoWeightFromString(interfoodBodyText: string) {
    try {
      return parseInt(interfoodBodyText.match(/>Nettó tömeg: (?<netto>\d+)/)!.groups!.netto)
    } catch (error) {
      console.error("getNettoWeightFromString: ", error)
    }
  }

  private async importedDataToInterfoodImport(userId: string, sortedInterfoodData: InterfoodImport[]) {
    return await Promise.all(
      sortedInterfoodData.map(async ({ createdAt, interFoodType, foodName }) => {
        const resp = await fetch(`https://www.interfood.hu/getosszetevok/?k=${interFoodType}&d=${createdAt.toLocaleDateString('en-CA')}&l=hu`)
        const bodyText = await resp.text()
        const foodPortion = this.getNettoWeightFromString(bodyText)

        let foodPropsFromTable = (Tabletojson.convert(bodyText) as foodPropFromInterfood[][])[0]

        let foodProp: Prisma.FoodProperiteCreateInput = {
          gramm: this.stringToNumber(foodPropsFromTable[0][2]),
          kcal: this.stringToNumber(foodPropsFromTable[1][2]),
          fat: this.stringToNumber(foodPropsFromTable[2][2]),
          ch: this.stringToNumber(foodPropsFromTable[4][2]),
          portein: this.stringToNumber(foodPropsFromTable[6][2]),
        }

        return { userId, foodName, foodPortion, createdAt, interFoodType, foodProp }

      }))
  }

  private dateFixerSlider(interfoodImports: InterfoodImport[]): InterfoodImport[] {
    let yesterday: Date[] = []

    for (const foodImports of interfoodImports) {
      let createdAtAsDate = new Date(foodImports.createdAt)
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

      foodImports.createdAt = newDate
    }
    return interfoodImports
  }

  private sortInterfoodData(multiLine: string[]): InterfoodImport[] {
    type interFoodDataAsObject = {
      date: string;
      foodType: string;
      name: string;
    }
    const res: InterfoodImport[] = (multiLine.map(line => {
      let [date, foodType, name] = line.trim().split(";")
      return { date, foodType, name }
    }) as interFoodDataAsObject[])
      .sort((a, b) => {
        if (a.date === b.date) {
          if (a.foodType === b.foodType) {
            return a.name.localeCompare(b.name)
          } else {
            return this.stringToNumber(a.foodType) - this.stringToNumber(b.foodType)
          }
        } else {
          return a.date.localeCompare(b.date)
        }
      }).map(food => {
        return { createdAt: new Date(food.date), foodName: food.name, interFoodType: food.foodType }
      })
    return res
  }

  async import(userId: string, multiLine: string[]): Promise<InterfoodImport[]> {
    try {
      const sortedInterfoodData: InterfoodImport[] = this.sortInterfoodData(multiLine)
      let interfoodImports: InterfoodImport[] = await this.importedDataToInterfoodImport(userId, sortedInterfoodData)
      interfoodImports = this.dateFixerSlider(interfoodImports)
      this.orderChecker(interfoodImports, sortedInterfoodData)
      return interfoodImports

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

}