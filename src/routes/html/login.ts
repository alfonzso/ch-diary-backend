import { Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import Container from "typedi";
import AuthService from "../../services/auth";
import config from "../../../config";
import { User } from "@prisma/client";
import ms from "ms";
// import config from '../../config';

const fullLoginRender = {
  file: 'main',
  ops: {
    layout: 'index', helpers: {
      dynamicPage() { return 'login'; }
    }
  }
}

export default (app: Router) => {

  app.get("/login", async (req, res) => {
    console.log("render /login ")
    let render = { file: "", ops: {} }
    try {

      if (req.isLoggedIn) {
        return res.render('main', {
          layout: 'index',
        });
      }

      if (req.isHtmx) {
        render.file = './partials/login.hbs'
      } else {
        render = fullLoginRender
      }

      console.log(render.file, render.ops)
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      res.render(render.file, render.ops);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });


  app.post("/login",
    body('nickname').not().isEmpty().withMessage('Please provide a valid nickname'),
    body('password').not().isEmpty().withMessage('Password cannot be empty'),
    validateRequest,
    async (req, res) => {
      console.log("at post /login")
      let extras: any = null;
      try {
        // let loginOrMain = null
        let render = {
          file: './partials/wellcome.hbs', ops: {
          }
        }

        try {
          const [accessToken, refreshToken] = await Container.get(AuthService).LogIn(req.body as User)
          const cookieRefTokenExp = new Date(new Date().getTime() + ms(config.jwtRefreshTokenExpIn))
          res.cookie(config.jwtCookieName, refreshToken, {
            httpOnly: true,
            sameSite: true,
            // sameSite: "strict",
            // path: '/api/auth',
            expires: cookieRefTokenExp
          });

          res.setHeader("HX-Trigger",
            JSON.stringify({
              loginSuccess: {
                accesToken: accessToken,
                // refTokenExp: cookieRefTokenExp.getTime() / 1000
              }
            })
          )
          res.cookie("refTokenExp", cookieRefTokenExp.getTime() / 1000);

        } catch (error) {
          console.log("Login error...")
          render.file = './partials/login.hbs'
          render.ops = { ...render.ops, ...{ layout: false, error: error } }
          // loginOrMain = pug.compileFile('src/views/_login.pug');
          // loginOrMain = loginOrMain({ error: error })
        }
        res.render(render.file, render.ops)

        // res.send(loginOrMain)
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "An error occurred while fetching data." });
      }
    });


}
