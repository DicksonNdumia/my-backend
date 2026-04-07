import express from "express";

import {
  createReview,
  deleteReview,
  editReview,
  getReviews,
} from "../controllers/reviews.js";
import { isUser, protect } from "../middlewares/protect/protect.js";

const router = express.Router();

router.post("/:event_id", protect, isUser, createReview);
router.get("/", getReviews);
router.delete("/:id", protect, isUser, deleteReview);
router.put("/:id", protect, isUser, editReview);

export default router;
