import { prismaClientInstance } from "./db";
import { v4 as uuidv4 } from 'uuid';
import { PasswordManager, passwordManagerInstance } from "./password";
import { PrismaClient } from "@prisma/client";
import { TokenManager, tokenManagerInstance } from "./generateToken";
import { Response } from "express";
import sendRefreshToken from "./sendRefreshToken";
import Container from "typedi";
import { Logger } from "winston";
import util from 'util';


class Utils {
  constructor(
    public prismaClient: PrismaClient = prismaClientInstance,
    public passwordManager: PasswordManager = passwordManagerInstance,
    public tokenManager: TokenManager = tokenManagerInstance
  ) { }
  sendRefreshToken(res: Response, token: string) {
    sendRefreshToken(res, token)
  }
  logger(...msg: any) {
    const logger: Logger = Container.get('logger');
    logger.silly(util.format(...msg))
  }
}

const utilsInstance = new Utils(
  prismaClientInstance,
  passwordManagerInstance,
  tokenManagerInstance
)
export {
  Utils,
  PasswordManager,
  TokenManager,
  utilsInstance,
  uuidv4,
}