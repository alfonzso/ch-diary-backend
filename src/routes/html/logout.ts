import { Router } from "express";
import { clearAllCookies } from "../../utils/common";
// import { refreshToAccess } from '../../middlewares/jwtHandler';
// import pug from "pug";

export default (app: Router) => {

  app.get("/logout", async (req, res) => {
    console.log("get render /logout");
    try {
      let render = {
        file: './partials/wellcome.hbs', ops: {
        }
      }

      clearAllCookies(req, res)

      res.setHeader("HX-Trigger", "logoutSuccess")
      res.setHeader("HX-Redirect", "/")

      res.render(render.file, render.ops)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}
