import { NextFunction, Request, Response, Router } from 'express';
import { isAuthenticated, validateRequest } from '../middlewares';
import { DiaryService } from '../services/';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { addNewEntry } from '../types';
import { body, param } from 'express-validator';
import { UserRepository } from '../repositorys';
import { BadRequest } from '../errors';

// import fetch from "node-fetch";
import fetch from 'cross-fetch';
import { Tabletojson } from 'tabletojson';

const route = Router();

export default (app: Router) => {
  app.use('/diary', route);

  // TODO: id ---> to ---> email or nickname ( id toooo long, like it here: /getEntry/id/:id' )

  route.post(
    '/addNewEntry',
    body('userDTO.id').not().isEmpty(),
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const diaryServiceInstance = Container.get(DiaryService);
        const newEntry: addNewEntry = req.body
        const response = await diaryServiceInstance.addNewEntry(newEntry)

        return res.status(200).json({ ...response, data: req.payload });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });

  route.get(
    '/getEntry/nickname/:nickname',
    param('nickname').not().isEmpty().withMessage('id needed!'),
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const diaryServiceInstance = Container.get(DiaryService);
        const user = await Container.get(UserRepository).findUserByNickName(req.params.nickname as string)
        if (!user) throw new BadRequest('Nick not exists')
        console.log(user)
        const response = await diaryServiceInstance.getEntryByUserId(user)

        return res.status(200).json({ ...response });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });

  route.get(
    '/getEntry/nickname/:nickname/date/:date',
    param('nickname').not().isEmpty().withMessage('id needed!'),
    param('date').not().isEmpty().withMessage('date needed!'),
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const diaryServiceInstance = Container.get(DiaryService);
        const user = await Container.get(UserRepository).findUserByNickName(req.params.nickname as string)
        if (!user) throw new BadRequest('Nick not exists')
        const date: Date = new Date(req.params.date as string)
        const response = await diaryServiceInstance.getEntryByUserNickNameAndDate(user, date)

        return res.status(200).json({ ...response });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });



  route.get('/fetchinterfood', async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    try {
      const resp = await fetch('https://www.interfood.hu/getosszetevok/?k=D7&d=2022-05-27&l=hu') //.then(resp => console.log(resp))
      const bodyText = await resp.text()
      // console.log(bodyText)
      const ress = Tabletojson.convert(
        bodyText
      )
      // Nettó tömeg:.match(/ain.*/);
      const match = bodyText.matchAll(/>Nettó tömeg: (\d+)/g)

      // console.log(ress, [...match ][0]);

      const url =
        'https://stackoverflow.com/questions/432493/how-do-you-access-the-matched-groups-in-a-javascript-regular-expression?some=parameter';
      const regex = /(?<protocol>https?):\/\/(?<hostname>[\w-\.]*)\/(?<pathname>[\w-\./]+)\??(?<querystring>.*?)?$/;
      // const { groups: segments } = url.match(regex);
      const { groups: segments } = url.match(regex)!;
      console.log(segments);

      const { groups: netto } = bodyText.match(/>Nettó tömeg: (?<netto>\d+)/)!;
      console.log(netto!.netto);


      return res.status(200).json({});
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });


  route.get('/test', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    try {
      const authServiceInstance = Container.get(DiaryService);
      const response = await authServiceInstance.Test()
      return res.status(200).json({ ...response, data: req.payload });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });

  route.get('/test1', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    try {
      const authServiceInstance = Container.get(DiaryService);
      const response = await authServiceInstance.Test1()
      return res.status(200).json({ ...response, data: req.payload });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });
}