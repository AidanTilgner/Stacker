import { Router } from "express";
import Log from "../database/models/log";
import { getDatabase } from "../database/db";

// Subrouters
import notesRouter from "./notes";

const router = Router();

const log = new Log(getDatabase());

router.use("/notes", notesRouter);

router.get("/logs", async (_, res) => {
  try {
    const logs = log.all();
    res.send({
      message: "Logs fetched successfully",
      data: logs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

export default router;
