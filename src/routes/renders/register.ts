import { Router } from "express";

export default (app: Router) => {

  app.get("/register", async (_, res) => {
    try {
      res.render("_register");
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

}