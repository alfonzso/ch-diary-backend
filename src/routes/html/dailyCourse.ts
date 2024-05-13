import { Router } from "express";
import Container from "typedi";
import { BadRequest } from "../../errors";
import { UserRepository } from "../../repositorys";
import { DiaryService } from "../../services";
import { param } from "express-validator";
import { validateRequest } from "../../middlewares";
import { toYYYYMMDD, datePlusXDay, range, tzDate, getDayName } from "../../utils/common";
import { htmxFolderConfigMap } from "../../../config/htmxFolderConfigMap";

const INSULIN_RATIO = 6
const MAX_CH_PER_DAY = 180
const configedRange = range(INSULIN_RATIO - 2, INSULIN_RATIO + 1)

export const getDailyCurses = () => {
  let render = { file: '', ops: {} }
  render.file = htmxFolderConfigMap.dailyCourse.index
  render.ops = {
    today: toYYYYMMDD(tzDate())
  }
  return render
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

  app.get("/daily-course", async (req, res) => {
    console.log("partial render /daily-course");
    try {
      const render = getDailyCurses()
      res.render(render.file, {
        ...render.ops, ...req.GlobalTemplates
      })
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

  app.get(
    "/daily-course/date/:date",
    param('date').not().isEmpty().withMessage('date needed!'),
    validateRequest,
    async (req, res) => {
      console.log("get render /daily-course");

      let render = {
        file: './partials/wellcome.hbs', ops: {
        }
      }
      try {
        if (req.user === undefined) {
          res.send(render.file)
          return
        }

        let entriesByDate: EntryByDateType | null = null
        try {
          entriesByDate = await getEntriesByDate(req.user.nickname, new Date(req.params.date as string))
        } catch (err) {
          console.log("----------> meh")
        }

        render.file = "./partials/_daily_course/_daily_course.hbs"

        const sumCh = (entriesByDate?.data || []).map((v) => {
          return v.Food.FoodProperty.ch
        }).reduce((prev, curr) => {
          return prev + curr
        }, 0)


        const mappedEntry = (entriesByDate?.data || []).map((v) => {
          return {
            id: v.id,
            FoodName: v.Food.name,
            FoodPortion: v.Food.portion,
            FoodType: v.Food.Interfood.InterfoodType.name,
            FoodProp: {
              names: Object.keys(v.Food.FoodProperty),
              values: Object.values(v.Food.FoodProperty),
              calculatedValues: Object.values(v.Food.FoodProperty).map(vv => vv * (v.Food.portion / 100)),
            },
            ChRatio: {
              ch: (v.Food.portion / 100) * v.Food.FoodProperty.ch,
              insulinRation: INSULIN_RATIO,
              ratiosWhInsulin: {
                ratio: configedRange,
                insulin: configedRange.map(num => {
                  return ((v.Food.portion / 100) * v.Food.FoodProperty.ch / num).toPrecision(2)
                })
              },
            }
          }
        })

        const pager = {
          yesterDay: toYYYYMMDD(datePlusXDay(-1, req.params.date)),
          todayFromParams: req.params.date,
          todayName: getDayName(new Date(req.params.date)),
          now: toYYYYMMDD(tzDate()),
          nextDay: toYYYYMMDD(datePlusXDay(1, req.params.date)),
        }

        render.ops = {
          ...render.ops, ...{
            sumCh: Math.floor(sumCh),
            leftCh: Math.floor(MAX_CH_PER_DAY - sumCh),
            pager,
            entriesByDate: mappedEntry,
          }
        }

        res.render(render.file, render.ops)
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "An error occurred while fetching data." });
      }
    });

}
