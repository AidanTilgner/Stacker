import Database, { Statement } from "bun:sqlite";
import { Model } from "../index.d";

export type Note = {
  id: number;
  body: string;
  scheduledAt: string | null;
  postedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export default class NoteModel extends Model {
  constructor(db: Database) {
    super(db, {
      name: "Note",
      tableName: "notes",
    });
  }

  public createTable(): Statement {
    const createNotesTable = this.database.prepare(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        body TEXT,
        scheduledAt VARCHAR(255) NULL,
        postedAt VARCHAR(255) NULL,
        uri VARCHAR(255) NULL,
        createdAt VARCHAR(255),
        updatedAt VARCHAR(255)
      )
    `);
    return createNotesTable;
  }

  public all(): Note[] {
    const getNotes = this.database.prepare(`
      SELECT * FROM notes
    `);
    return getNotes.all() as Note[];
  }

  public create({ body }: Partial<Note>) {
    try {
      if (!body) {
        throw new Error("Body is required");
      }

      const insertNote = this.database.prepare(`
        INSERT INTO notes (body, createdAt, updatedAt) VALUES (?, ?, ?, ?)
      `);
      insertNote.run(body, new Date().toISOString(), new Date().toISOString());
      return true;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  public delete(id: number) {
    const deleteNote = this.database.prepare(`
      DELETE FROM notes WHERE id = ?
    `);
    deleteNote.run(id);
  }

  public find(id: number): Note {
    const findNote = this.database.prepare(`
      SELECT * FROM notes WHERE id = ?
    `);
    return findNote.get(id) as Note;
  }

  public markPosted(id: number) {
    const postNote = this.database.prepare(`
      UPDATE notes SET postedAt = ? WHERE id = ?
    `);
    postNote.run(new Date().toISOString(), id);
  }

  public update(id: number, note: Partial<Note>) {
    try {
      const guarded = ["id", "createdAt", "updatedAt"];
      const updaters: { key: string; value: any }[] = [];
      Object.keys(note).forEach((key) => {
        if (guarded.includes(key)) {
          return;
        }
        updaters.push({ key, value: note[key as keyof Note] });
      });

      const updateNote = this.database.prepare(`
        UPDATE notes SET ${updaters.map((u) => `${u.key} = ?`).join(", ")} WHERE id = ?
      `);

      const values = updaters.map((u) => u.value);
      updateNote.run(...values, id);
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  public allScheduled(): Note[] {
    const getScheduledNotes = this.database.prepare(`
      SELECT * FROM notes WHERE scheduledAt IS NOT NULL
    `);
    return getScheduledNotes.all() as Note[];
  }

  public allPosted(): Note[] {
    const getPostedNotes = this.database.prepare(`
      SELECT * FROM notes WHERE postedAt IS NOT NULL
    `);

    return getPostedNotes.all() as Note[];
  }
}
