import Express from "express";
import { config } from "dotenv";
import chalk from "chalk";
import { initDatabase } from "./database/db";
import path from "path";

// Routers
import apiRouter from "./api";
import cors from "cors";

config();

initDatabase();

const { PORT } = process.env;

if (!PORT || !Number(PORT)) {
  throw new Error("PORT is not defined or not a number");
}

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
  (_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
  },
);

app.use("/api", apiRouter);

app.use("/", Express.static(path.join(process.cwd(), "public/")));
if (process.env.NODE_ENV === "production") {
  app.get("/*", (_, res) => {
    res.sendFile(path.join(process.cwd(), "dist/index.html"));
  });
}

app.listen(Number(PORT), () => {
  console.info(
    `Lightning server is running on ${chalk.blue(`http://localhost:${chalk.bold(PORT)}`)}`,
  );
});
