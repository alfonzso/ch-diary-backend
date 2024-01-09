import { Router } from "express";
import Container from "typedi";
import { BadRequest } from "../../errors";
import { UserRepository } from "../../repositorys";
import { DiaryService } from "../../services";
import { param } from "express-validator";
import { validateRequest } from "../../middlewares";
import { toYYYYMMDD, datePlusXDay, range, tzDate } from "../../utils/common";

const INSULIN_RATIO = 4
const MAX_CH_PER_DAY = 180
const configedRange = range(INSULIN_RATIO - 1, INSULIN_RATIO + 2)

const fullDiaryRender = {
  file: 'main',
  ops: {
    layout: 'index', helpers: {
      dynamicPage() { return 'daily_course'; }
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
    "/daily_course_data/date/:date",
    param('date').not().isEmpty().withMessage('date needed!'),
    validateRequest,
    async (req, res) => {
      console.log("get render /daily_course_data");

      let render = {
        file: './partials/wellcome.hbs', ops: {
        }
      }
      try {
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

        render.file = "./partials/daily_course_data.hbs"

        const sumCh = (entriesByDate?.data || []).map((v) => {
          return v.Food.FoodProperty.ch
        }).reduce((prev, curr) => {
          return prev + curr
        })

        const mappedEntry = (entriesByDate?.data || []).map((v) => {
          return {
            id: v.id,
            FoodName: v.Food.name,
            FoodPortion: v.Food.portion,
            FoodType: v.Food.Interfood.InterfoodType.name,
            FoodProp: Object.entries(v.Food.FoodProperty).map(([k, v]) => { return [k, v] }),
            ChRatio: {
              ch: v.Food.FoodProperty.ch,
              insulinRation: INSULIN_RATIO,
              ratios: configedRange.map(num => {
                return [num, (v.Food.FoodProperty.ch / num).toPrecision(2)]
              })
            }
          }
        })

        const pager = {
          yesterDay: toYYYYMMDD(datePlusXDay(-1, req.params.date)),
          todayFromParams: req.params.date,
          now: toYYYYMMDD(tzDate()),
          nextDay: toYYYYMMDD(datePlusXDay(1, req.params.date)),
        }
        // console.log("pager----> ", pager)

        render.ops = {
          ...render.ops, ...{
            sumCh,
            leftCh: MAX_CH_PER_DAY - sumCh,
            pager,
            entriesByDate: mappedEntry,
            helpers: {
              dynamicPage() { return 'daily_course_data'; }
            }
          }
        }

        res.render(render.file, render.ops)
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "An error occurred while fetching data." });
      }
    });

  app.get("/daily_course", async (req, res) => {
    console.log("get render /daily_course");
    let render = { file: '', ops: {} }
    try {

      if (!req.isLoggedIn) {
        return res.render('main', {
          layout: 'index',
        });
      }

      if (req.isHtmx) {
        render.file = './partials/daily_course.hbs'
      } else {
        render = fullDiaryRender
      }

      res.render(render.file, { ...render.ops, ...req.GlobalTemplates })

    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}
