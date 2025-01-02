import { Router } from "express";
import Note from "../../database/models/note";
import { getDatabase } from "../../database/db";

const router = Router();

const database = getDatabase();
const note = new Note(database);

router.get("/", async (_, res) => {
  try {
    const notes = note.all();
    res.send({
      message: "Notes fetched successfully",
      data: notes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.get("/scheduled", async (_, res) => {
  try {
    const notes = note.allScheduled();
    res.send({
      message: "Scheduled notes fetched successfully",
      data: notes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.get("/posted", async (_, res) => {
  try {
    const notes = note.allPosted();
    res.send({
      message: "Posted notes fetched successfully",
      data: notes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { body } = req.body;
    const newNote = note.create({ body });
    if (typeof newNote === "string") {
      res.status(400).send({
        message: newNote,
      });
      return;
    }
    res.send({
      message: "Note created successfully",
      data: newNote,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.patch("/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!Number(id)) {
      res.status(400).send({
        message: "Invalid ID",
      });
      return;
    }
    const update = req.body;
    const updated = note.update(Number(id), update);
    if (typeof updated === "string") {
      res.status(400).send({
        message: updated,
      });
      return;
    }
    res.send({
      message: "Note updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.patch("/post/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!Number(id)) {
      res.status(400).send({
        message: "Invalid ID",
      });
      return;
    }
    note.markPosted(Number(id));
    res.send({
      message: "Note posted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

export default router;
