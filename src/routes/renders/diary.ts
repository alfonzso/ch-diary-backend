import { Router } from "express";
import { refreshToAccess } from '../../middlewares/jwtHandler';
import pug from "pug";
import { getEntry } from "../diary";

export default (app: Router) => {

  app.get("/diary_data", refreshToAccess, async (req, res) => {
    console.log("at /diary_data");
    try {
      let diary = pug.compileFile('src/views/__diary.pug');

      let diaries = null
      try {
        diaries = await getEntry(req.decoded?.user.nickname ?? "")
      } catch (err) {
        console.log("----------> meh")
      }

      console.log("------------------> ", req.decoded?.user.nickname, diaries)

      let diaryData = (diaries?.data ?? []).map(v => {
        return {
          date: v.createdAt.toISOString().split('T')[0],
          type: v.Food.Interfood.InterfoodType.name,
          name: v.Food.name,
          portion: v.Food.portion,
          ...v.Food.FoodProperty,
        }
      })

      let diaryDataKeys = Object.keys(diaryData[0])

      diaryDataKeys.forEach(v => {
        console.log("-->", v)
      })

      diaryData.forEach(v => {
        console.log(v)
      })

      let renderedIndex = diary({
        accessToken: req.decoded?.accessToken,
        isLoggedIn: (req.decoded?.accessToken ?? "").length > 0,
        user: req.decoded?.user,
        exp: req.decoded?.refreshExp,
        diaries: diaryData,
        diaryDataKeys: diaryDataKeys,
      })

      res.send(renderedIndex)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

  app.get("/diary", refreshToAccess, async (req, res) => {
    console.log("at /diary");
    try {
      let diary = null
      diary = pug.compileFile('src/views/_diary.pug');
      diary = diary({
        accessToken: req.decoded?.accessToken,
        isLoggedIn: (req.decoded?.accessToken ?? "").length > 0,
        user: req.decoded?.user,
        exp: req.decoded?.refreshExp,
      })

      res.send(diary)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}
