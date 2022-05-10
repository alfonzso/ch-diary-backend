import { prismaClientInstance } from "./db";
import { v4 as uuidv4 } from 'uuid';
import { Password, passwordInstance } from "./password";
import { PrismaClient } from "@prisma/client";
import { MyJWT, myJWTInstance } from "./generateToken";
import { Response } from "express";
import sendRefreshToken from "./sendRefreshToken";
import Container from "typedi";
import { Logger } from "winston";
import util from 'util';


class MyUtils {
  constructor(
    public prismaClient: PrismaClient = prismaClientInstance,
    public password: Password = passwordInstance,
    public myJWT: MyJWT = myJWTInstance
  ) { }
  sendRefreshToken(res: Response, token: string) {
    sendRefreshToken(res, token)
  }
  logger(...msg: any) {
    const logger: Logger = Container.get('logger');
    logger.silly(util.format(...msg))
  }
}

const myUtilsInstance = new MyUtils(
  prismaClientInstance,
  passwordInstance,
  myJWTInstance
)
export {
  MyUtils,
  Password,
  MyJWT,
  myUtilsInstance,
  uuidv4,
}