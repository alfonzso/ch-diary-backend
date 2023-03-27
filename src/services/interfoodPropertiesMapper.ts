import { Tabletojson } from 'tabletojson';
import { Service, Inject } from "typedi";
import { Logger } from "winston";
import { fixedDate, stringToNumber, translateKeyToEng } from '../utils/common';
import 'cross-fetch/polyfill';

type table = {
  '0': string;
  '1': string;
  '2': string;
}[][]

type foodProperties = {
  energy: number
  fat: number
  ch: number
  protein: number
  salt: number
}

type foodPropertiesWithGramm = { avgNutritionInGramm: number } & foodProperties

type mapStrNum = {
  [x: string]: number;
}[]


@Service()
export default class InterfoodPropertyMapper {
  empty = {
    avgNutritionInGramm: 0,
    energy: 0,
    fat: 0,
    ch: 0,
    protein: 0,
    salt: 0,
  }

  fid: string = "undefined"

  constructor(
    @Inject('logger') private logger: Logger,
  ) {
  }

  setFid(fid: string) {
    this.fid = fid
  }

  getNettoWeightFromString(interfoodBodyText: string) {
    return [...interfoodBodyText.matchAll(/>Nettó tömeg: (?<netto>\d+)/g)].map(matchArr => {
      let groups = matchArr.groups
      if (groups) {
        return parseInt(groups.netto)
      } else {
        return 0
      }
    }).reduce((p, c) => p + c)
  }

  mappingTables(beforeMapping: mapStrNum) {
    let onlyTranslatedFields = beforeMapping.filter(v => !Object.keys(v).flat().includes(''))
    let mergedTable = onlyTranslatedFields.reduce(function (result, current) {
      return Object.assign(result, current);
    }, {}) as foodPropertiesWithGramm
    return mergedTable
  }

  async getPropertiesFromInterfood(interFoodType: string, createdAt: Date) {
    const interfoodUrl = `https://www.interfood.hu/getosszetevok/?k=${interFoodType}&d=${fixedDate(createdAt)}&l=hu`
    const resp = await fetch(interfoodUrl)
    const bodyText = await resp.text()
    const foodPortion = this.getNettoWeightFromString(bodyText)
    this.logger.debug(`${this.fid}: interfoodUrl: ${interfoodUrl}`)
    this.logger.debug(`${this.fid}: foodPortion: ${foodPortion}`)
    return { foodPortion, table: Tabletojson.convert(bodyText) as table }
  }

  mapProperitesFromTableToFoodProperties(table: table) {

    const mappedMyTablet = table.map(v =>
      this.mappingTables(v.map(vv => {
        return { [translateKeyToEng(vv[0])]: stringToNumber(vv[2]) }
      }))
    )

    this.logger.debug(`${this.fid}: mappedMyTablet: ${mappedMyTablet}`)

    let summedFoodProperties = mappedMyTablet.reduce((prev, cur, i) => i === 0 ? cur :
      Object.entries(cur)
        .reduce(
          (ac, [key, value]) =>
            ({ ...ac, [key as keyof foodProperties]: value + prev[key as keyof foodProperties] }), this.empty
        )
      , this.empty
    )

    this.logger.debug(`${this.fid}: summedFoodProperties: ${summedFoodProperties}`)

    return {
      gramm: mappedMyTablet.map(v => v.avgNutritionInGramm).reduce((p, v) => p + v) / mappedMyTablet.length,
      energy: summedFoodProperties.energy,
      fat: summedFoodProperties.fat,
      ch: summedFoodProperties.ch,
      protein: summedFoodProperties.protein,
    }
  }

  public async interfoodMapper(interFoodType: string, createdAt: Date) {
    let { foodPortion, table } = await this.getPropertiesFromInterfood(interFoodType, createdAt)
    return { foodPortion, foodProp: this.mapProperitesFromTableToFoodProperties(table) }
  }

}