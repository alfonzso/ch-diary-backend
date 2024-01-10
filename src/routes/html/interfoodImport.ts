import { Router } from "express";
import Container from "typedi";
import { BadRequest } from "../../errors";
import { UserRepository } from "../../repositorys";
import { DiaryService, InterfoodService } from "../../services";
import { body, param } from "express-validator";
import { validateRequest } from "../../middlewares";
import { toYYYYMMDD, datePlusXDay, range, tzDate, getDayName } from "../../utils/common";
import { FailToAddNewEntryError } from "../../errors/failToAddNewEntry";
import { InterfoodImport } from "../../types";

// const INSULIN_RATIO = 4
// const MAX_CH_PER_DAY = 180
// const configedRange = range(INSULIN_RATIO - 2, INSULIN_RATIO + 1)

// const fullDiaryRender = {
//   file: 'main',
//   ops: {
//     layout: 'index', helpers: {
//       dynamicPage() { return '_daily_course/_index'; }
//     }
//   }
// }


// import { NextFunction, Response, Router } from 'express';
// import { isAuthenticated, validateRequest } from '../middlewares';
// import { DiaryService, InterfoodService } from '../services';
// import { Container } from 'typedi';
// import { Logger } from 'winston';
// import { InterfoodImport, UserPayload } from '../types';
// import { body } from 'express-validator';
// import { FailToAddNewEntryError } from '../errors/failToAddNewEntry';
// import { BadRequest } from '../errors';

// const route = Router();

// export default (app: Router) => {
//   app.use('/interfood', route);

//   interface RegisterRequest<T> extends Express.Request {
//     body: T
//     user?: UserPayload
//   }

//   route.post(
//     '/import',
//     body('data')
//       .exists()
//       .withMessage("Please add some data to import !").bail()
//       .isArray({ min: 0 })
//       .withMessage('Data must be an array with at least one element !')
//     ,
//     validateRequest,
//     isAuthenticated,
//     async (req: RegisterRequest<{ data: string[], payload: UserPayload }>, res: Response, next: NextFunction) => {
//       const logger: Logger = Container.get('logger');
//       try {
//         if (!req.user) throw new BadRequest("User not exists")

//         const interFoodTypeInstance = Container.get(InterfoodService);
//         const diaryServiceInstance = Container.get(DiaryService);
//         const importedFoodList: InterfoodImport[] = await interFoodTypeInstance.import(req.user.id, req.body.data)

//         for (const food of importedFoodList) {
//           const { success } = await diaryServiceInstance.addNewEntry({ userDTO: { id: food.userId! }, foodPortion: food.foodPortion!, foodProp: food.foodProp!, ...food });
//           if (!success) throw new FailToAddNewEntryError()
//         }

//         return res.status(200).json({ importedFoodList });
//       } catch (e) {
//         logger.error('🔥 error: %o', e);
//         return next(e);
//       }
//     });

// }

// const getEntriesByDate = async (nickname: string, date: Date): Promise<EntryByDateType> => {
//   const user = await Container.get(UserRepository).findUserByNickName(nickname)
//   if (!user) throw new BadRequest('Nick not exists')
//   return await Container.get(DiaryService).getEntryByUserNickNameAndDate(user, date)
// }

const _importInterfood = async (userId: string, data: string[]) => {
  const importedFoodList: InterfoodImport[] = await Container.get(InterfoodService)
    .import(userId, data)
  for (const food of importedFoodList) {
    const { success } = await Container.get(DiaryService).addNewEntry({
      userDTO: { id: food.userId! },
      foodPortion: food.foodPortion!,
      foodProp: food.foodProp!,
      ...food
    });
    if (!success) {
      return false
    }
  }
  return true
}

export default (app: Router) => {

  app.post('/import',
    body('data')
      .exists()
      .withMessage("Please add some data to import !").bail()
    // .isArray({ min: 0 })
    // .withMessage('Data must be an array with at least one element !')
    ,
    validateRequest,
    async (req, res) => {
      console.log("get render POST /import");

      let render = {
        file: './partials/wellcome.hbs', ops: {
        }
      }
      try {
        if (!req.isLoggedIn || req.user === undefined) {
          res.send(render.file)
          return
        }

        let trimmedImpData = (req.body.data as string).replace('\r\n', '\n').trim().split('\n').map(row => { return row.trim() })

        console.log("-----------> ", trimmedImpData)

        if (trimmedImpData === undefined || trimmedImpData.length === 0) {
          res.setHeader('HX-Trigger', JSON.stringify({ "showErrorMessage": "Data was empty, skiping" }))
          res.status(400).send()
          return
        }

        for (const data in trimmedImpData) {
          if ((trimmedImpData[data].split(";").length - 1) < 2) {
            res.setHeader('HX-Trigger', JSON.stringify({ "showErrorMessage": "Data was invalid, need more than semicolon in data" }))
            res.status(400).send()
            return
          }
        }

        if (!await _importInterfood(req.user?.id, trimmedImpData)) {
          res.setHeader('HX-Trigger', JSON.stringify({ "showErrorMessage": "Data import from Interfood failed... " }))
          res.status(400).send()
          return
        }

        res.setHeader('HX-Trigger', JSON.stringify({ "showSuccessMessage": "Import Big Succcesss" }))
        res.status(201).send()
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "An error occurred while fetching data." });
      }
    });

  app.get("/import", async (req, res) => {
    console.log("get render /import")

    let render = {
      file: './partials/wellcome.hbs', ops: {}
    }
    try {

      if (!req.isLoggedIn || req.user === undefined) {
        res.send(render.file)
        return
      }

      render = {
        file: './partials/_import_interfood/_index.hbs', ops: {}
      }

      res.render(render.file, { ...render.ops, ...req.GlobalTemplates })
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}
