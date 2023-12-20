import { Router } from "express";
import { refreshToAccess } from '../../middlewares/jwtHandler';
import pug from "pug";

export default (app: Router) => {

  // app.get("/logout", refreshToAccess, async (req, res) => {
  app.get("/logout", async (req, res) => {
    console.log("at /logout");
    try {
      let logout = null
      logout = pug.compileFile('src/views/_main.pug');
      logout = logout()
      res.clearCookie("refresh_token");
      res.setHeader("HX-Trigger", "faf")
      res.send(logout)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}
