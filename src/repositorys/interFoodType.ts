import { Service, Inject } from "typedi";
import { Utils } from "../utils";


@Service()
export default class InterFoodTypeRepository {
  constructor(
    // @Inject('logger') private logger: Logger,
    @Inject('utils') private utils: Utils
  ) { }

  public async add(name: string) {
    return this.utils.prismaClient.interfoodType.create({
      data: {
        name
      }
    });
  }
  public async getByType(name: string) {
    return this.utils.prismaClient.interfoodType.findUnique({
      where: {
        name,
      },
    });
  }
}
