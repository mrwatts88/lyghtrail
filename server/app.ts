import { StrictAuthProp } from "@clerk/clerk-sdk-node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import createHttpError from "http-errors";
import logger from "morgan";
import path from "path";
import dueTasksRouter from "~/routes/due-tasks";
import indexRouter from "~/routes/index";
import tasksRouter from "~/routes/tasks";
import Redis from "ioredis";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

const client = new Redis(process.env.REDIS_TLS_URL as string, {
  tls: {
    rejectUnauthorized: false,
  },
});

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 200,
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers

	// Redis store configuration
	store: new RedisStore({
		// @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
		sendCommand: (...args: string[]) => client.call(...args),
	}),
})

const app = express();
app.use(limiter);
app.use(cors());
app.use(express.static(path.join(path.resolve(), "dist")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/tasks", tasksRouter);
app.use("/due-tasks", dueTasksRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(path.resolve(), "dist", "index.html"));
});

app.use(function (req, res, next) {
  next(createHttpError(404));
});

app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
} as express.ErrorRequestHandler);

export default app;
