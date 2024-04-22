import { Router } from "express";
import { htmxFolderConfigMap } from "../../../config/htmxFolderConfigMap";

export default (app: Router) => {

  // app.get("/home", async (req, res) => {
  //   let render = { file: "", ops: {} }
  //   console.log("get render /")
  //   console.log(" isLoggedIn --> ", req.isLoggedIn)

  //   try {
  //     render.file = htmxFolderConfigMap.components.wellcome
  //     res.render(render.file, { ...render.ops, ...req.GlobalTemplates })
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     res.status(500).json({ error: "An error occurred while fetching data." });
  //   }
  // });

}
