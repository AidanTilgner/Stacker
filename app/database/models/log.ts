import { Database } from "bun:sqlite";
import { Model } from "../index.d";

export type Log = { id: number; message: string; createdAt: string };

export default class LogModel extends Model {
  name = "Log";
  tableName = "logs";

  constructor(db: Database) {
    super(db, {
      name: "Log",
      tableName: "logs",
    });
  }

  createTable() {
    const createLogsTable = this.database.prepare(`
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT,
        createdAt TEXT
      )
    `);

    return createLogsTable;
  }

  all(): Log[] {
    const getLogs = this.database.prepare(`
      SELECT * FROM logs
    `);

    return getLogs.all() as Log[];
  }

  create(message: string) {
    const insertLog = this.database.prepare(`
      INSERT INTO logs (message, createdAt) VALUES (?, ?)
    `);

    insertLog.run(message, new Date().toISOString());
  }

  delete(id: number) {
    const deleteLog = this.database.prepare(`
      DELETE FROM logs WHERE id = ?
    `);

    deleteLog.run(id);
  }

  find(id: number): Log {
    const findLog = this.database.prepare(`
      SELECT * FROM logs WHERE id = ?
    `);

    return findLog.get(id) as Log;
  }
}
