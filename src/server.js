import express, { json } from "express";

import { myLogger } from "./middlewares/isLogged.js";

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

app.use(myLogger);

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/events", EventRoutes);
app.use("/api/v1/bookings", BookEvents);
app.use("/api/v1/comments", CommentRoutes);
app.use("/api/v1/reviews", ReviewRoutes);

app.use(errorHandler);

pool
  .connect()
  .then(() => console.log("Db Connected"))
  .catch((err) => console.error("connection error", err));

app.listen(port, () => {
  console.log(`App listening on Port ${port}`);
});
