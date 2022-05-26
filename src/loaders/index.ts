import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import Logger from './logger';
import express from "express";

//We have to import at least all the events once so they can be triggered
// import './events';
// import * as core from 'express-serve-static-core';

export default async ({ expressApp }: { expressApp: express.Application }): Promise<void> => {

  await dependencyInjectorLoader()
  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};