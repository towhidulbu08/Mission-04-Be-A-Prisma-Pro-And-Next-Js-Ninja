import express, { Application, Request, Response } from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { globalErrorHandler } from "./middlewares/globalError";
import notFound from "./middlewares/notFound";
import { authRoutes } from "./modules/auth/auth.routes";
import { commentRoutes } from "./modules/comment/comment.routes";
import { postRoutes } from "./modules/post/post.routes";
import { userRoutes } from "./modules/user/user.routes";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

//? not found route

app.use(notFound);

app.use(globalErrorHandler);

export default app;
