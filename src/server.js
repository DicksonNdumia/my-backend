import express, { json } from "express";
import chalk from "chalk";
import { myLogger } from "./middlewares/isLogged.js";
import cors from "cors";
import { errorHandler } from "./middlewares/error.handler.js";
import pool from "./config/db.config.js";
import AuthRoutes from "./routes/auth.routes.js";
import EventRoutes from "./routes/events.routes.js";
import BookEvents from "./routes/booking.routes.js";
import CommentRoutes from "./routes/comment.routes.js";
import ReviewRoutes from "./routes/review.routes.js";

const app = express();
const port = 3000;

app.use(express.json());
const allowedOrigins = ["http://localhost:4200", "https://your-frontend.com"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(myLogger);

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/events", EventRoutes);
app.use("/api/v1/bookings", BookEvents);
app.use("/api/v1/comments", CommentRoutes);
app.use("/api/v1/reviews", ReviewRoutes);

app.use(errorHandler);

pool
  .connect()
  .then(() => console.log(chalk.yellow("Db Connected")))
  .catch((err) => console.error(chalk.red("connection error", err)));

app.listen(port, () => {
  console.log(chalk.yellow(`App listening on Port ${port}`));
});
