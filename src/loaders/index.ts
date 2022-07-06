import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import Logger from './logger';
import express from "express";
import { PrismaClient } from '@prisma/client';

//We have to import at least all the events once so they can be triggered
// import './events';
// import * as core from 'express-serve-static-core';

export default async ({ expressApp }: { expressApp: express.Application }): Promise<void> => {

  await dependencyInjectorLoader()
  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');

  await isDbHealthy();
  Logger.info('✌️ Prisma loaded');
};

async function isDbHealthy(): Promise<any> {
  try {
    await new PrismaClient().$queryRaw`SELECT 1`;
    return true
  } catch (e) {
    console.log(e);
    throw new Error("Prisma check failed");
  }
}