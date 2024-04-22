import { Router } from "express";
import { checkAccessToken } from "../../middlewares/jwtHandler";
import { htmxFolderConfigMap } from "../../../config/htmxFolderConfigMap";

export default (app: Router) => {

  app.get("/navbar", checkAccessToken, async (req, res) => {
    console.log("partial render /navbar")
    try {
      res.render(htmxFolderConfigMap.components.navbar,
        { ...req.GlobalTemplates }
      )
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}
