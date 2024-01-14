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
    let tmpRender: typeof render
    try {
      switch (req.currentUrl) {
        case 'daily-course':
          // tmpRender = getDailyCurses()
          render.ops = renderFullPage(getDailyCurses())
          // render.ops = {
          //   ...tmpRender.ops,
          //   helpers: {
          //     dynamicPage() { return tmpRender.file.replace("./partials/", "") }
          //   },
          // }
          break;
        case 'diary':
          render.ops = renderFullPage(getAllDiary())
          // tmpRender = getAllDiary()
          // render.ops = {
          //   ...tmpRender.ops,
          //   helpers: {
          //     dynamicPage() { return tmpRender.file.replace("./partials/", "") }
          //   },
          // }
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
