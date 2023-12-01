import express from "express";
import auth from "../middlewares/auth.js";
import {
  sendRequest,
  fetchRequest,
  requestStatus,
} from "../controllers/requestController.js";

const router = express.Router();

router.get("/fetch-request", auth, fetchRequest);
router.post("/send-request", auth, sendRequest);
router.patch("/request-status", auth, requestStatus);
// router.post("/deposit", auth, deposit);

export default router;
