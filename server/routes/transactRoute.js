import express from "express";
import auth from "../middlewares/auth.js";
import {
  verifyUserAccount,
  transfer,
  fetchTransacts,
  deposit,
} from "../controllers/transactController.js";

const router = express.Router();

router.post("/transfer", auth, transfer);
router.post("/verify-account", verifyUserAccount);
router.get("/fetch-transacts", auth, fetchTransacts);
router.post("/deposit", auth, deposit);

export default router;
