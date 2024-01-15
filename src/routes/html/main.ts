import { Router } from "express";
import { getDailyCurses } from "./dailyCourse";
import { getAllDiary } from "./allDiary";
import { htmxFolderConfigMap } from "../../../config/htmxFolderConfigMap";

type CustomRenderType = {
  file: string;
  ops: {};
}

const renderFullPage = (render: CustomRenderType) => {
  return {
    ...render.ops,
    helpers: {
      dynamicPage() { return render.file.replace("./partials/", "") }
    },
  }
}

export default (app: Router) => {

  app.get("/main", async (req, res) => {
    console.log("partial render /main ", req.currentUrl, req.cookies)
    let render = { file: htmxFolderConfigMap.main, ops: {} }
    try {
      switch (true) {
        case req.pageReloadRedirUrl.includes('daily-course'):
        case req.currentUrl.includes('daily-course'):
          res.setHeader("HX-Replace-Url", "/daily-course")
          render.ops = renderFullPage(getDailyCurses())
          break;
        case req.pageReloadRedirUrl.includes('diary'):
        case req.currentUrl.includes('diary'):
          res.setHeader("HX-Replace-Url", "/diary")
          render.ops = renderFullPage(getAllDiary())
          break;
        // TODO: for login page too
      }

      res.render(render.file, {
        ...render.ops, ...req.GlobalTemplates
      })

    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}
