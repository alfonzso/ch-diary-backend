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
    console.log("partial render /main ")
    let render = { file: htmxFolderConfigMap.main, ops: {} }
    try {
      switch (true) {
        case req.currentUrl.includes('daily-course'):
          render.ops = renderFullPage(getDailyCurses())
          break;
        case req.currentUrl.includes('diary'):
          render.ops = renderFullPage(getAllDiary())
          break;
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
