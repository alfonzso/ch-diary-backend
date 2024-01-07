import { Router } from "express";
import Container from "typedi";
import { BadRequest } from "../../errors";
import { UserRepository } from "../../repositorys";
import { DiaryService } from "../../services";

const fullDiaryRender = {
  file: 'main',
  ops: {
    layout: 'index', helpers: {
      dynamicPage() { return 'diary'; }
    }
  }
}

const getEntry = async (nickname: string) => {
  const diaryServiceInstance = Container.get(DiaryService);
  const user = await Container.get(UserRepository).findUserByNickName(nickname)
  if (!user) throw new BadRequest('Nick not exists')
  return await diaryServiceInstance.getEntryByUserId(user)
}

export default (app: Router) => {

  app.get("/diary_data", async (req, res) => {
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

      let diaries = null
      try {
        diaries = await getEntry(req.user.nickname)
      } catch (err) {
        console.log("----------> meh")
      }

      console.log("------------------> ", req.user.nickname, diaries)

      let diaryData = (diaries?.data ?? []).map(v => {
        return {
          date: v.createdAt.toISOString().split('T')[0],
          type: v.Food.Interfood.InterfoodType.name,
          name: v.Food.name,
          portion: v.Food.portion,
          ...v.Food.FoodProperty,
        }
      })

      render.file = "./partials/diary_data.hbs"
      render.ops = {
        ...render.ops, ...{
          diaryHeaders: Object.keys(diaryData[0]),
          diaries: diaryData,
          helpers: {
            dynamicPage() { return 'diary'; }
          }
        }
      }

      res.render(render.file, render.ops)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

  app.get("/diary", async (req, res) => {
    console.log("at /diary");
    let render = { file: '', ops: {} }
    try {

      if (!req.isLoggedIn) {
        return res.render('main', {
          layout: 'index',
        });
      }

      if (req.isHtmx) {
        render.file = './partials/diary.hbs'
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
