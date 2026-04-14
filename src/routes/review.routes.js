import express from "express";

import {
  createReview,
  deleteReview,
  editReview,
  getReviews,
} from "../controllers/reviews.js";
import { isUser, protect } from "../middlewares/protect/protect.js";
import { getWhatIBooked } from "../controllers/bookings.js";

const router = express.Router();

router.post("/:event_id", protect, isUser, createReview);
router.get("/", getReviews);
router.delete("/:id", protect, isUser, deleteReview);
router.put("/:id", protect, isUser, editReview);
router.get("/my-booking", protect, isUser, getWhatIBooked);

export default router;
