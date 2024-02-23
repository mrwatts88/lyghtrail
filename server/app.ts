import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import createHttpError from "http-errors";
import logger from "morgan";
import path from "path";
import dueTasksRouter from "~/routes/due-tasks";
import indexRouter from "~/routes/index";
import tasksRouter from "~/routes/tasks";

const app = express();
app.use(cors());
app.use(express.static(path.join(path.resolve(), "public")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/tasks", tasksRouter);
app.use("/due-tasks", dueTasksRouter);

app.use(function (req, res, next) {
  next(createHttpError(404));
});

app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
} as express.ErrorRequestHandler);

export default app;
