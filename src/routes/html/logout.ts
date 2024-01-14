import { Router } from "express";
import { clearAllCookies } from "../../utils/common";
import { htmxFolderConfigMap } from "../../../config/htmxFolderConfigMap";

export default (app: Router) => {

  app.get("/logout", async (req, res) => {
    console.log("partial render /logout");
    try {
      clearAllCookies(req, res)
      res.setHeader("HX-Trigger", "logoutSuccess")
      res.setHeader("HX-Redirect", "/")
      res.render(htmxFolderConfigMap.components.wellcome)
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}
