import { Router } from "express";
import { refreshToAccess } from '../../middlewares/jwtHandler';
import pug from "pug";

export default (app: Router) => {

  app.get("/login", refreshToAccess, async (req, res) => {
    try {
      let login = pug.compileFile('src/views/_login.pug');

      let renderedLogin = login({
        // title: "kekekek",
        // accessToken: req.decoded?.accessToken,
        // isLoggedIn: (req.decoded?.accessToken ?? "").length > 0,
        // user: req.decoded?.user,
        // exp: req.decoded?.refreshExp,
        // diaries: diaryData,
        // diaryDataKeys: diaryDataKeys,
        // diaries: diaries?.data ?? [],
      })

      res.send(renderedLogin)

    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}
