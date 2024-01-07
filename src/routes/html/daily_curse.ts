import { Router } from "express";
import Container from "typedi";
import { BadRequest } from "../../errors";
import { UserRepository } from "../../repositorys";
import { DiaryService } from "../../services";
import { param } from "express-validator";
import { validateRequest } from "../../middlewares";
import { range } from "../../utils/common";

const INSULIN_RATIO = 4
const configedRange = range(INSULIN_RATIO - 1, INSULIN_RATIO + 2)

const fullDiaryRender = {
  file: 'main',
  ops: {
    layout: 'index', helpers: {
      dynamicPage() { return 'daily_curse'; }
    }
  }
}

type EntryByDateType = {
  success: boolean;
  data: {
    id: string;
    createdAt: Date;
    User: {
      email: string;
    };
    Food: {
      Interfood: {
        InterfoodType: {
          name: string;
        };
      };
      FoodProperty: {
        gramm: number;
        energy: number;
        protein: number;
        fat: number;
        ch: number;
      };
      name: string;
      portion: number;
    };
  }[]
}

const getEntriesByDate = async (nickname: string, date: Date): Promise<EntryByDateType> => {
  const user = await Container.get(UserRepository).findUserByNickName(nickname)
  if (!user) throw new BadRequest('Nick not exists')
  return await Container.get(DiaryService).getEntryByUserNickNameAndDate(user, date)
}

export default (app: Router) => {

  app.get(
    "/daily_curse_data/date/:date",
    param('date').not().isEmpty().withMessage('date needed!'),
    validateRequest,
    // isAuthenticated,
    async (req, res) => {
      console.log("at /diary_data");
      let render = {
        file: './partials/wellcome.hbs', ops: {
        }
      }
      try {
        // let diary = pug.compileFile('src/views/__diary.pug');
        if (!req.isLoggedIn || req.user === undefined) {
          res.send(render.file)
          return
        }

        let entriesByDate: EntryByDateType | null = null
        try {
          entriesByDate = await getEntriesByDate(req.user.nickname, new Date(req.params.date as string))
        } catch (err) {
          console.log("----------> meh")
        }

        render.file = "./partials/daily_curse_data.hbs"

        const mappedEntry = (entriesByDate?.data || []).map((v) => {
          return {
            id: v.id,
            FoodName: v.Food.name,
            FoodPortion: v.Food.portion,
            FoodType: v.Food.Interfood.InterfoodType.name,
            // FoodProp: v.Food.FoodProperty,
            FoodProp: Object.entries(v.Food.FoodProperty).map(([k, v]) => {
              return [k, v]
            }),
            ChRatio: {
              ch: v.Food.FoodProperty.ch,
              insulinRation: INSULIN_RATIO,
              // ratios: Array(INSULIN_RATIO).fill(0).map((_, i) => {
              //   const currentRatio = i + INSULIN_RATIO
              //   return [currentRatio, (v.Food.FoodProperty.ch / currentRatio).toPrecision(2)]
              // }),
              ratiosss: configedRange.map(num => {
                return [num, (v.Food.FoodProperty.ch / num).toPrecision(2)]
              })
            }
          }
        })

        render.ops = {
          ...render.ops, ...{
            entriesByDate: mappedEntry,
            helpers: {
              dynamicPage() { return 'daily_curse_data'; }
            }
          }
        }

        res.render(render.file, render.ops)
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "An error occurred while fetching data." });
      }
    });

  app.get("/daily_curse", async (req, res) => {
    console.log("get render /daily_curse");
    let render = { file: '', ops: {} }
    try {

      if (!req.isLoggedIn) {
        return res.render('main', {
          layout: 'index',
        });
      }

      if (req.isHtmx) {
        render.file = './partials/daily_curse.hbs'
      } else {
        render = fullDiaryRender
      }

      res.render(render.file, render.ops)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}
