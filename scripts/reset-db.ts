import { unlinkSync } from "node:fs";
const { DB_LOCATION } = process.env;
if (!DB_LOCATION) {
  throw new Error("DB_LOCATION is not defined");
}

unlinkSync(DB_LOCATION);
