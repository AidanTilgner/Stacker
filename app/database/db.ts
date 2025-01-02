import { Database } from "bun:sqlite";
import { config } from "dotenv";
import Log from "./models/log";
import Note from "./models/note";

config();

const { DB_LOCATION } = process.env;

if (!DB_LOCATION) {
  throw new Error("DB_LOCATION is not defined");
}

const models = {
  Log,
  Note,
};

const database = new Database(DB_LOCATION);

export const getDatabase = () => {
  return database;
};

export const initDatabase = () => {
  const db = getDatabase();

  for (const m of Object.values(models)) {
    const model = new m(db);
    console.info(`Creating ${model.tableName} table...`);
    const statement = model.createTable();
    statement.run();
  }
};
