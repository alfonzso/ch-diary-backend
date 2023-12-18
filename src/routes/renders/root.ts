import { Router } from "express";
import { refreshToAccess } from "../../middlewares/jwtHandler";
import pug from "pug";

export default (app: Router) => {
  app.get("/", refreshToAccess, async (req, res) => {
    try {
      let index = pug.compileFile('src/views/main.pug');
      let renderedIndex = index({
        title: "kekekek",
        accessToken: req.decoded?.accessToken,
        isLoggedIn: (req.decoded?.accessToken ?? "").length > 0,
        user: req.decoded?.user,
        exp: req.decoded?.refreshExp
      })
      res.send(renderedIndex)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });
}
