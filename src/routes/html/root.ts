import { Router } from "express";
import { checkAccessToken } from "../../middlewares/jwtHandler";

export default (app: Router) => {

  app.get("/", async (req, res) => {
    let render = { file: "", ops: {} }
    console.log("get render /")
    console.log(" isLoggedIn --> ", req.isLoggedIn)

    try {
      if (req.isHtmx) {
        render.file = './partials/wellcome.hbs'
      } else {
        render.file = 'main'
        render.ops = { ...render.ops, layout: 'index' }
      }

      res.render(render.file, { ...render.ops, ...req.GlobalTemplates })
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

  app.get("/navbar", checkAccessToken, async (req, res) => {
    console.log("get render /navbar")
    try {

      let render = {
        file: './partials/navbar.hbs', ops: {}
      }
      render.ops = {
        ...render.ops, ...{
          isLoggedIn: req.isLoggedIn,
          user: req.user,
          exp: req.jwt.refreshExp,
        }
      }

      res.render(render.file, render.ops)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}
