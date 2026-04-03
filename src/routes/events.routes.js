import express from "express";
import { isModerator, protect } from "../middlewares/protect/protect.js";
import {
  createEvent,
  deleteEventById,
  getEvents,
  getEventsById,
  updateEvents,
} from "../controllers/events.js";
import upload from "../middlewares/upload/upload.js";

const router = express.Router();

router.post("/", protect, isModerator, upload.single("image"), createEvent);
router.get("/", getEvents);
router.patch(
  "/:id",
  protect,
  isModerator,
  upload.single("image"),
  updateEvents,
);
router.get("/:id", getEventsById);
router.delete("/:id", protect, isModerator, deleteEventById);

export default router;
