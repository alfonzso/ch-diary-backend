import { Router } from "express";
import { checkAccessToken } from "../../middlewares/jwtHandler";
// import pug from "pug";
// import { _login } from "../auth";

export default (app: Router) => {

  app.get("/", async (req, res) => {
    let render = { file: "", ops: {} }
    console.log("at /")

    console.log(" isLoggedIn --> ", req.isLoggedIn)
    // console.log(" user --> ", req.user)
    // console.log(" jwt --> ", req.jwt)

    try {
      // res.setHeader("HX-Redirect", "/login")
      // res.setHeader("HX-Redirect", "/")
      // res.end()
      // return

      if (req.isHtmx) {
        render.file = './partials/wellcome.hbs'
        // render.ops = { ...render.ops, ...{ layout: false } }
        // render.ops = { ...render.ops, layout: './../main' }
      } else {
        render.file = 'main'
        render.ops = { ...render.ops, layout: 'index' }
        // render.ops = { ...render.ops, ...{ layout: false } }
        // render = fullLoginRender
      }

      render.ops = {
        ...render.ops, ...{
          isLoggedIn: req.isLoggedIn,
          user: req.user,
          exp: (req.jwt || {}).refreshExp,
        }
      }

      res.render(render.file, render.ops)
      // res.render('main', {
      //   layout: 'index',
      //   isLoggedIn: req.isLoggedIn,
      //   user: req.user,
      //   exp: (req.jwt || {}).refreshExp,
      // });
      // res.setHeader("HX-Redirect", "/login")
      // res.status(200)
      // res.sendStatus(200)
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
