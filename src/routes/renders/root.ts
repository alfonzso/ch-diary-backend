import { Router } from "express";
import { refreshToAccess } from "../../middlewares/jwtHandler";
import pug from "pug";
import { _login } from "../auth";

export default (app: Router) => {
  app.get("/", refreshToAccess, async (req, res) => {
    // app.get("/", async (req, res) => {
    console.log("at /")
    try {
      let index = null;
      let extras = null;
      if (req.decoded !== undefined) {
        extras = {
          isLoggedIn: (req.decoded?.accessToken ?? "").length > 0,
          user: req.decoded?.user,
          exp: req.decoded?.refreshExp
        }
      }
      index = pug.compileFile('src/views/main.pug')
      index = index({
        title: "ChDiary",
        ...extras,
      })
      res.send(index)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

  app.get("/main", refreshToAccess, async (req, res) => {
    console.log("at /main")
    try {
      let loginOrMain = null
      if (req.decoded === undefined) {
        loginOrMain = pug.compileFile('src/views/_login.pug');
        loginOrMain = loginOrMain()
      } else {
        loginOrMain = pug.compileFile('src/views/_main.pug');
        loginOrMain = loginOrMain({
          isLoggedIn: (req.decoded?.accessToken ?? "").length > 0,
          user: req.decoded?.user,
          exp: req.decoded?.refreshExp
        })
      }

      res.send(loginOrMain)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

  app.post("/login", refreshToAccess, async (req, res) => {
    console.log("at /login")
    try {
      let loginOrMain = null

      if (req.decoded !== undefined) {
        loginOrMain = pug.compileFile('src/views/_main.pug');
        res.send(loginOrMain(
          {
            isLoggedIn: (req.decoded?.accessToken ?? "").length > 0,
            user: req.decoded?.user,
            exp: req.decoded?.refreshExp
          }
        ))
        return
      }

      try {
        await _login(req, res)
        loginOrMain = pug.compileFile('src/views/_main.pug');
        loginOrMain = loginOrMain()
        res.setHeader("HX-Trigger", "faf")
      } catch (error) {
        console.log("Login error...")
        loginOrMain = pug.compileFile('src/views/_login.pug');
        loginOrMain = loginOrMain({ error: error })
      }

      res.send(loginOrMain)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

  app.get("/navbar", refreshToAccess, async (req, res) => {
    console.log("at /navbar")
    try {
      let loginOrMain = null

      // if (req.decoded === undefined) {
      //   // loginOrMain = pug.compileFile('src/views/_main.pug');
      //   res.send(null)
      //   return
      // }

      loginOrMain = pug.compileFile('src/views/includes/navbar.pug');
      // loginOrMain = loginOrMain()
      loginOrMain = loginOrMain({
        isLoggedIn: (req.decoded?.accessToken ?? "").length > 0,
        user: req.decoded?.user,
        exp: req.decoded?.refreshExp
      })

      res.send(loginOrMain)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });
}
