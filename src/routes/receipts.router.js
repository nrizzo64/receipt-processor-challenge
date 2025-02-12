import express from 'express';
const router = express.Router();
import { process, calculatePoints } from '../controllers/receipts.controller.js';
import validatePayload from '../middleware/validation.js'

router.route("/process").post(validatePayload, process)

router.route("/:id/points").get(calculatePoints)

export default router;