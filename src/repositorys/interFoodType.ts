import { InterfoodType, Prisma } from "@prisma/client";
import { Service, Inject } from "typedi";
import { Utils } from "../utils";


@Service()
export default class InterFoodTypeRepository {
  constructor(
    // @Inject('logger') private logger: Logger,
    @Inject('utils') private utils: Utils
  ) { }

  public async add(name: string): Promise<InterfoodType> {
    const checkType = await this.getByType(name)
    if (checkType?.id && checkType?.id.length > 0) return checkType
    console.log("checkType :", checkType, "name: ", name)
    return await this.utils.prismaClient.interfoodType.create({
      data: {
        name
      }
    });
  }
  public async getByType(name: string): Promise<InterfoodType | null> {
    return await this.utils.prismaClient.interfoodType.findUnique({
      where: {
        name,
      },
    });
  }
}
