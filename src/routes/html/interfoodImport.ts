import { Router } from "express";
import Container from "typedi";
import { DiaryService, InterfoodService } from "../../services";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";
import { errorMsg, successMsg, warnMsg } from "../../utils/common";
import { InterfoodImport } from "../../types";
import { htmxFolderConfigMap } from "../../../config/htmxFolderConfigMap";

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

  app.get("/import", async (req, res) => {
    console.log("partial render /import")
    try {
      res.render(htmxFolderConfigMap.importInterfood.index,
        { ...req.GlobalTemplates }
      )
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

  app.post('/import',
    body('data')
      .exists()
      .withMessage("Please add some data to import !").bail()
    ,
    validateRequest,
    async (req, res) => {
      console.log("get render POST /import");

      let render = {
        file: './partials/wellcome.hbs', ops: {
        }
      }
      try {
        if (req.user === undefined) {
          warnMsg(res, { msg: "User logged out", content: render.file })
          return
        }

        let trimmedImpData = (req.body.data as string).replace('\r\n', '\n').trim().split('\n').map(row => { return row.trim() })

        if (trimmedImpData === undefined || trimmedImpData.length === 0) {
          errorMsg(res, { msg: "Data was empty, skiping" })
          return
        }

        for (const data in trimmedImpData) {
          if ((trimmedImpData[data].split(";").length - 1) < 2) {
            errorMsg(res, { msg: "Data was invalid, need more than semicolon in data" })
            return
          }
        }

        if (!await _importInterfood(req.user?.id, trimmedImpData)) {
          errorMsg(res, { msg: "Data import from Interfood failed... " })
          return
        }

        successMsg(res, { msg: "Import Big Succcesss" })
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "An error occurred while fetching data." });
      }
    });

}
