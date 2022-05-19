// import { FoodProperite, Interfood, Prisma, User } from "@prisma/client";
import { Service, Inject } from "typedi";
import { Logger } from "winston";
import { InterfoodImport } from "../types";
// import HtmlTableToJson from 'html-table-to-json';
// import { BadRequest, InvalidRequestParameters } from "../errors";
// import { UserRepository, RefreshTokenRepository, InterFoodTypeRepository, InterFoodRepository, FoodProperiteRepository, FoodRepository, ChDiaryRepository } from "../repositorys";
// import { addNewEntry, IUser } from "../types";
// import { Utils } from "../utils";

// const tabletojson = require('tabletojson').Tabletojson;
// import tabletojson from 'tabletojson';
import { Tabletojson } from 'tabletojson';
import { Prisma } from "@prisma/client";



@Service()
export default class InterfoodService {
  constructor(
    @Inject('logger') private logger: Logger,
    // @Inject('utils') private myUtils: MyUtils,
    // @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshToken: RefreshTokenRepository,
    // @Inject('interFoodType') private interFoodType: InterFoodTypeRepository,
    // @Inject('interFood') private interFood: InterFoodRepository,
    // @Inject('foodProperite') private foodProperite: FoodProperiteRepository,
    // @Inject('food') private food: FoodRepository,
    // @Inject('chDiary') private chDiary: ChDiaryRepository,
    // private interFoodType: InterFoodTypeRepository,
    // private interFood: InterFoodRepository,
    // private foodProperite: FoodProperiteRepository,
    // private food: FoodRepository,
    // private chDiary: ChDiaryRepository,
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
    // var date = new Date(dateTime.getTime());
    // var date = new Date(dateTime.getFullYear(),dateTime.getMonth() , dateTime.getDate())
    const year = dateTime.getFullYear()
    const month = dateTime.getMonth()
    const day = dateTime.getDate()
    // var date = new Date(dateTime.getFullYear())
    // var date = new Date(dateTime.getFullYear())
    // date.setHours(0, 0, 0, 0);
    // console.log(date, dateTime.getFullYear())
    // console.log(formatDate(new Date(
    //   year,
    //   month,
    //   day,
    // )));

    return formatDate(new Date(year, month, day))
  }

  private stringToNumber(num: string) {
    let regex = /[+-]?\d+(\.\d+)?/g;
    return (num)!.match(regex)!.map(function (v) { return parseFloat(v); })[0]
  }

  async import(userId: string, multiLine: string) {
    try {

      interface foodPropFromInterfood {
        '0': string;
        '1': string;
        '2': string;
      }

      let yesterday: string[] = []
      let interfoodImports: InterfoodImport[] = await Promise.all(
        multiLine.trim().split("\n").map(async line => {
          let [createdAt, interFoodType, foodName] = line.trim().split(";")


          let res = ((await Tabletojson.convertUrl(
            `https://www.interfood.hu/getosszetevok/?k=${interFoodType}&d=${createdAt}&l=hu`,
            function (tablesAsJson) {
              return tablesAsJson
            }
          )) as foodPropFromInterfood[][])[0]

          let foodProp: Prisma.FoodProperiteCreateInput = {
            gramm: this.stringToNumber(res[0][2]),
            kcal: this.stringToNumber(res[1][2]),
            fat: this.stringToNumber(res[2][2]),
            ch: this.stringToNumber(res[4][2]),
            portein: this.stringToNumber(res[6][2]),
          }

          if (yesterday && yesterday.includes(createdAt)) {
            const latestDay = yesterday.sort()[yesterday.length - 1]
            let yesterdayAsDay = new Date(latestDay)
            yesterdayAsDay.setDate(yesterdayAsDay.getDate() + 1)
            createdAt = this.withoutTime(yesterdayAsDay)
            yesterday.push(createdAt)
          } else {
            yesterday.push(createdAt)
          }
          return { userId, foodName, foodPortion: 450, createdAt, interFoodType, foodProp }
        }))

      // return { success: true, data: {} }
      return interfoodImports
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

}