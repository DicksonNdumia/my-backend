import express from "express";
import {
  isUser,
  isUserOrModerator,
  protect,
} from "../middlewares/protect/protect.js";
import {
  addComments,
  deleteComments,
  editComment,
  getMyComments,
} from "../controllers/comments.js";

const router = express.Router();

router.post("/:event_id", protect, isUserOrModerator, addComments);
router.delete("/:id", protect, isUser, deleteComments);
router.put("/:event_id", protect, isUser, editComment);
router.get("/", protect, isUser, getMyComments);

export default router;
