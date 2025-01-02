import { Database, Statement } from "bun:sqlite";

export abstract class Model {
  name: string;
  tableName: string;
  database: Database;

  constructor(
    db: Database,
    config: {
      name: string;
      tableName: string;
    },
  ) {
    if (!db) {
      throw new Error("Database is not defined");
    }
    this.database = db;
    this.name = config?.name || "";
    this.tableName = config?.tableName || "";
    this.properties = config?.properties || {};
  }

  public abstract createTable(): Statement;
}
