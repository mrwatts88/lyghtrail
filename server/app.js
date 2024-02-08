import cookieParser from "cookie-parser";
import express from "express";
import createHttpError from "http-errors";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import tasksRouter from "./routes/tasks.js";
import dueTasksRouter from "./routes/due-tasks.js";
import cors from 'cors'

const app = express();
app.use(cors())


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/tasks", tasksRouter);
app.use("/due-tasks", dueTasksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createHttpError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
