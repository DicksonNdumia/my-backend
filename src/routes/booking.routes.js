import express from "express";
import {
  isModerator,
  isUser,
  isUserOrModerator,
  protect,
} from "../middlewares/protect/protect.js";
import {
  bookAnEvent,
  deleteBookings,
  getAlleventsDetails,
  getEventAndBooking,
} from "../controllers/bookings.js";

const router = express.Router();

router.post("/:event_id", protect, isUser, bookAnEvent);
router.get("/:event_id", protect, getEventAndBooking);
router.get("/", protect, isModerator, getAlleventsDetails);
router.delete("/:event_id", protect, isUserOrModerator, deleteBookings);

export default router;
