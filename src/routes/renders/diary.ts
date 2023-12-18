import { Router } from "express";
import { refreshToAccess } from '../../middlewares/jwtHandler';
import pug from "pug";
import { getEntry } from "../diary";

// export default () => {
//   const app = Router();
//   app.get("/diary", refreshToAccess, async (req, res) => {
//     try {
//       let index = pug.compileFile('src/views/_diary.pug');

//       let renderedIndex = index({
//         // title: "kekekek",
//         accessToken: req.decoded?.accessToken,
//         isLoggedIn: (req.decoded?.accessToken ?? "").length > 0,
//         user: req.decoded?.user,
//         exp: req.decoded?.refreshExp,
//         diaries: getEntry(req.decoded?.user.nickname ?? ""),
//       })

//       res.send(renderedIndex)
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       res.status(500).json({ error: "An error occurred while fetching data." });
//     }
//   });
//   return app
// }

export default (app: Router) => {

  app.get("/diary", refreshToAccess, async (req, res) => {
    try {
      let index = pug.compileFile('src/views/_diary.pug');

      let diaries = null
      try {
        diaries = await getEntry(req.decoded?.user.nickname ?? "")
      } catch (err) {
        console.log("----------> meh")
        // res.setHeader("HX-Redirect", "/")
        // res.end()
        // return
      }

      console.log("------------------> ", req.decoded?.user.nickname, diaries)

      let diaryData = (diaries?.data ?? []).map(v => {
        return {
          date: v.createdAt.toISOString().split('T')[0],
          name: v.Food.name,
          type: v.Food.Interfood.InterfoodType.name,
          portion: v.Food.portion,
          ...v.Food.FoodProperty,
        }
      })

      let diaryDataKeys = diaryData.map(v => Object.keys(v)).flat()

      diaryDataKeys.forEach(v => {
        console.log("-->", v)
      })

      diaryData.forEach(v => {
        console.log(v)
      })


      // diaries?.data.forEach(v=>{
      //   console.log(v.Food)
      // })

      let renderedIndex = index({
        // title: "kekekek",
        accessToken: req.decoded?.accessToken,
        isLoggedIn: (req.decoded?.accessToken ?? "").length > 0,
        user: req.decoded?.user,
        exp: req.decoded?.refreshExp,
        diaries: diaryData,
        diaryDataKeys: diaryDataKeys,
        // diaries: diaries?.data ?? [],
      })

      res.send(renderedIndex)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}

// import { Router } from "express";

// export default (app: Router) => {

//   app.get("/diary", async (_, res) => {
//     try {
//       let diary = pug.compileFile('src/views/_diary.pug');

//       // res.render("src/views/_diary.pug");
//       let renderedIndex = index({
//         title: "kekekek",
//         accessToken: req.decoded?.accessToken,
//         isLoggedIn: (req.decoded?.accessToken ?? "").length > 0,
//         user: req.decoded?.user,
//         exp: req.decoded?.refreshExp
//       })
//       res.send(renderedIndex)

//     } catch (error) {
//       console.error("Error fetching data:", error);
//       res.status(500).json({ error: "An error occurred while fetching data." });
//     }
//   });

// }