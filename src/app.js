import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// COMMON MIDDLEWARES

// config CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// config JSON data
app.use(express.json({ limit: "16kb" }));

// config URL-Encoding
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// config COOKIE-PARSER
app.use(cookieParser());

// config PUBLIC FOLDER
app.use(express.static("public"));

// healthcheck API
import healthCheckRouter from "./routes/healthCheck.routes.js";
app.use("/api/v1/healthcheck", healthCheckRouter);

/**************************************************************************/

// Secured Routes

//user routes
import registerUserRouter from "./routes/user.routes.js";
app.use("/api/v1/users", registerUserRouter);

/*****************************************************/

// TASK ROUTES

import taskRoutes from "./routes/task.routes.js";
// create a task

app.use("/api/v1/tasks", taskRoutes);

export { app };
