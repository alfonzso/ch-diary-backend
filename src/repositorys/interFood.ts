import { Interfood, Prisma } from "@prisma/client";
// import {   InterfoodCreateArgs } from "@prisma/client";
// import * as pri from "@prisma/client";
import { Service, Inject } from "typedi";
import { Utils } from "../utils";

@Service()
export default class InterFoodRepository {
  constructor(
    // @Inject('logger') private logger: Logger,
    @Inject('utils') private utils: Utils,
    // @Inject('userRepository') private userRepository: UserRepository,
    // @Inject('refreshToken') private refreshTokenRepository: RefreshTokenRepository,
  ) { }

  public async add(interFood: Prisma.InterfoodCreateArgs) {
    // return this.utils.prismaClient.interfood.create({
    //   data: {
    //     interfoodTypeId: interFood.id
    //   },
    //   ))
    return this.utils.prismaClient.interfood.create({
      data: interFood.data
    })
  }
  // public async get(type: string) {
  //   return this.utils.prismaClient.interfood.({
  //     data: {
  //       foodType: type,
  //     },
  //   })
  // }
}

