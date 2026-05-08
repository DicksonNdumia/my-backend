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
import { limiter } from "./middlewares/helper/rateLimiter.js";
const app = express();
const port = 3000;

app.use(express.json());
const allowedOrigins = ["http://localhost:4200", ""];

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
app.use(limiter);

//Routes and endpoints
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/events", EventRoutes);
app.use("/api/v1/bookings", BookEvents);
app.use("/api/v1/comments", CommentRoutes);
app.use("/api/v1/reviews", ReviewRoutes);

app.get("/:id", (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id);

    if (isNaN(parsedId)) {
      return res.status(400).json({
        message: "Bad request!",
      });
    }

    const data = [
      { id: 1, name: "John" },
      { id: 2, name: "Mark" },
      { id: 3, name: "Mary" },
      { id: 4, name: "Mini me" },
    ];

    const checkUser = data.find((user) => user.id === parsedId);

    if (!checkUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    return res.status(200).json({
      message: "Hello world!",
      results: checkUser.name,
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

pool
  .connect()
  .then(() => console.log(chalk.yellow("Db Connected")))
  .catch((err) => console.error(chalk.red("connection error", err)));

app.listen(port, () => {
  console.log(chalk.yellow(`App listening on Port ${port}`));
});
