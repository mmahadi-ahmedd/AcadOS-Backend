import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler";
import notFound from "./middlewares/notFound";
import routes from "./routes";

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

app.get("/", (req, res) => {
  res.json({ success: true, message: "AcadOS API is running", data: null });
});

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
