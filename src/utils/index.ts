import { prismaClientInstance } from "./db";
// import { generateAccessToken, generateRefreshToken, generateTokens } from "./generateToken";
// import { sendRefreshToken } from "./sendRefreshToken";
import { v4 as uuidv4 } from 'uuid';
import { Password, passwordInstance } from "./password";
import { PrismaClient, User } from "@prisma/client";
import { MyJWT, myJWTInstance } from "./generateToken";
import { Response } from "express";
import sendRefreshToken from "./sendRefreshToken";

class MyUtils {
  constructor(
    public prismaClient: PrismaClient = prismaClientInstance,
    public password: Password = passwordInstance,
    public myJWT: MyJWT = myJWTInstance
  ) { }
  sendRefreshToken(res: Response, token: string) {
    sendRefreshToken(res, token)
  }
}

const myUtilsInstance = new MyUtils(
  prismaClientInstance,
  passwordInstance,
  myJWTInstance
)
export {
  // prismaClientInstance,
  MyUtils,
  Password,
  myUtilsInstance,
  // passwordInstance,
  // generateAccessToken,
  // generateRefreshToken,
  // generateTokens,
  // sendRefreshToken,
  uuidv4
}