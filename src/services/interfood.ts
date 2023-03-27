import { Service, Inject } from "typedi";
import { Logger } from "winston";
import InterfoodPropertyMapper from "./interfoodPropertiesMapper";
import { InterfoodImport } from "../types";
import { stringToNumber } from "../utils/common";

@Service()
export default class InterfoodService {
  constructor(
    @Inject('logger') private logger: Logger,
    private iPropMapper: InterfoodPropertyMapper,
  ) {
  }

  private orderChecker(interfoodImports: InterfoodImport[], sortedInterfoodData: InterfoodImport[]) {
    let errorHappened = false

    interfoodImports.sort((a, b) => { return a.createdAt.getTime() - b.createdAt.getTime() })
      .map((foodImports: InterfoodImport, index: number) => {
        if (foodImports.foodName !== sortedInterfoodData[index].foodName) errorHappened = true
      })

    if (errorHappened) this.logger.error(`import with wrong order ( not sure ): ${interfoodImports}`);
  }

  private async importedDataToInterfoodImport(userId: string, sortedInterfoodData: InterfoodImport[]) {
    return await Promise.all(
      sortedInterfoodData.map(async ({ createdAt, interFoodType, foodName }) => {

        const fid = `${interFoodType.trim()}-${foodName.slice(0, 6).trim()}`
        this.iPropMapper.setFid(fid)
        let { foodPortion, foodProp } = await this.iPropMapper.interfoodMapper(interFoodType, createdAt)

        this.logger.debug(`${fid}: foodProp: ${JSON.stringify(foodProp)}`)
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
    const res: InterfoodImport[] = (
      multiLine.map(
        line => {
          let [date, foodType, name] = line.trim().split(";")
          this.logger.debug(`date: ${date}, foodType: ${foodType}, name: ${name}`)
          return { date, foodType, name }
        }
      ) as interFoodDataAsObject[])
      .sort((a, b) => {
        if (a.date !== b.date)
          return a.date.localeCompare(b.date)
        if (a.foodType !== b.foodType)
          return stringToNumber(a.foodType) - stringToNumber(b.foodType)
        return a.name.localeCompare(b.name)
      }).map(food => {
        return { createdAt: new Date(food.date), foodName: food.name, interFoodType: food.foodType }
      })
    return res
  }

  async import(userId: string, multiLine: string[]): Promise<InterfoodImport[]> {
    try {

      this.logger.debug(`user: ${userId} multiline: ${multiLine}`)
      const sortedInterfoodData: InterfoodImport[] = this.sortInterfoodData(multiLine)
      this.logger.debug(`user: ${userId} sortedInterfoodData: ${JSON.stringify(sortedInterfoodData)}`)
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