import { Router } from "express";
import Container from "typedi";
import { BadRequest } from "../../errors";
import { UserRepository } from "../../repositorys";
import { DiaryService } from "../../services";
import { htmxFolderConfigMap } from "../../../config/htmxFolderConfigMap";

const getEntry = async (nickname: string) => {
  const diaryServiceInstance = Container.get(DiaryService);
  const user = await Container.get(UserRepository).findUserByNickName(nickname)
  if (!user) throw new BadRequest('Nick not exists')
  return await diaryServiceInstance.getEntryByUserId(user)
}

export const getAllDiary = () => {
  let render = { file: '', ops: {} }
  render.file = htmxFolderConfigMap.all_diary.index
  render.ops = {}
  return render
}

export default (app: Router) => {

  app.get("/diary", async (req, res) => {
    console.log("get partial /diary");
    try {
      const render = getAllDiary()
      res.render(render.file,
        { ...render.ops, ...req.GlobalTemplates }
      )
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

  app.get("/all-diary", async (req, res) => {
    console.log("get render /all-diary");
    let render = {
      file: './partials/wellcome.hbs', ops: {
      }
    }
    try {
      if (!req.isLoggedIn || req.user === undefined) {
        res.send(render.file)
        return
      }

      let diaries = null
      try {
        diaries = await getEntry(req.user.nickname)
      } catch (err) {
        console.log("----------> meh")
      }

      let diaryData = (diaries?.data ?? []).map(v => {
        return {
          date: v.createdAt.toISOString().split('T')[0],
          type: v.Food.Interfood.InterfoodType.name,
          name: v.Food.name,
          portion: v.Food.portion,
          ...v.Food.FoodProperty,
        }
      })

      diaryData.sort((a, b) => a.date.localeCompare(b.date))

      const diaryDatas = {
        diaryHeaders: Object.keys(diaryData[0]),
        diaries: diaryData.map((v) => { return Object.entries(v).map(([k, v]) => [k, v]) }),
        helpers: {
          dynamicPage() { return './partials/_all_diary/_index.hbs'; }
        }
      }

      res.render("./partials/_all_diary/diary.hbs",
        { ...render.ops, ...diaryDatas }
      )
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}
